import { useEffect, useState, useContext, useRef } from "react";
import { geocodeAddress } from "./getGeoCodeAddress";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { Loading } from "../loading/loading.component";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./services.style.css";

export const Services = () => {
  const [coordinates, setCoordinates] = useState({});
  const [city, setCity] = useState("София");
  const [addressServices, setAddressService] = useState("");
  const [telephone, setTelephone] = useState("");
  const [center, setCenter] = useState([42.697863, 23.322179]);
  const address = `${addressServices},${city}`;
  const [isNewAddress, setIsNewAdrress] = useState(false);
  const customIcon = new Icon({
    iconUrl: require("./../../img/marker-icon.png"),
    iconSize: [38, 38],
  });
  const mapRef = useRef();

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

  console.log("center", center);

  if (!isLoaded) return <Loading />;
  return (
    <div className="header-services">
      <input
        placeholder="Въведи град"
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        placeholder="Въведи адрес"
        onChange={(e) => setAddressService(e.target.value)}
      />
      <input
        placeholder="Телефонен номер"
        onChange={(e) => setTelephone(e.target.value)}
      />
      <MapContainer center={center} zoom={13} ref={mapRef}>
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

      {/*<GoogleMap
        zoom={10}
        center={{ lat: coordinates.latitude, lng: coordinates.longitude }}
        mapContainerClassName="map-container"
      >
        <Marker
          position={{ lat: coordinates.latitude, lng: coordinates.longitude }}
        ></Marker>
      </GoogleMap>*/}
    </div>
  );
};
