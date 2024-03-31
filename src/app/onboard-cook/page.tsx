"use client";
import {getAuth} from "firebase/auth";
import {getDocs, query, setDoc, where} from "@firebase/firestore";
import {redirect} from "next/navigation";
import {collection} from "firebase/firestore";
import { firebase_app } from "@/config/firebase/utils";

const auth = getAuth(firebase_app);

// TODO
function storeCookExistence(userID: string) {
    // TODO
}

export default function Home() {
    if(auth.currentUser?.uid == undefined){
        redirect("/");
    }
    storeCookExistence(auth.currentUser?.uid as string);
    redirect("/");
}