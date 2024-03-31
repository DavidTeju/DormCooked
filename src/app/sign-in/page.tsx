"use client"

import {useRouter} from 'next/navigation'
import React from 'react'
import {
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
    getAuth,
    signInWithEmailAndPassword
} from "firebase/auth";
import {firebase_app} from "@/config/firebase/utils";


import {Button, InputLabel, Switch} from '@mui/material'
import { red } from '@mui/material/colors';

const auth = getAuth(firebase_app);

const signIn = () => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [userType, setUserType] = React.useState(false)

    const toggle = async () => {




        setUserType(!userType);
    }
    const router = useRouter()

    const handleForm = async (event: React.FormEvent) => {
        event.preventDefault()
        let emailAuths = await fetchSignInMethodsForEmail(auth, email);
        if (emailAuths.length > 0) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // const {user} = userCredential;
                    return router.push("/");
                })
                .catch((error) => {
                    return error
                    // const errorCode = error.code;
                    // const errorMessage = error.message;
                });
        } else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    localStorage.clear();
                    // Signed up
                    // const user = userCredential.user;
                    // need to take to relevent onboarding page
                    if(!userType){
                        return router.push("/onboard-student")
                    }else{
                        return router.push("/onboard-cook")

                    }
                    
                    // ...
                })
                // .catch((error) => {
                    // const errorCode = error.code;
                    // const errorMessage = error.message;
                    // ..
                // });
        }


    }
    return (<div className=" flex justify-center items-center  h-full -w-full">
        <div className=" justify-center flex items-center">

            <form onSubmit={handleForm} className="form flex gap-6  flex-col">
            <InputLabel htmlFor="email">
                <div  className="gap-2 flex items-center">
                <img className="w-8" src="\assets\envelope-solid.svg" alt="Email icon" />
                <input
                    className="rounded-md shink drop-shadow-md border-solid border-2 border-sky-500"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    name="email"
                    id="email"
                    placeholder="example@mail.com"
                /></div>
                </InputLabel>
                <InputLabel  htmlFor="password">
                <div  className="gap-2 flex items-center">
                    <img className="w-8" src = "\assets\lock-solid.svg" alt = "Password icon" />
                    <input className='rounded-md drop-shadow-md border-solid border-2 border-sky-500' onChange={(e) => setPassword(e.target.value)} required type="password" name="password"
                           id="password" placeholder="password"/></div>
                </InputLabel >
                <InputLabel  htmlFor="userType">
                    <span>
                    Student
                    <Switch  onClick={() => toggle()}></Switch>
                    Cook
                    </span>
                </InputLabel >
                <div className ="rounded-md drop-shadow-md border-solid">
                <Button type="submit" className='bordered-button start w-full'>Log In</Button>
                </div>
                
            </form>
        </div>

    </div>);
}


export default signIn
