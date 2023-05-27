import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { auth } from "../../firebase-config";
import { useState, useEffect } from "react";
import { useContext } from "react";
import UserContext from "../context/userContext";

export const Cars = () => {
  const data = [
    {
      make: "Mercedes",
      model: "E-Class",
      year: "W211 (2004-209)",
    },
    {
      make: "BMW",
      model: "5 Series",
      year: "E60 (2004-2009)",
    },
  ];

  const currentUser = useContext(UserContext);

  //const [currentUser, setCurrentUser] = useState(null);
  //
  //useEffect(() => {
  //  const unsubscribe = auth.onAuthStateChanged((user) => {
  //    setCurrentUser(user);
  //  });
  //
  //  return () => {
  //    unsubscribe();
  //  };
  //}, []);

  if (!currentUser.user) {
    console.log("User not loaded yet.");
    return;
  }
  console.log("User is loaded", currentUser.user.uid);

  const addDataToFirestore = async (data) => {
    try {
      const dataCollection = collection(db, "cars");

      const docRef = await addDoc(dataCollection, data);
      const docId = docRef.id;

      const userCollection = collection(db, "users");
      const userDocRef = await addDoc(userCollection, {
        userID: currentUser.user.uid,
        carID: docId,
      });
      console.log("Success added");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <section>
        <label for="make">Избери марка:</label>
        <select id="make" name="make">
          {data.map((car, index) => {
            return (
              <option key={index} value={car.make}>
                {car.make}
              </option>
            );
          })}
        </select>
        <label for="model">Избери модел:</label>
        <select id="model" name="model">
          {data.map((model, index) => {
            return (
              <option key={index} value={model.model}>
                {model.model}
              </option>
            );
          })}
        </select>
        <label for="year">Избери година:</label>
        <select id="year" name="year">
          {data.map((year, index) => {
            return (
              <option key={index} value={year.year}>
                {year.year}
              </option>
            );
          })}
        </select>
        <button onClick={() => addDataToFirestore(data)}>
          Добави автомобил
        </button>
      </section>
    </div>
  );
};
