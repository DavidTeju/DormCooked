"use client";
import {getAuth} from "firebase/auth";
import {addDoc} from "@firebase/firestore";
import {redirect, useRouter} from "next/navigation";
import {collection} from "firebase/firestore";
import {db, firebase_app} from "@/config/firebase/utils";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

const auth = getAuth(firebase_app);

async function storeCookExistence(userID: string) {
    const docRef = await addDoc(collection(db, "Cook"), {
        user: userID,
        events: [],
    });
    alert(docRef)
}

export default function Home() {


    const router = useRouter();
    async function storeRunner(){
        if (auth.currentUser?.uid != undefined) {

            await storeCookExistence(auth.currentUser?.uid as string);
        }else{
            alert("Asdfasdfasdfasdfasdf")
        }
        router.push('/upcomming-meals')
    }
    // runs on page load 1 time
    useEffect(() => {
        // call api or anything
        if (auth.currentUser?.uid == undefined) {
            return;
        }
        storeRunner()

    });
    
    return (
        <div>
            <div className="flex gap-4">
                <p>Setting Everything Up </p>
            <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
            </div>
            
        </div>
    )

}
