import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";

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
    const userCredential = await signInWithEmailAndPassword(
      auth,
      signInEmail,
      singInPassword
    );
    console.log(userCredential);
  } catch (error) {
    console.log(error.message);
  }
};

export const getCarsForCurrentUser = async () => {
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
      const cars = userData.cars;
      console.log("Cars for current user:", cars);
      return cars;
    } else {
      console.log("User document does not exist.");
      return {};
    }
  } catch (error) {
    console.log(error.message);
  }
};
