import { useEffect, useState, useContext, useRef } from "react";
import { geocodeAddress } from "./getGeoCodeAddress";
import { useLoadScript } from "@react-google-maps/api";
import UserContext from "../context/userContext";
import { Loading } from "../loading/loading.component";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import { addDataToFirestore } from "../../firebase-config";

import "leaflet/dist/leaflet.css";
import "./modalServices.style.css";
import { Buttons } from "../buttons/buttons.component";

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
  const { v4: uuidv4 } = require("uuid");

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

  const handleAddService = async () => {
    const service = {
      id: uuidv4(),
      nameOfService: nameOfService,
      city: city,
      address: addressServices,
      telephone: telephone,
      coordinates: coordinates,
    };
    const typeData = "services";
    await addDataToFirestore(service, typeData);
    setOpenModal(false);
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
        <div className="footer-services">
          <Buttons
            buttonStyle="cancel"
            onPush={() => {
              setOpenModal(false);
            }}
          />
          <Buttons buttonStyle="add" onPush={handleAddService} />
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
