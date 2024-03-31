"use client"
import {firebase_app} from "@/config/firebase/utils";


import {getAuth, signOut} from "firebase/auth";
import router from 'next/router';

const auth = getAuth(firebase_app);


let email: string | null | undefined = null;
export default function Home() {
    signOut(auth).then(() => {
        // Sign-out successful.
        return router.push("/");
    }).catch((error) => {
        // An error happened.
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 max-w-6xl">

            {/* firebase in nextjs */}
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bold text-center">Firebase in Next.js</h1>
                <p className="text-center">This is a starter template for Firebase in Next.js</p>
            </div>
            <h1>hi {auth.currentUser?.email}</h1>

            {/* form to post data */}


        </main>
    )
}
