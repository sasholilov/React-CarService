import { useEffect, useState, useContext } from "react";
import { getDataFromFirestore, db } from "../../firebase-config";
import { updateDoc, collection, getDoc, doc } from "firebase/firestore";
import UserContext from "../context/userContext";
import "./services.style.css";

export const Services = () => {
  return (
    <div className="header-services">
      <h1>Добави сервиз</h1>
      <button>Добави</button>
    </div>
  );
};
