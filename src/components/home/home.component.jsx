import "./home.css";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/userContext";
import { Link } from "react-router-dom";
import { getDataFromFirestore } from "../../firebase-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faList,
  faScrewdriverWrench,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";

export const Home = () => {
  const curentUser = useContext(UserContext);
  const [myCars, setMyCars] = useState([]);
  const [myDocs, setMyDocs] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [myRepairs, setMyRepairs] = useState([]);
  const [choisedCar, setChoisedCar] = useState({});

  console.log("Choised CAr", choisedCar);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMyCars(data.cars);
        setMyDocs(data.documents);
        setMyServices(data.services);
        setMyRepairs(data.repairs);
        setChoisedCar(data.cars[0]);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  const handleChoisedCar = (selectedCar) => {
    const [carMake, carLicenseNumber] = selectedCar.split(" - ");
    const selectedCarObj = myCars.find(
      (car) => car.licenseNumber === carLicenseNumber
    );
    setChoisedCar(selectedCarObj);
  };

  const calculateAmount = (carObj) => {
    const { licenseNumber } = carObj;

    const repairsForCar = myRepairs.filter((repair) =>
      repair.forCar.includes(licenseNumber)
    );

    const totalAmount = repairsForCar.reduce(
      (acc, repair) => acc + Number(repair.amount),
      0
    );
    console.log(totalAmount);
    return totalAmount;
  };

  return (
    <div>
      {curentUser.user === null ? (
        <div className="home-login-register">
          <h3>
            Моля влезте в профила си за да ползвате функционалността на сайта
            или ако нямате такъв, направете регистрация!
          </h3>
          <Link to="/sign-in">
            <button>Вход</button>
          </Link>
          <Link to="/register">
            <button>Регистрация</button>
          </Link>
        </div>
      ) : (
        <div>
          <h3>Сервизната книжка на {curentUser.user.displayName}</h3>
          <div className="home-container">
            <div className="home-registered-items">
              <section className="home-registered-item blue">
                <p className="title-registered-item ">
                  Регистрирани автомобили
                </p>
                <FontAwesomeIcon icon={faCar} />
                <p className="count-registered-item">{myCars.length}</p>
              </section>
              <section className="home-registered-item orange">
                <p className="title-registered-item ">Документи</p>
                <FontAwesomeIcon icon={faList} />
                <p className="count-registered-item">{myDocs.length}</p>
              </section>
              <section className="home-registered-item green">
                <p className="title-registered-item ">Записани сервизи</p>
                <FontAwesomeIcon icon={faWarehouse} />
                <p className="count-registered-item">{myServices.length}</p>
              </section>
              <section className="home-registered-item purple">
                <p className="title-registered-item">Ремонти и обслужвания</p>
                <FontAwesomeIcon icon={faScrewdriverWrench} />
                <p className="count-registered-item">{myServices.length}</p>
              </section>
            </div>
            <div className="home-statistic">
              <h3>Статистика на разходите</h3>
              <select onClick={(e) => handleChoisedCar(e.target.value)}>
                {myCars.map((c, i) => (
                  <option key={i}>
                    {c.make} - {c.licenseNumber}
                  </option>
                ))}
              </select>
              <p className="count-registered-item">
                {calculateAmount(choisedCar)}лв
              </p>
            </div>
            <div className="home-recent-items">
              <h3>Последно добавени</h3>
              <p>Запис 1</p>
              <p>Запис 2</p>
              <p>Запис 3</p>
              <p>Запис 4</p>
            </div>
            <div className="home-messages">
              <h3>Съобщения</h3>
              <p>Нямате нови съобщения</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
