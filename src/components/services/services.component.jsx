import { useEffect, useState, useContext, useRef } from "react";
import { geocodeAddress } from "./getGeoCodeAddress";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { Loading } from "../loading/loading.component";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ModalAddService } from "./modalAddService";
import { Icon } from "leaflet";
import { getDataFromFirestore, db } from "../../firebase-config";
import "leaflet/dist/leaflet.css";
import "./services.style.css";

export const Services = () => {
  const [openModal, setOpenModal] = useState(false);
  const [myServices, setMyServices] = useState([]);
  const [center, setCenter] = useState([42.697863, 23.322179]);
  const customIcon = new Icon({
    iconUrl: require("./../../img/marker-icon.png"),
    iconSize: [38, 38],
  });
  const mapRef = useRef();

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMyServices(data.services);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [openModal]);
  console.log(myServices);

  useEffect(() => {
    setCenter((prevCenter) => [center[0], center[1]]);
    const map = mapRef.current;
    if (map) {
      map.panTo(center, { animate: false });
    }
  }, [center]);

  return (
    <div>
      <div className="header-services">
        <h1>Добави нов сервиз</h1>
        <button onClick={() => setOpenModal(true)}>Добави</button>
        {openModal && <ModalAddService setOpenModal={setOpenModal} />}
      </div>
      {myServices?.map((s, i) => (
        <h2
          onClick={() =>
            setCenter([s.coordinates.latitude, s.coordinates.longitude])
          }
          key={i}
        >
          {s.nameOfService}
        </h2>
      ))}
      {openModal ? null : (
        <MapContainer center={center} zoom={13} ref={mapRef}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {myServices.length > 0 &&
            myServices.map((m) => (
              <Marker
                position={[m.coordinates.latitude, m.coordinates.longitude]}
                icon={customIcon}
              >
                <Popup>
                  {`${m.nameOfService}, 
                  ${m.city}, ${m.address}, 
                  ${m.telephone}`}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      )}
    </div>
  );
};
