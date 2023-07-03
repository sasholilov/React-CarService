import axios from "axios";

export const geocodeAddress = async (address) => {
  try {
    const apiKey =
      "pk.eyJ1Ijoic2FzaG9saWxvdiIsImEiOiJjbGpuNzJoOWUxOTRtM2Zub29zNDM3eDBuIn0.iBdkSEovi8dJfRw78z2VXQ";
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey}`;

    const response = await axios.get(url);
    console.log(response);
    if (response.data.features.length > 0) {
      const coordinates = response.data.features[0].geometry.coordinates;
      const latitude = coordinates[1];
      const longitude = coordinates[0];
      return { latitude, longitude };
    } else {
      console.log("No results found for the address.");
    }
  } catch (error) {
    console.log("An error occurred while geocoding:", error);
  }
};
