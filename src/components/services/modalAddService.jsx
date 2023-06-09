import { useEffect, useState, useContext, useRef } from "react";
import { geocodeAddress } from "./getGeoCodeAddress";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { db, getDataFromFirestore } from "../../firebase-config";
import { collection, updateDoc, arrayUnion } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import UserContext from "../context/userContext";
import { Loading } from "../loading/loading.component";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";

import "leaflet/dist/leaflet.css";
import "./modalServices.style.css";

export const ModalAddService = ({ setOpenModal }) => {
  const [coordinates, setCoordinates] = useState({
    latitude: 42.697863,
    longitude: 23.322179,
  });
  const currentUser = useContext(UserContext);
  const [nameOfService, setNameOfService] = useState("");
  const [city, setCity] = useState("София");
  const [addressServices, setAddressService] = useState("");
  const [telephone, setTelephone] = useState("");
  const [center, setCenter] = useState([42.697863, 23.322179]);
  const [isNewAddress, setIsNewAdrress] = useState(false);
  const customIcon = new Icon({
    iconUrl: require("./../../img/marker-icon.png"),
    iconSize: [38, 38],
  });
  const mapRef = useRef();
  const address = `${addressServices},${city}`;

  useEffect(() => {
    const fetchCoordinates = async () => {
      const result = await geocodeAddress(address);
      console.log("result", result);
      setCoordinates(result);
      setIsNewAdrress(true);
    };

    fetchCoordinates();
  }, [address]);

  useEffect(() => {
    if (isNewAddress) {
      setCenter((prevCenter) => [coordinates.latitude, coordinates.longitude]);
      const map = mapRef.current;
      if (map) {
        map.panTo(center, { animate: true });
      }
    }
  }, [address]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const addServiceToFirestore = async () => {
    const service = {
      nameOfService: nameOfService,
      city: city,
      address: addressServices,
      telephone: telephone,
      coordinates: coordinates,
    };
    try {
      const userCollection = collection(db, "users");
      const userDocRef = doc(userCollection, currentUser.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User document exists, update the 'cars' array field
        await updateDoc(userDocRef, {
          services: arrayUnion(service),
        });
      } else {
        // User document doesn't exist, create a new document
        await setDoc(userDocRef, {
          services: [service],
        });
      }

      setOpenModal(false);
      console.log("Success added");
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log("center", center);

  if (!isLoaded) return <Loading />;
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="modal-body">
          <h2>Регистрация на сервиз</h2>
          <label>Име на сервиза</label>
          <input onChange={(e) => setNameOfService(e.target.value)} />
          <label>Град</label>
          <input onChange={(e) => setCity(e.target.value)} />
          <label>Адрес</label>
          <input onChange={(e) => setAddressService(e.target.value)} />
          <label>Телефонен номер</label>
          <input onChange={(e) => setTelephone(e.target.value)} />
        </div>
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Откажи
          </button>
          <button onClick={addServiceToFirestore}>Добави</button>
        </div>
      </div>
      <MapContainer
        center={center}
        zoom={13}
        ref={mapRef}
        style={{ width: "30%", height: "55%", margin: "20px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {coordinates.latitude && coordinates.longitude && (
          <Marker
            position={[coordinates.latitude, coordinates.longitude]}
            icon={customIcon}
          />
        )}
      </MapContainer>
    </div>
  );
};
