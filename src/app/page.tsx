"use client"
import {firebase_app} from "@/config/firebase/utils";

import {getAuth} from "firebase/auth";
const auth = getAuth(firebase_app);


export default function Home() {
    return (
        <main className="text-black	">
            {auth.currentUser?.email}
        </main>
    );
}
