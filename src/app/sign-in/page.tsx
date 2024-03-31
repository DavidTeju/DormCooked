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

const auth = getAuth(firebase_app);

const signIn = () => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [userType, setUserType] = React.useState(false)

    const toggle = () => {

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


                    return router.push("/")
                })
                .catch((error) => {
                    return error
                    // const errorCode = error.code;
                    // const errorMessage = error.message;
                });
        } else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up
                    // const user = userCredential.user;
                    // need to take to relevent onboarding page
                    return router.push("/");
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
                <InputLabel  htmlFor="email" className=' gap-2 flex flex-col '>
                    <p className=''>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email"
                           placeholder="example@mail.com"/>
                </InputLabel >
                <InputLabel  htmlFor="password">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} required type="password" name="password"
                           id="password" placeholder="password"/>
                </InputLabel >
                <InputLabel  htmlFor="userType">
                    <span>
                    Student
                    <Switch onClick={() => toggle()}></Switch>
                    Cook
                    </span>
                </InputLabel >
                <Button type="submit" className=' text-start w-full'>Log In</Button>
            </form>
        </div>

    </div>);
}


export default signIn
