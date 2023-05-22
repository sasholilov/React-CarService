import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { auth } from "../../firebase-config";
import { useState, useEffect } from "react";
import { useContext } from "react";
import UserContext from "../context/userContext";

export const Cars = () => {
  const data = {
    make: "Mercedes",
    model: "E-Class",
    year: "W211 (2004-209)",
  };

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
        <input type="text" placeholder="Марка" />
        <input type="text" placeholder="Модел" />
        <input type="text" placeholder="Година" />
        <button onClick={() => addDataToFirestore(data)}>
          Добави автомобил
        </button>
      </section>
    </div>
  );
};
