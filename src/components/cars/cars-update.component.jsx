import React from "react";
import { useState, useEffect, useContext } from "react";
import UserContext from "../context/userContext";
import { data } from "../../data";
import { useNavigate } from "react-router-dom";
import "./cars-update.css";
import { Homenotloged } from "../home/homenotloged";
import { getErrorMessageForCar } from "../../config/errorMessages";
import {
  addDataToFirestore,
  updateDataInFirestore,
  deleteDataFromFirestore,
  getDataFromFirestore,
} from "../../firebase-config";
import { Buttons } from "../buttons/buttons.component";
import { NO_IMAGE } from "../../config/config";
const { v4: uuidv4 } = require("uuid");
export const CarsUpdate = () => {
  const currentUser = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredModels, setFilteredModels] = useState([]);
  const [filteredYears, setFilteredYears] = useState([]);
  const [choisedCar, setChoisedCar] = useState({});
  const [myCars, setMycars] = useState([]);
  const [added, setAddet] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setErrorMessage("");
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
    setErrorMessage("");
  };

  const handleYearChange = (event) => {
    const choisedYear = event.target.value;
    setSelectedYear(choisedYear);

    setChoisedCar({
      make: selectedMake,
      model: selectedModel,
      year: choisedYear,
    });
    setErrorMessage("");
  };

  const handleDeleteCar = async (car) => {
    const dataType = "cars";
    const updatedCars = await deleteDataFromFirestore(myCars, car, dataType);
    setMycars(updatedCars);
  };

  const handleUpdateCar = async (car, i) => {
    const updatedCar = {
      id: myCars[i].id,
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

    const dataType = "cars";
    const updatedCars = await updateDataInFirestore(
      myCars,
      updatedCar,
      dataType
    );

    setMycars(updatedCars);
    setAddet(true);
    console.log("Car updated successfully!");
    navigate("/cars");
  };

  if (!currentUser.user) {
    console.log("User not loaded yet.");
    return <Homenotloged />;
  }
  console.log("User is loaded", currentUser.user.uid);

  const handleAddCar = async (data) => {
    const errorMessage = getErrorMessageForCar(data);
    if (errorMessage) {
      setErrorMessage(errorMessage);
      return;
    }

    setErrorMessage("Успешно добавен автомобил!");
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);

    const extendChoisedCar = {
      ...choisedCar,
      id: uuidv4(),
      licenseNumber: "0",
      exactYear: "",
      odometer: "",
      horsePower: "",
      engine: "",
      carImgUrl: NO_IMAGE,
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
        {errorMessage && (
          <span className="error-message-car">{errorMessage}</span>
        )}
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
                  <Buttons
                    buttonStyle="apply"
                    onPush={() => handleUpdateCar(car, i)}
                  />
                  <Buttons
                    buttonStyle="delete"
                    onPush={() => handleDeleteCar(car)}
                  />
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
