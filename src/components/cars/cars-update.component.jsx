import React from "react";
import { collection, updateDoc, arrayUnion } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, getDataFromFirestore } from "../../firebase-config";
import { useState, useEffect, useContext } from "react";
import UserContext from "../context/userContext";
import { data } from "../../data";
import { useNavigate } from "react-router-dom";
import "./cars-update.css";
import { Homenotloged } from "../home/homenotloged";
import { addDataToFirestore } from "../../firebase-config";

export const CarsUpdate = () => {
  const currentUser = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [filteredModels, setFilteredModels] = useState([]);
  const [filteredYears, setFilteredYears] = useState([]);
  const [choisedCar, setChoisedCar] = useState({});
  const [myCars, setMycars] = useState([]);
  const [added, setAddet] = useState(false);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMycars(data.cars); // Set the fetched cars in the myCars state
        setAddet(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [added]);

  const handleMakeChange = (event) => {
    const make = event.target.value;
    setSelectedMake(make);

    const selectedMakeData = data.find((car) => car.make === make);
    if (selectedMakeData) {
      const models = selectedMakeData.models.map((model) => model.modelName);
      setFilteredModels(models);
      setSelectedModel("");
      setFilteredYears([]);
    } else {
      setFilteredModels([]);
      setSelectedModel("");
      setFilteredYears([]);
    }
  };

  const handleModelChange = (event) => {
    const model = event.target.value;
    setSelectedModel(model);

    const selectedMakeData = data.find((car) => car.make === selectedMake);
    if (selectedMakeData) {
      const selectedModelData = selectedMakeData.models.find(
        (m) => m.modelName === model
      );
      if (selectedModelData) {
        const yearsSelect = selectedModelData.years;
        setFilteredYears(yearsSelect);
      } else {
        setFilteredYears([]);
      }
    } else {
      setFilteredYears([]);
    }
  };

  const handleYearChange = (event) => {
    const choisedYear = event.target.value;
    setSelectedYear(choisedYear);
    setChoisedCar({
      make: selectedMake,
      model: selectedModel,
      year: choisedYear,
    });
  };

  const handleDeleteCar = async (car) => {
    try {
      const userCollection = collection(db, "users");
      const userDocRef = doc(userCollection, currentUser.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User document exists, remove the car from the 'cars' array field
        const updatedCars = myCars.filter((c) => c !== car);
        await updateDoc(userDocRef, {
          cars: updatedCars,
        });
        setMycars(updatedCars);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateCar = async (car, i) => {
    try {
      const userCollection = collection(db, "users");
      const userDocRef = doc(userCollection, currentUser.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User document exists, find the index of the car in the 'cars' array
        const carIndex = myCars.findIndex((c) => c === car);

        if (carIndex !== -1) {
          // Car found in the array, update the car at the specified index
          const updatedCars = [...myCars];
          const updatedCar = {
            licenseNumber: myCars[i].licenseNumber,
            engine: myCars[i].engine,
            exactYear: myCars[i].exactYear,
            odometer: myCars[i].odometer,
            horsePower: myCars[i].horsePower,
            make: myCars[i].make,
            model: myCars[i].model,
            year: myCars[i].year,
            carImgUrl: myCars[i].carImgUrl,
          };
          updatedCars[carIndex] = updatedCar; // Replace 'updatedCar' with the updated car object

          await updateDoc(userDocRef, {
            cars: updatedCars,
          });

          setMycars(updatedCars);
          setAddet(true);
          console.log("Car updated successfully!");
          navigate("/cars");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!currentUser.user) {
    console.log("User not loaded yet.");
    return <Homenotloged />;
  }
  console.log("User is loaded", currentUser.user.uid);

  const handleAddCar = async (data) => {
    const extendChoisedCar = {
      ...choisedCar,
      licenseNumber: "",
      exactYear: "",
      odometer: "",
      horsePower: "",
      engine: "",
      carImgUrl:
        "https://boodabike.com/wp-content/uploads/2023/03/no-image.jpg",
    };

    const typeData = "cars";
    addDataToFirestore(extendChoisedCar, typeData);
    setAddet(true);
  };

  return (
    <div>
      <section className="container-form-cars">
        <select
          id="make"
          name="make"
          value={selectedMake}
          onChange={handleMakeChange}
        >
          <option value="">Избери марка</option>
          {data.map((car, index) => (
            <option key={index} value={car.make}>
              {car.make}
            </option>
          ))}
        </select>
        <select
          id="model"
          name="model"
          value={selectedModel}
          onChange={handleModelChange}
        >
          <option value="">Избери модел</option>
          {filteredModels.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
        <select
          id="year"
          name="year"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">Избери година</option>
          {filteredYears.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button onClick={() => handleAddCar(choisedCar)}>
          Добави автомобил
        </button>
      </section>

      {myCars?.length > 0 ? (
        <div>
          <h1>Списък с регистрираните автомобили</h1>
          <h3>Актуализация на данни</h3>
          <section className="my-cars-container">
            {myCars?.map((car, i) => (
              <div key={i} className="car-item">
                <h3>
                  {car.make} {car.model} {car.year}
                </h3>
                <label>Регистрационен номер</label>
                <input
                  type="text"
                  placeholder="Въведи регистрационния номер на автомобила"
                  onChange={(e) => (car.licenseNumber = e.target.value)}
                  defaultValue={car.licenseNumber}
                />
                <label>Година на производство</label>
                <input
                  type="number"
                  placeholder="Въведете точна година на производство"
                  onChange={(e) => (car.exactYear = e.target.value)}
                  defaultValue={car.exactYear}
                />
                <label>Текущ километраж</label>
                <input
                  type="number"
                  placeholder="Въведете текущите показатели"
                  onChange={(e) => (car.odometer = e.target.value)}
                  defaultValue={car.odometer}
                />
                <label>Конски сили</label>
                <input
                  type="number"
                  placeholder="Конски сили"
                  onChange={(e) => (car.horsePower = e.target.value)}
                  defaultValue={car.horsePower}
                />
                <label>Двигател</label>
                <input
                  type="text"
                  placeholder="Вид двигател и кубатура"
                  onChange={(e) => (car.engine = e.target.value)}
                  defaultValue={car.engine}
                />
                <label>Изображение</label>
                <input
                  type="text"
                  placeholder="Въведете URL на изображението"
                  onChange={(e) => (car.carImgUrl = e.target.value)}
                />
                <section className="cars-btn">
                  <button onClick={() => handleUpdateCar(car, i)}>
                    Update
                  </button>
                  <button onClick={() => handleDeleteCar(car)}>Delete</button>
                </section>
              </div>
            ))}
          </section>
        </div>
      ) : (
        <h1>Избери марка, модел и година</h1>
      )}
    </div>
  );
};
