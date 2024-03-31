"use client";

import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useState} from "react";

import router from "next/router";

import {firebase_app} from "@/config/firebase/utils";

const auth = getAuth(firebase_app);

export default function SignInEnforcer({children,}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [validSignIn, setValidSignIn] = useState(false);

    onAuthStateChanged(auth, (user) => {
        setLoading(false);

        setValidSignIn(!!user);
    });

    if (loading) {
        return <></>;
    } else {
        if (validSignIn) {
            return children;
        } else {
            router.push("/sign-in");
        }
    }
}
