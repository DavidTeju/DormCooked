"use client";
import PageTitle from "@/components/pageTitle";
import { firebase_app } from "@/config/firebase/utils";
import { Day, DaysofWeek } from "@/database";
// import { Allergies } from "@/database";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { getAuth } from "firebase/auth";
import { list } from "postcss";
import { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
const auth = getAuth(firebase_app);

enum Allergies {
    gluten,
    dairy,
    nuts,
    soy,
}

export default function Home() {
  const [selectedTimes, setSelectedTimes] = useState<Array<Day>>([]);
  const [simpleSelectValue, setSimpleSelectValue] =
    useState<DaysofWeek | null>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [displayOfChoosenTimes, setDisplayOfChoosenTimes] =
    useState<React.ReactNode>();
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  const convertMiliarty = (time: string): Date => {
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

  // TODO
  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    // need to submit the selectedTimes Day
    // need to submit the selectedAllergies
  };


  const addTime = async () => {
    if (!simpleSelectValue || !startTime || !endTime) {
      return;
    }
    let simpleDay: DaysofWeek = simpleSelectValue as DaysofWeek;
    let prevList: Array<Day> = selectedTimes;
    let newDay: Day = {
      daysOfWeek: simpleDay,
      Period: [startTime as Date, endTime as Date],
    };
    let newArrOfTime = [...prevList, newDay];
    setSelectedTimes(newArrOfTime);

    const listItems = newArrOfTime.map((day) => (
      <li>
        {day.daysOfWeek}
        <p>
          {day.Period[0].getHours() + ":" + day.Period[0].getMinutes()}-
          {day.Period[1].getHours() + ":" + day.Period[1].getMinutes()}
        </p>
      </li>
    ));

    setDisplayOfChoosenTimes(<ul>{listItems}</ul>);
  };
  const options = [
    { label: "Gluten", value: Allergies.gluten },
    { label: "Dairy", value: Allergies.dairy },
    { label: "Nuts", value: Allergies.nuts },
    { label: "Soy", value: Allergies.soy },
  ];
  return (
    <div className="text-black	">
        {/* {simpleSelectValue}
        {JSON.stringify(selectedTimes)} */}
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
            <MenuItem value={"Sunday"}>Sunday</MenuItem>
            <MenuItem value={"Monday"}>Monday</MenuItem>
            <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
            <MenuItem value={"Wednesday"}>Wensday</MenuItem>
            <MenuItem value={"Thursday"}>Thrusday</MenuItem>
            <MenuItem value={"Friday"}>Friday</MenuItem>
            <MenuItem value={"Saturday"}>Saterday</MenuItem>
          </Select>
        </FormControl>
        start
        <input
          onChange={(e) => {
            // Create a new Date object from the time value
            setStartTime(convertMiliarty(e.target.value));
          }}
          aria-label="Time"
          type="time"
        />
        end
        <input
          onChange={(e) => {
            setEndTime(convertMiliarty(e.target.value));
          }}
          aria-label="Time"
          type="time"
        />
        <Button onClick={addTime}>+ add time</Button>
        <div>
          <MultiSelect
            options={options}
            value={selectedAllergies}
            onChange={setSelectedAllergies}
            labelledBy="Select"
          />
        </div>
        <Button type="submit" className=" text-start w-full">
          Submit
        </Button>
      </form>
      {auth.currentUser?.email}
    </div>
  );
}