"use client";

import PageTitle from "@/components/pageTitle";
import { Meal } from "@/database";
import { Button, FormControl, InputLabel } from "@mui/material";
import React from "react";
import { MultiSelect } from "react-multi-select-component";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import { db, firebase_app } from "@/config/firebase/utils";
import { redirect, useRouter } from "next/navigation";
import {
  arrayUnion,
  collection,
  FieldValue,
  updateDoc,
} from "firebase/firestore";
import { addDoc } from "@firebase/firestore";

function storeNewMeal(userID: string, meal: Meal) {
  addDoc(collection(db, "Meals"), meal).then((docRef) => {
    updateDoc(docRef, { events: arrayUnion(docRef) });
  });
}

enum Allergies {
  gluten,
  dairy,
  nuts,
  soy,
}
const auth = getAuth(firebase_app);

function newMeal() {
  const router = useRouter();

  const [foodName, setFoodName] = React.useState<string>("");
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [location, setLocation] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [imageUrlToUpload, setImageUrlToUpload] = React.useState<string>("");
  const [userDate, setUserDate] = React.useState<Date>(new Date(0));
  const [selectedAllergies, setSelectedAllergies] = React.useState([]);
  const [startTime, setStartTime] = React.useState<string>("");
  const [endTime, setEndTime] = React.useState<string>("");

  const convertMiliarty = (time: string): string => {
    let temp: string = time.split(" ")[0];
    if (time.split(" ")[1] == "PM") {
      temp = time.split(":")[0] + 12 + ":" + time.split(":")[1].split(" ")[0];
    }
    return temp;
  };

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    alert(userDate.getUTCDate());
    if (
      startTime == "" ||
      endTime == "" ||
      auth.currentUser?.uid === undefined ||
      foodName == "" ||
      ingredients.length == 0 ||
      location == ""
    ) {
      alert("missing some fields");
    }
    const newUuid = uuid();
    let today = userDate;

    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();

    let todayString = mm + "/" + dd + "/" + yyyy;
    let sDate = new Date(todayString + " " + startTime /*pass your time*/);

    let eDate = new Date(todayString + " " + endTime /*pass your time*/);

    const meal: Meal = {
      uuid: newUuid,
      name: foodName,
      description: description,
      ingredients: ingredients,
      allergens: selectedAllergies,
      students: [],
      period: [sDate, eDate],
      location: location,
    };

    storeNewMeal(auth.currentUser?.uid as string, meal);

    router.push("/upcomming-meals");
  };

  const options = [
    { label: "Gluten", value: Allergies.gluten },
    { label: "Dairy", value: Allergies.dairy },
    { label: "Nuts", value: Allergies.nuts },
    { label: "Soy", value: Allergies.soy },
  ];
  return (
    <div className="m-auto text-black w-5/6 max-w-prose">
      <PageTitle>Post a new meal</PageTitle>
      <form onSubmit={handleForm} className="mt-6 form flex gap-6  flex-col">
        <InputLabel htmlFor="foodName" className=" gap-2  flex-col ">
          <div className="flex items-center place-content-between">
            <p className="text-black ">Food Name</p>
            <input
              onChange={(e) => setFoodName(e.target.value)}
              required
              type="text"
              name="foodName"
              id="foodName"
              placeholder="dish"
              className="p-2 border border-slate-400	bg-lime-100 max-w-lg w-2/3 textFormBg rounded-md"
            />
          </div>
        </InputLabel>
        <InputLabel htmlFor="listOfIngredients" className=" gap-2  flex-col ">
          <div className="flex items-center place-content-between">
            <p className="text-black ">Ingredients</p>
            <input
              onChange={(e) => setIngredients(e.target.value.split(","))}
              required
              type="text"
              name="listOfIngredients"
              id="listOfIngredients"
              placeholder="separate with commas"
              className="p-2 border border-slate-400	bg-lime-100 max-w-lg w-2/3 textFormBg rounded-md"
            />
          </div>
        </InputLabel>
        <InputLabel htmlFor="cookinglocation" className=" gap-2  flex-col ">
          <div className="flex items-center place-content-between">
            <p className="text-black ">location</p>
            <input
              onChange={(e) => setLocation(e.target.value)}
              required
              type="text"
              name="cookinglocation"
              id="cookinglocation"
              placeholder="your dorm kitchen 👀"
              className="p-2 border border-slate-400	bg-lime-100 max-w-lg w-2/3 textFormBg rounded-md"
            />
          </div>
        </InputLabel>
        <InputLabel htmlFor="mealDescription" className=" gap-2  flex-col ">
          <div className="flex items-center place-content-between">
            <p className="text-black ">Description and Price</p>
            <input
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              name="mealDescription"
              id="mealDescription"
              placeholder="any extra details"
              className="p-2 border border-slate-400	bg-lime-100 max-w-lg w-2/3 textFormBg rounded-md"
            />
          </div>
        </InputLabel>
        <InputLabel htmlFor="dataSelecte" className=" gap-2  flex-col ">
          <div className="flex items-center place-content-between">
            <p className="text-black ">Date</p>
            <input
              onChange={(e) => setUserDate(new Date(e.target.value))}
              required
              type="date"
              name="dataSelecte"
              id="dataSelecte"
              className="p-2 border border-slate-400	bg-lime-100 max-w-lg w-2/3 textFormBg rounded-md"
            />
          </div>
        </InputLabel>
        <div className="m-auto">
          <span className="text-black mr-2">start</span>
          <input
            onChange={(e) => {
              // Create a new Date object from the time value
              setStartTime(convertMiliarty(e.target.value));
            }}
            aria-label="Time"
            type="time"
            className="p-2 border border-slate-400	bg-lime-100 textFormBg rounded-md"
          />
          {" - "}
          <span className="text-black mr-2">
          end</span>
          <input
            onChange={(e) => {
              setEndTime(convertMiliarty(e.target.value));
            }}
            aria-label="Time"
            type="time"
            className="p-2 border border-slate-400	bg-lime-100 textFormBg rounded-md"
          />
        </div>
        <InputLabel htmlFor="photoUpload" className=" gap-2  flex-col ">
          <div className="flex  place-content-between">
            <p className="text-black ">Photo URL (Optional)</p>
            <input
              onChange={(e) => setImageUrlToUpload(e.target.value)}
              type="text"
              name="photoUpload"
              id="photoUpload"
              placeholder="static image url"
              className="p-2 border border-slate-400	bg-lime-100 textFormBg max-w-lg w-2/3 rounded-md"
            />
          </div>
        </InputLabel>
        <div>
          <MultiSelect
            options={options}
            value={selectedAllergies}
            onChange={setSelectedAllergies}
            labelledBy="Select"
          />
        </div>
        <Button type="submit" className="textFormBg text-start w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
export default newMeal;
