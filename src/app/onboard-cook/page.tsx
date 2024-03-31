"use client";
import {getAuth} from "firebase/auth";
import {addDoc} from "@firebase/firestore";
import {redirect} from "next/navigation";
import {collection} from "firebase/firestore";
import {db, firebase_app} from "@/config/firebase/utils";

const auth = getAuth(firebase_app);

function storeCookExistence(userID: string) {
    addDoc(collection(db, "Cook"), {
        user: userID,
        events: [],
    });
}

export default function Home() {
    if (auth.currentUser?.uid != undefined) {
        storeCookExistence(auth.currentUser?.uid as string);
    }

    redirect("/");
}
