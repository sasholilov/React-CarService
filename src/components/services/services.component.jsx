import { useEffect, useState, useContext } from "react";
import { getDataFromFirestore, db } from "../../firebase-config";
import { updateDoc, collection, getDoc, doc } from "firebase/firestore";
import UserContext from "../context/userContext";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Loading } from "../loading/loading.component";
import "./services.style.css";

export const Services = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  if (!isLoaded) return <Loading />;
  return (
    <div className="header-services">
      <GoogleMap
        zoom={10}
        center={{ lat: 42.7094406, lng: 23.2823135 }}
        mapContainerClassName="map-container"
      >
        <Marker position={{ lat: 42.7094406, lng: 23.2823135 }}></Marker>
      </GoogleMap>
    </div>
  );
};
