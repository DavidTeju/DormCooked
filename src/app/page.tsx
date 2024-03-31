"use client"

import {auth} from "@/config/firebase/utils";
import UpcomingMeals from "@/app/upcoming-meals/page";
import React from "react";
import MealMatches from "@/app/meal-matches/page";
import {redirect, useRouter} from "next/navigation";


export default function Home() {
    // const UpcomingMeals = dynamic(() => import("@/app/upcoming-meals/page"))
    // const MealMatches = dynamic(() => import("@/app/meal-matches/page"))

    const role = localStorage.getItem("role");

    const isCook = role === "cook";
    const isStudent = role === "student";

    if (isCook) return <UpcomingMeals/>;
    else if (isStudent) return <MealMatches/>;
    // else auth.signOut().then(() => redirect("/sign-in"));
    else auth.signOut().then(() => useRouter().push("/sign-in"));

}

