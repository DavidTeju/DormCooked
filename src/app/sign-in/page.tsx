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
import {Input} from "@/components/ui/input"
import {Mail, Password} from "@mui/icons-material";


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
        event.preventDefault();
        console.log("Handling form")

        let emailAuths = await fetchSignInMethodsForEmail(auth, email);
        console.log(emailAuths)
        if (emailAuths.length > 0) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    localStorage.setItem('role', userType ? 'cook' : 'student')

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
                    localStorage.setItem('role', userType ? 'cook' : 'student')
                    // Signed up
                    // const user = userCredential.user;
                    // need to take to relevent onboarding page
                    if (!userType) {
                        return router.push("/onboard-student")
                    } else {
                        return router.push("/onboard-cook")

                    }

                })
        }


    }
    return (
        <>
            <div className=" flex justify-center items-center flex-col h-full w-full">
                <h1 className="text-4xl relative -top-20">Sign In</h1>
                <div className=" justify-center flex items-center">

                    <form onSubmit={handleForm} className="form flex gap-6  flex-col">
                        <InputLabel htmlFor="email">
                            <div className="gap-2 flex items-center">
                                <Mail/>
                                <Input
                                    className="rounded-md shink drop-shadow-md border-solid border-2 border-sky-500"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="example@mail.com"
                                /></div>
                        </InputLabel>
                        <InputLabel htmlFor="password">
                            <div className="gap-2 flex items-center">
                                <Password/>
                                <Input className='rounded-md drop-shadow-md border-solid border-2 border-sky-500'
                                       onChange={(e) => setPassword(e.target.value)} required type="password"
                                       name="password"
                                       id="password" placeholder="password"/></div>
                        </InputLabel>
                        <InputLabel htmlFor="userType" className="flex justify-between items-center"
                                    style={{display: "flex",}}>
                            Student
                            <Switch onClick={() => toggle()}></Switch>
                            Cook
                        </InputLabel>
                        <div className="rounded-md drop-shadow-md border-solid">
                            <Button variant="contained" type="submit" className='bordered-button start w-full'>Log
                                In</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>);
}


export default signIn
