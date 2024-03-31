"use client"
import PageTitle from "@/components/pageTitle";
import {firebase_app} from "@/config/firebase/utils";
import { Day, DaysofWeek } from "@/database";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import {getAuth} from "firebase/auth";
import { list } from "postcss";
import { useState } from "react";
const auth = getAuth(firebase_app);




export default function Home() {
    const [selectedTimes, setSelectedTimes] = useState<Array<Day>>([]);
    const [simpleSelectValue, setSimpleSelectValue] = useState<DaysofWeek | null>();
    const [startTime, setStartTime] = useState<Date>();
    const [endTime, setEndTime] = useState<Date>();
    const [displayOfChoosenTimes, setDisplayOfChoosenTimes] = useState<React.ReactNode>();

    const convertMiliarty = (time: string) : Date => {
        let temp: string = time.split(" ")[0];
        if(time.split(" ")[1] == "PM"){
            temp = (time.split(":")[0]+12) +":"+(time.split(":")[1].split(" ")[0]);
        }
        let today = new Date();

        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        let todayString = mm + '/' + dd + '/' + yyyy;
        return new Date(todayString + " " +  temp/*pass your time*/);
    }
    // TODO
    const handleForm = async (event: React.FormEvent) => {
        event.preventDefault()
        // need to submit the selectedTimes Day
    } 
    const addTime = async () => {
        if(!simpleSelectValue){
            return;
        }
        let simpleDay: DaysofWeek = simpleSelectValue as DaysofWeek;
        let prevList: Array<Day> = selectedTimes;
        let newDay: Day = {
            daysOfWeek:simpleDay,
            Period:[startTime as Date,endTime as Date]

        }
        setSelectedTimes(
             [...prevList, newDay]);

        const listItems = selectedTimes.map((day) =>
            <li>
                {day.daysOfWeek}
                <p>{day.Period[0].getHours() +":" + day.Period[0].getMinutes() }-{day.Period[1].getHours() +":"+day.Period[1].getMinutes()}</p>
            </li>
        );


        setDisplayOfChoosenTimes(<ul>{listItems}</ul>)
        
    } 
    return (

        <div className="text-black	">
            <PageTitle>Student Onboarding</PageTitle>
            {displayOfChoosenTimes}

            
            <form onSubmit={handleForm} className="form flex gap-6  flex-col">

                <p>Select Eating Schedule </p>
                <FormControl fullWidth>
                <InputLabel id="simple-select-label">Day of the Week</InputLabel>
                <Select
                    labelId="simple-select-label"
                    id="simple-select"
                    label="Day of the week"
                    onChange={(e) => setSimpleSelectValue(e.target.value as DaysofWeek)}
                >
                    <MenuItem value={'Sunday' }>Sunday</MenuItem>
                    <MenuItem value={'Monday'}>Monday</MenuItem>
                    <MenuItem value={'Tuesday'}>Tuesday</MenuItem>
                    <MenuItem value={'Wednesday'}>Wensday</MenuItem>
                    <MenuItem value={'Thursday'}>Thrusday</MenuItem>
                    <MenuItem value={'Friday'}>Friday</MenuItem>
                    <MenuItem value={'Saturday'}>Saterday</MenuItem>
                </Select>
                </FormControl>
                start<input onChange={(e) => {
                    // Create a new Date object from the time value
                    setStartTime(convertMiliarty(e.target.value));

                }} aria-label="Time" type="time" />
                end<input onChange={(e) => {
                    setEndTime(convertMiliarty(e.target.value));    
                }} aria-label="Time" type="time" />
                <Button onClick={addTime}>+ add time</Button>
                
                <Button type="submit" className=' text-start w-full'>Submit</Button>
            </form>
            {auth.currentUser?.email}
        </div>
    );
}
