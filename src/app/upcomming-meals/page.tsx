"use client";

import PageTitle from "@/components/pageTitle";
import {db, firebase_app} from "@/config/firebase/utils";
import {Meal} from "@/database";
import {faSquarePlus, faUser} from "@fortawesome/free-regular-svg-icons";
import {faBasketShopping, faMapPin} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getAuth} from "firebase/auth";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {collection, DocumentReference, getDoc, getDocs} from "firebase/firestore";
import {query, where} from "@firebase/firestore";


const auth = getAuth(firebase_app);

async function getCookMeals(userID: string): Promise<Meal[]> {
    const withUserID = query(collection(db, "Cook"), where("userID", "==", userID));

    const docs = (await getDocs(withUserID)).docs;
    if(docs.length == 0){
        return [] as Meal[];
    }
    const cook: DocumentReference[] = docs[0].data().events;

    return Promise.all(cook.map(async (meal) =>
            getDoc(meal).then((doc) => {
                const data = doc.data();
                data!.uuid = doc.id;
                return data as Meal;
            })
        )
    );
}

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

export default function upcomingMeals() {
    const [upcomingMeals, setUpcomingMeals] = useState<Meal[]>();
    const [displayOfUpMeals, setDisplayOfUpMeals] =
        useState<React.ReactNode>();
    // const mealsToLoad: Meal[]= [{
    //     name: "salmon salid",
    //     description: "This delicacy contains 60g of pure salmon protein with minimal salt",
    //     ingredients: ["salmon", "salt", "big dick"],
    //     allergens: [],
    //     students: [],
    //     period: [(new Date('March 13, 08 04:20')), (new Date('March 13, 08 08:20'))],
    //     location: "string",
    // },{
    //     name: " salid",
    //     description: "Thisy contains 60g of pure salmon protein with minimal salt",
    //     ingredients: ["salmon", "beef", "big dick"],
    //     allergens: [],
    //     students: [],
    //     period: [(new Date('March 13, 08 00:20')), (new Date('March 13, 08 03:20'))],
    //     location: "string",
    // }]


    // const handleButtonClick = () => {
    //     alert("ASDfasdfasdfa")
    //     redirect("/sign-in");

    // }
    const getFromDataBaseMeals = async () =>{
        let retreavedMeals:  Meal[] = await getCookMeals(auth.currentUser?.uid as string)
        loadMeals(retreavedMeals);

    }

    const loadMeals = async (mealsToLoad: Meal[]) => {

        const listItems = mealsToLoad.map((meal) => (
            <li className="p-8 w-full">
                {monthNames[meal.period[0].getMonth()] + " " + meal.period[0].getDate()} {" "}
                from {meal.period[0].getHours() + ":" + meal.period[0].getMinutes()} {" "}
                to {meal.period[1].getHours() + ":" + meal.period[1].getMinutes()}
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

            </li>
        ));

        setDisplayOfUpMeals(<ul>{listItems}</ul>)


    };

    // runs on page load 1 time
    useEffect(() => {
        // call api or anything
        if (auth.currentUser?.uid == undefined) {
            return;
        }
        getFromDataBaseMeals();
        
    });



    return (
        <div className="text-black m-auto w-5/6 max-w-prose">

            <PageTitle>Upcomming Meals</PageTitle>
            {displayOfUpMeals}
            <div className="w-full text-center m4">
                <Link href="/new-meal"
                      className="mt-4 text-xl text-center hover:bg-sky-200 p-2 rounded-md	"><FontAwesomeIcon
                    icon={faSquarePlus}/> <span>Create New</span></Link>

            </div>
            {/* <div onClick={() => handleButtonClick()} className="mt-4 text-xl text-center hover:bg-sky-200 p-2 rounded-md	" >
                <FontAwesomeIcon icon={faSquarePlus} /> <span>Create New</span>
            </div> */}
        </div>
    )
}
