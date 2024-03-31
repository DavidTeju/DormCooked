"use client"

import PageTitle from "@/components/pageTitle";
import {db, firebase_app} from "@/config/firebase/utils";
import {Day, DaysofWeek} from "@/database";
import {useRouter} from "next/navigation";
import {Button, Divider, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

import {getAuth} from "firebase/auth";
import React, {Dispatch, SetStateAction, useState} from "react";
import {MultiSelect} from "react-multi-select-component";
import {addDoc} from "@firebase/firestore";
import {collection} from "firebase/firestore";
import {faCalendar} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {Add as AddIcon} from '@mui/icons-material';


const auth = getAuth(firebase_app);

enum Allergy {
    gluten,
    dairy,
    nuts,
    soy,
}

async function storeStudentPreferences(userID: string, allergies: Allergy[], schedule: Day[]) {
    await addDoc(collection(db, "Student"), {userID: userID, allergies: allergies, schedule: schedule});
}

function ScheduleDayInput({setEndTime, setStartTime, setSimpleSelectValue, i}: {
    setEndTime: Dispatch<SetStateAction<Date>>,
    setStartTime: Dispatch<SetStateAction<Date>>,
    setSimpleSelectValue: Dispatch<SetStateAction<DaysofWeek>>,
    i: number
}) {
    return (
        <div className=" items-center flex">
            <div className="w-2/5 ">
                <FormControl fullWidth>
                    <InputLabel id="simple-select-label">Week Day</InputLabel>
                    <Select
                        labelId="simple-select-label"
                        id="simple-select"
                        label="Week Day"
                        className="bg-white"
                        value="Monday"
                        onChange={(e) => setSimpleSelectValue(e.target.value as DaysofWeek)}
                    >
                        <MenuItem value="Sunday">Sunday</MenuItem>
                        <MenuItem value="Monday">Monday</MenuItem>
                        <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
                        <MenuItem value={"Wednesday"}>Wednesday</MenuItem>
                        <MenuItem value={"Thursday"}>Thursday</MenuItem>
                        <MenuItem value={"Friday"}>Friday</MenuItem>
                        <MenuItem value={"Saturday"}>Saturday</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="m-auto">
                <div className="flex flex-col gap-2">
                    <InputLabel>Start</InputLabel>
                    <input
                        className={"p-2 border border-slate-400 rounded-md"}
                        onChange={(e) => {
                            // Create a new Date object from the time value
                            setStartTime(toMilitaryTime(e.target.value));
                        }}
                        aria-label="Time"
                        type="time"
                    />

                </div>
                <Divider/>
                <div className="flex flex-col gap-2 mt-4">
                    <InputLabel>End</InputLabel>
                    <input
                        className={"p-2 border border-slate-400 rounded-md"}

                        onChange={(e) => {
                            setEndTime(toMilitaryTime(e.target.value));
                        }}
                        aria-label="Time"
                        type="time"
                    />
                </div>
            </div>
        </div>
    );
}

const toMilitaryTime = (time: string): Date => {
    let temp: string = time.split(" ")[0];
    if (time.split(" ")[1] == "PM") {
        temp = time.split(":")[0] + 12 + ":" + time.split(":")[1].split(" ")[0];
    }
    let today = new Date();

    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    let todayString = mm + "/" + dd + "/" + yyyy;
    return new Date(todayString + " " + temp /*pass your time*/);
};

export default function Home() {
    const [selectedTimes, setSelectedTimes] = useState<Array<Day>>([]);
    const [simpleSelectValue, setSimpleSelectValue] =
        useState<DaysofWeek>("Monday");

    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date());
    const [displayOfChoosenTimes, setDisplayOfChoosenTimes] =
        useState<React.ReactNode>();
    const [selectedAllergies, setSelectedAllergies] = useState([]);
    const router = useRouter();


    const handleForm = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedTimes || !selectedAllergies || !auth.currentUser?.uid) {
            alert("Missing fields")
            return;
        }

        await storeStudentPreferences(auth.currentUser?.uid as string, selectedAllergies, selectedTimes);

        router.push("/meal-matches");
    };


    const addTime = async () => {
        if (!simpleSelectValue || !startTime || !endTime) {
            return;
        }
        let simpleDay: DaysofWeek = simpleSelectValue as DaysofWeek;
        let prevList: Array<Day> = selectedTimes;
        let newDay: Day = {
            daysOfWeek: simpleDay,
            period: [startTime as Date, endTime as Date],
        };
        let newArrOfTime = [...prevList, newDay];
        setSelectedTimes(newArrOfTime);

        const listItems = newArrOfTime.map((day) => (
            <li className="mt-2  flex items-center grow bg-gray-300 duration-700 expanding truncate">
                <FontAwesomeIcon className="w-16" icon={faCalendar}/>
                <div className="mr-4 my-2">{day.daysOfWeek}</div>
                <p>
                    {day.period[0].getHours() + ":" + day.period[0].getMinutes()}-
                    {day.period[1].getHours() + ":" + day.period[1].getMinutes()}
                </p>

            </li>
        ));

        setDisplayOfChoosenTimes(<ul className="flex flex-col">{listItems.map((listItem, i) => (
            <div key={i}>{listItem}</div>
        ))}</ul>);
    };

    const options = [
        {label: "Gluten", value: Allergy.gluten},
        {label: "Dairy", value: Allergy.dairy},
        {label: "Nuts", value: Allergy.nuts},
        {label: "Soy", value: Allergy.soy},
    ];
    return (

        <div className="text-black  m-auto w-5/6 max-w-prose p-4">
            <PageTitle>Student Onboarding</PageTitle>
            {displayOfChoosenTimes}

            <form onSubmit={handleForm} className=" mt-5 form flex gap-6  flex-col">
                <p className="text-center">What days and times are you interested in finding Dorm Cooked Meals</p>

                <ScheduleDayInput setEndTime={setEndTime} setStartTime={setStartTime}
                                  setSimpleSelectValue={setSimpleSelectValue} i={0}/>
                <Divider/>
                <div className="w-full flex justify-center">
                    <Button onClick={addTime} variant="outlined" className="w-1/2 mx-auto" startIcon={<AddIcon/>}>Add
                        Time</Button>
                </div>
                <div>
                    <p>Select Allergies</p>
                    <MultiSelect
                        options={options}
                        value={selectedAllergies}
                        onChange={setSelectedAllergies}
                        labelledBy="Select Allergies"

                    />
                </div>
                <Button variant="contained" type="submit">Submit</Button>
            </form>

        </div>
    );
}
