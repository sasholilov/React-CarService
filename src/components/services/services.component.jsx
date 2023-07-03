import { useEffect, useState, useContext } from "react";
import { geocodeAddress } from "./getGeoCodeAddress";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Loading } from "../loading/loading.component";
import "./services.style.css";

export const Services = () => {
  const [coordinates, setCoordinates] = useState({});
  const [city, setCity] = useState("София");
  const [addressServices, setAddressService] = useState("");
  const address = `${addressServices},${city}`;

  useEffect(() => {
    const fetchCoordinates = async () => {
      const result = await geocodeAddress(address);
      setCoordinates(result);
    };

    fetchCoordinates();
  }, [address]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  console.log("proverka tuk", coordinates.longitude);

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
      <GoogleMap
        zoom={10}
        center={{ lat: coordinates.latitude, lng: coordinates.longitude }}
        mapContainerClassName="map-container"
      >
        <Marker
          position={{ lat: coordinates.latitude, lng: coordinates.longitude }}
        ></Marker>
      </GoogleMap>
    </div>
  );
};
