import { useEffect, useState, useContext, useRef } from "react";
import { Loading } from "../loading/loading.component";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ModalAddService } from "./modalAddService";
import { Icon } from "leaflet";
import { getDataFromFirestore, db } from "../../firebase-config";
import { updateDoc, collection, getDoc, doc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Buttons } from "../buttons/buttons.component";
import UserContext from "../context/userContext";

import "leaflet/dist/leaflet.css";
import "./services.style.css";

export const Services = () => {
  const [openModal, setOpenModal] = useState(false);
  const [myServices, setMyServices] = useState([]);
  const [center, setCenter] = useState([42.697863, 23.322179]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useContext(UserContext);
  const customIcon = new Icon({
    iconUrl: require("./../../img/marker-icon.png"),
    iconSize: [38, 38],
  });
  const mapRef = useRef();

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMyServices(data.services);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  }, [openModal]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.panTo(center, { animate: false });
    }
  }, [center]);

  const handleDeleteServices = async (service) => {
    window.confirm("Are you sure you wish to delete this item?");
    try {
      const userCollection = collection(db, "users");
      const userDocRef = doc(userCollection, currentUser.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User document exists, remove the car from the 'cars' array field
        const updatedServcies = myServices.filter((s) => s !== service);
        await updateDoc(userDocRef, {
          services: updatedServcies,
        });
        setMyServices(updatedServcies);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div className="header-services">
        <h3>Запазени сервизи</h3>
        <div className="services-header-right">
          <h3>Добави нов</h3>
          <Buttons buttonStyle={"add"} onPush={() => setOpenModal(true)} />
        </div>
        {openModal && <ModalAddService setOpenModal={setOpenModal} />}
      </div>
      <div className="services-map">
        <div className="name-of-services">
          {loading && <Loading />}
          {myServices?.length === 0 && !loading && (
            <h3 className="message-box">
              Все още нямате регистрирани сервизи!
            </h3>
          )}
          {!myServices && (
            <h3 className="message-box">
              Все още нямате регистрирани сервизи!
            </h3>
          )}

          {!openModal &&
            myServices?.map((s, i) => (
              <div
                key={i}
                className="service-item"
                onClick={() =>
                  setCenter([s.coordinates.latitude, s.coordinates.longitude])
                }
                onMouseEnter={() => setHoveredItem(i)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <h3>{s.nameOfService}</h3>
                <p>
                  <span>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </span>
                  гр. {s.city} {s.address}
                </p>
                <p>
                  <span>
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                  Телефон: {s.telephone}
                </p>
                {hoveredItem === i && (
                  <span
                    className="delete-service-item"
                    onClick={() => handleDeleteServices(s)}
                  >
                    X
                  </span>
                )}
              </div>
            ))}
        </div>
        {openModal ? null : (
          <MapContainer center={center} zoom={13} ref={mapRef}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {myServices?.length > 0 &&
              myServices?.map((m, i) => (
                <Marker
                  key={i}
                  position={[m.coordinates.latitude, m.coordinates.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <h3>{m.nameOfService}</h3>
                    <p>{`${m.city}, ${m.address}`}</p>
                    <p>Телефон: {m.telephone}</p>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};
