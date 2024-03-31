"use client";
import {firebase_app} from "@/config/firebase/utils";
import {Meal, Student} from "@/database";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {faBasketShopping, faMapPin} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getAuth} from "firebase/auth";
import React, {useEffect, useState} from "react";
import {Button, Divider} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";


const auth = getAuth(firebase_app);

// TODO
async function getMatchedMeals(userID: string): Promise<Meal[]> {
    // TODO REMOVE this return
    return [] as Meal[];
}

// TODO
async function rejectOrMatchWithMeal(
    userID: string,
    meal: Meal,
    isConfirming: boolean
) {
    // TODO
}

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function MealComponent({meal}: { meal: Meal }) {
    return <>
        <h1 className="text-4xl w-full text-center mt-5">{dayNames[meal.period[0].getDay()]}</h1>
        <div className="flex justify-around"><p className="text-center">{meal.name}</p>
            <p>            {meal.period[0].getHours() + ":" + meal.period[0].getMinutes()} – {" "}
                {meal.period[1].getHours() + ":" + meal.period[1].getMinutes()}</p></div>

        {meal.imageURL &&
            <img className="aspect-video object-cover border-white border-8" src={meal.imageURL} alt="meal image"/>}

        <p className="p-8 w-full">

            <div className="flex mt-4 text-center">
                <div className=" grow flex flex-col">
                    <FontAwesomeIcon className="h-12" icon={faUser}/>
                    <div>{meal.students.length + " students"}</div>
                </div>
                <div className=" grow flex flex-col">
                    <FontAwesomeIcon className="h-12" icon={faMapPin}/>
                    <div>{meal.location}</div>
                </div>
                <div className="grow flex flex-col">
                    <FontAwesomeIcon className="h-12" icon={faBasketShopping}/>
                    <div>Info ⓘ</div>
                </div>
            </div>
        </p>

    </>

}

export default function MealMatches() {
    const [upcomingMeals, setUpcomingMeals] = useState<Meal[]>();
    const [displayOfUpMeals, setDisplayOfUpMeals] = useState<React.ReactNode>();

    const mealsToLoad: Meal[] = [
        {
            uuid: "Asdf",
            name: "salmon salad",
            description:
                "This delicacy contains 60g of pure salmon protein with minimal salt",
            ingredients: ["salmon", "salt", "big dick"],
            allergens: [],
            students: [],
            period: [new Date("March 13, 08 04:20"), new Date("March 13, 08 08:20")],
            location: "The Yard",
            imageURL: "https://i2.wp.com/www.primaverakitchen.com/wp-content/uploads/2019/05/Easy-Salmon-Salad-Recipe-Primavera-Kitchen-1.jpg"
        },
        {
            uuid: "Asdf",
            name: " salad",
            description:
                "Thisy contains 60g of pure salmon protein with minimal salt",
            ingredients: ["salmon", "beef", "big dick"],
            allergens: [],
            students: ["hey" as unknown as Student, "david" as unknown as Student, "hello" as unknown as Student],
            period: [new Date("March 13, 08 00:20"), new Date("March 13, 08 03:20")],
            location: "Balk Hall",
        },
    ];
    const loadMeals = async (mealsToLoad: Meal[]) => {
        console.log("or did it?")
        const listItems = mealsToLoad.map((meal) => (
            <li className="p-8 w-full">
                {monthNames[meal.period[0].getMonth()] + " " + meal.period[0].getDate()}{" "}
                from {meal.period[0].getHours() + ":" + meal.period[0].getMinutes()} to{" "}
                {meal.period[1].getHours() + ":" + meal.period[1].getMinutes()}
                <div className="flex mt-4 text-center">
                    <div className=" grow flex flex-col">
                        <FontAwesomeIcon className="h-12 mb-2" icon={faUser}/>
                        <div>{meal.students.length + " students"}</div>
                    </div>
                    <div className=" grow flex flex-col">
                        <FontAwesomeIcon className="h-12 mb-2" icon={faMapPin}/>
                        <div>{meal.location}</div>
                    </div>
                    <div className="grow flex flex-col" style={{color: "#6eaac8"}}>
                        <FontAwesomeIcon className="h-12 mb-2" style={{color: "#6eaac8"}} icon={faBasketShopping}/>
                        <div style={{color: "#6eaac8"}}>Info ⓘ</div>
                    </div>
                </div>
            </li>
        ));

        setDisplayOfUpMeals(listItems);
    };

    useEffect(() => {
        // call api or anything
        if (auth.currentUser?.uid == undefined) {
            return;
        }
        // let retreavedMeals:  Meal[] = getCookMeals(auth.currentUser?.uid as string)
        loadMeals(mealsToLoad);
        console.log("enterd")
    }, [true]);

    return (<div className="mt-14">
        {mealsToLoad.map((meal) => (
            <>{MealComponent({meal: meal})}
                <Divider/>
            </>))}
        <Button variant="contained" className="w-1/2 mx-auto rounded-md fixed bottom-1/8"
                style={{position: "fixed", bottom: "5vh", left: "50%", transform: "translateX(-50%)"}}
                startIcon={<AddIcon/>}>Add New</Button>
    </div>);

    // (
    //     <div className="text-black m-auto w-5/6 max-w-prose">
    //         <PageTitle>Meal Matches</PageTitle>
    //         {displayOfUpMeals}
    //     </div>
    // );
}
