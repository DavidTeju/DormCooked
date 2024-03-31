import {Allergy, Day, DaysofWeek, Meal, Student} from "@/database";

import {getFirestore} from 'firebase-admin/firestore';

import {initializeApp} from "firebase-admin/app";

initializeApp();

const db = getFirestore();


declare global {
    interface Date {
        addHours(h: number): Date;
    }
}

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}


// get all students who have a scheduled meal that begins within the defined range
async function getAllStudentsForTime(timeStart: Date, timeEnd: Date): Promise<[Student, Day][]> {
    const querySnapshot = await db.collection("Student").get();
    let day: Day;

    return querySnapshot.docs.map(
        (doc) => doc.data() as Student)
        .map(
            (student) => {
                for (const scheduleDay of student.schedule) {
                    if (day.period[0].getDay() === timeStart.getDay()) {
                        const scheduleDayStart = makeEpochDate(day.period[0]);
                        if (scheduleDayStart >= timeStart && scheduleDayStart <= timeEnd) {
                            return [student, scheduleDay] as [Student, Day]
                        }
                    }
                }
                return [student, null];
            }
        ).filter((tuple) => tuple[1] !== null) as [Student, Day][]; // filter out students who don't have a meal scheduled for the time
}

//get all meals with at least 30 minutes of overlap with the defined range
async function getAllMealsForTime(timeStart: Date, timeEnd: Date): Promise<Meal[]> {
    const querySnapshot = await db.collection("Meal").get();

    return querySnapshot.docs.map(
        doc => doc.data() as Meal)
        .filter(
            meal => getOverlapInMinutes(meal.period, [timeStart, timeEnd]) >= 30
        );
}

function makeEpochDate(date: Date): Date {
    date.setDate(1);
    date.setMonth(1);
    date.setFullYear(1970);
    return date;
}

function dayNumToString(dayNum: number): DaysofWeek {
    switch (dayNum) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        default:
            return "Saturday";
    }
}

function getOverlapInMinutes(range1: [Date, Date], range2: [Date, Date]) {
    const [start1, end1] = range1.map(makeEpochDate);
    const [start2, end2] = range2.map(makeEpochDate);

    const latestStart = new Date(Math.max(start1.getTime(), start2.getTime()));

    const earliestEnd = new Date(Math.min(end1.getTime(), end2.getTime()));

    const overlap = earliestEnd.getTime() - latestStart.getTime();

    return overlap > 0 ? Math.floor(overlap / 60000) : 0;
}

async function reprocessStudentForMeal(meal: Meal, student: Student) {
    for (const scheduleDay of student.schedule) {
        // find the day that the meal is scheduled for
        if (dayNumToString(meal.period[0].getDay()) === scheduleDay.daysOfWeek
            && getOverlapInMinutes(meal.period, scheduleDay.period) < 30) {
            // if the overlap is at least 30 minutes, that is the period the meal is scheduled for
            const mealsAtTime = (await getAllMealsForTime(
                scheduleDay.period[0],
                scheduleDay.period[1]))
                .filter(
                    (meal) => student.allergies.some(
                        (allergy: Allergy) => meal.allergens.includes(allergy)
                    )
                ).filter((each) => each !== meal);
            // redo the selection process without the current meal
            weightedSelect(mealsAtTime).students.push(student);

            meal.students = meal.students.filter((s) => s.userID !== student.userID);

            const mealRef = db.collection("Meal").doc(meal.uuid);

            mealRef.set(meal);

            return;
        }
    }
}

async function process() {
    // get all students who have a scheduled meal for next processing batch
    const studentsToProcess = await getAllStudentsForTime(new Date().addHours(68), new Date().addHours(72));
    const batch = db.batch();

    let batchCapacityLeft = 500;

    for (const [student, scheduleDay] of studentsToProcess) {
        const mealsAtTime = (await getAllMealsForTime(
            scheduleDay.period[0],
            scheduleDay.period[1]))
            .filter(
                (meal) => student.allergies.some(
                    (allergy: Allergy) => meal.allergens.includes(allergy)
                )
            );

        const selectedMeals = weightedSelect(mealsAtTime);
        selectedMeals.students.push(student);

        batch.set(db.collection("Meal").doc(selectedMeals.uuid), selectedMeals);
        batchCapacityLeft--;

        if (!batchCapacityLeft) {
            await batch.commit();
            batchCapacityLeft = 500;
        }
    }

    await batch.commit();
}

function weightedSelect(arr: Meal[]): Meal {
    let weighted: Meal[] = [];
    weighted = weighted.concat(...arr.map((meal: Meal) => Array(Math.ceil(1000 / meal.students.length)).fill(meal)));
    return weighted[Math.floor(Math.random() * weighted.length)]
}
