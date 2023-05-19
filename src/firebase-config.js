import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
