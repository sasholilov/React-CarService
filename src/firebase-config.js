import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuc-NZvkMwAojm3zVbtSwcdPm3fRX1Occ",
  authDomain: "car-service-153c3.firebaseapp.com",
  projectId: "car-service-153c3",
  storageBucket: "car-service-153c3.appspot.com",
  messagingSenderId: "826779908018",
  appId: "1:826779908018:web:fc98116fe0581f375a56ab",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signIn = async (signInEmail, singInPassword) => {
  try {
    await signInWithEmailAndPassword(auth, signInEmail, singInPassword);
    return null;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addDataToFirestore = async (data, typeData) => {
  try {
    const userCollection = collection(db, "users");
    const userDocRef = doc(userCollection, auth.currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    console.log("PROVERKA TUK", typeData);
    const updateData = {}; // Създаваме празен обект
    // Добавяме или актуализираме свойството с динамично име
    updateData[typeData] = userDocSnap.exists() ? arrayUnion(data) : [data];

    if (userDocSnap.exists()) {
      // User document exists, update the field
      await updateDoc(userDocRef, updateData);
    } else {
      // User document doesn't exist, create a new document
      await setDoc(userDocRef, updateData);
    }

    console.log("Success added");
  } catch (error) {
    console.log(error.message);
  }
};

export const getDataFromFirestore = async () => {
  try {
    if (!auth.currentUser) {
      console.log("User not loaded yet.");
      return;
    }

    const userCollection = collection(db, "users");
    const userDocRef = doc(userCollection, auth.currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const data = userData;
      console.log("Data for current user:", data);
      return data;
    } else {
      console.log("User document does not exist.");
      return {};
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const updateDataInFirestore = async (
  dataArrayName,
  dataDoc,
  dataType
) => {
  try {
    const userCollection = collection(db, "users");
    const userDocRef = doc(userCollection, auth.currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const docIndex = dataArrayName.findIndex((d) => d.id === dataDoc.id);

      if (docIndex !== -1) {
        const updatedData = [...dataArrayName];
        updatedData[docIndex] = dataDoc;

        const updateObject = {
          [dataType]: updatedData,
        };

        await updateDoc(userDocRef, updateObject);

        console.log("Document updated successfully!");

        return updatedData;
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteDataFromFirestore = async (
  dataArrayName,
  dataDoc,
  dataType
) => {
  try {
    const userCollection = collection(db, "users");
    const userDocRef = doc(userCollection, auth.currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const updatedData = dataArrayName.filter((d) => d.id !== dataDoc.id);

      const updateObject = {
        [dataType]: updatedData,
      };

      await updateDoc(userDocRef, updateObject);

      console.log("firebase", dataDoc);
      console.log("Document deleted successfully!");

      return updatedData;
    }
  } catch (error) {
    console.log(error.message);
  }
};
