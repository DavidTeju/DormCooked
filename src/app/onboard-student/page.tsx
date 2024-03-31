"use client"

import PageTitle from "@/components/pageTitle";
import {db, firebase_app} from "@/config/firebase/utils";
import {Allergy, Day, DaysofWeek} from "@/database";
import {useRouter} from "next/navigation";
// import { Allergies } from "@/database";
import {Button, FormControl, InputLabel, MenuItem, Select,} from "@mui/material";

import {getAuth} from "firebase/auth";
import {useState} from "react";
import {MultiSelect} from "react-multi-select-component";
import {getDocs, query, setDoc, where} from "@firebase/firestore";
import {collection} from "firebase/firestore";
import {faCalendar} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const auth = getAuth(firebase_app);



function storeStudentPreferences(userID: string, allergies: Allergy[], schedule: Day[]) {
    const withUserID = query(collection(db, "Student"), where("userID", "==", userID));
    getDocs(withUserID).then((snap) => {
        snap.forEach((doc) => {
            setDoc(doc.ref, {
                allergies: allergies,
                schedule: schedule,
            });
        });
    });
}

export default function Home() {
    const [selectedTimes, setSelectedTimes] = useState<Array<Day>>([]);
    const [simpleSelectValue, setSimpleSelectValue] =
        useState<DaysofWeek | null>();
    const [startTime, setStartTime] = useState<Date>();
    const [endTime, setEndTime] = useState<Date>();
    const [displayOfChoosenTimes, setDisplayOfChoosenTimes] =
        useState<React.ReactNode>();
    const [selectedAllergies, setSelectedAllergies] = useState([]);
    const router = useRouter();

    const convertMiliarty = (time: string): Date => {
        let temp: string = time.split(" ")[0];
        if (time.split(" ")[1] == "PM") {
            temp = time.split(":")[0] + 12 + ":" + time.split(":")[1].split(" ")[0];
        }
        let today = new Date();

        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        let yyyy = today.getFullYear();

        let todayString = mm + "/" + dd + "/" + yyyy;
        return new Date(todayString + " " + temp /*pass your time*/);
    };

    const handleForm = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedTimes || !selectedAllergies || !auth.currentUser?.uid) {
            alert("Missing fields")
            return;
        }
        console.log(selectedTimes);
        console.log(selectedAllergies);
        console.log(auth.currentUser?.uid);

        storeStudentPreferences(auth.currentUser?.uid as string, selectedAllergies, selectedTimes);

        router.push("/meal-matches");
    };


    const addTime = async () => {
        if (!simpleSelectValue || !startTime || !endTime) {
            return;
        }
        let simpleDay: DaysofWeek = simpleSelectValue as DaysofWeek;
        let prevList: Array<Day> = selectedTimes;
        let newDay: Day = {
            daysOfWeek: simpleDay,
            period: [startTime as Date, endTime as Date],
        };
        let newArrOfTime = [...prevList, newDay];
        setSelectedTimes(newArrOfTime);

        const listItems = newArrOfTime.map((day) => (
            <li className="mt-2  flex items-center grow bg-gray-300 duration-700 expanding truncate">
                <FontAwesomeIcon className="w-16" icon={faCalendar}/>
                <div className="mr-4 my-2">{day.daysOfWeek}</div>
                <p>
                    {day.period[0].getHours() + ":" + day.period[0].getMinutes()}-
                    {day.period[1].getHours() + ":" + day.period[1].getMinutes()}
                </p>

            </li>
        ));

        setDisplayOfChoosenTimes(<ul className="flex flex-col">{listItems.map((listItem, i) => (
            <div key={i}>listItem</div>
        ))}</ul>);
    };
    const options = [
        {label: "Gluten", value: Allergy.gluten},
        {label: "Dairy", value: Allergy.dairy},
        {label: "Nuts", value: Allergy.nuts},
        {label: "Soy", value: Allergy.soy},
    ];
    return (

        <div className="text-black  m-auto w-5/6 max-w-prose p-4">
            {"hi " + auth.currentUser?.email}
            {/* {simpleSelectValue}
        {JSON.stringify(selectedTimes)} */}
            <PageTitle>Student Onboarding</PageTitle>
            {displayOfChoosenTimes}

            <form onSubmit={handleForm} className=" mt-5 form flex gap-6  flex-col">
                <p className="text-center">What days and times are you interested in finding Dorm Cooked Meals</p>
                <div className=" items-center flex">
                    <div className="w-1/2 ">
                        <FormControl fullWidth>
                            <InputLabel id="simple-select-label">Day of the Week</InputLabel>
                            <Select
                                labelId="simple-select-label"
                                id="simple-select"
                                label="Day of the week"
                                onChange={(e) => setSimpleSelectValue(e.target.value as DaysofWeek)}
                            >
                                <MenuItem value={"Sunday"}>Sunday</MenuItem>
                                <MenuItem value={"Monday"}>Monday</MenuItem>
                                <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
                                <MenuItem value={"Wednesday"}>Wensday</MenuItem>
                                <MenuItem value={"Thursday"}>Thrusday</MenuItem>
                                <MenuItem value={"Friday"}>Friday</MenuItem>
                                <MenuItem value={"Saturday"}>Saterday</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className=" w-min m-auto">
                        <div className="flex gap-2">
                            start
                            <input
                                onChange={(e) => {
                                    // Create a new Date object from the time value
                                    setStartTime(convertMiliarty(e.target.value));
                                }}
                                aria-label="Time"
                                type="time"
                            />

                        </div>
                        {"  -  "}
                        <div className="flex gap-2">
                            end
                            <input
                                onChange={(e) => {
                                    setEndTime(convertMiliarty(e.target.value));
                                }}
                                aria-label="Time"
                                type="time"
                            />
                        </div>
                    </div>
                </div>
                <Button onClick={addTime}>+ add time</Button>
                <div>
                    <p>Select Allergies</p>
                    <MultiSelect
                        options={options}
                        value={selectedAllergies}
                        onChange={setSelectedAllergies}
                        labelledBy="Select Allergies"

                    />
                </div>
                <Button type="submit" className=" text-start w-full">
                    Submit
                </Button>
            </form>

        </div>
    );
}
