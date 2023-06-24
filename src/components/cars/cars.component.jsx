import React from "react";
import { getDataFromFirestore } from "../../firebase-config";
import { useState, useEffect, useContext } from "react";
import UserContext from "../context/userContext";
import { Link } from "react-router-dom";
import "./cars-list.css";

export const Cars = () => {
  const currentUser = useContext(UserContext);
  const [myCars, setMycars] = useState([]);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMycars(data.cars);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <div>
      {myCars?.length > 0 ? (
        <div>
          <section className="cars-list-header">
            <h1>Моите автомобили</h1>
            <Link to="/cars/carsupdate">
              <button className="btn-update-car">
                Актуализация на данните
              </button>
            </Link>
          </section>

          <section className="my-cars-list">
            {myCars.map((car, i) => (
              <div key={i} className="list-car-item">
                <img src={car.carImgUrl} />
                <h3>
                  {car.make} {car.model} {car.year}
                </h3>
                <p>
                  Година на производство: <span>{car.exactYear} година</span>
                </p>
                <p>
                  Текущ километраж: <span>{car.odometer} км.</span>
                </p>
                <p>
                  Конски сили: <span>{car.horsePower} к.с.</span>
                </p>
                <p>
                  Двигател: <span>{car.engine}</span>
                </p>
              </div>
            ))}
          </section>
        </div>
      ) : (
        <div className="no-cars">
          <h1>Нямате регистрирани автомобили</h1>
          <Link to="/cars/carsupdate">
            <button>Добави автомобил</button>
          </Link>
        </div>
      )}
    </div>
  );
};
