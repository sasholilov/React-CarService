import "./home.css";
import { Loading } from "../loading/loading.component";
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
  const [displayedAmount, setDisplayedAmount] = useState(0);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMyCars(data.cars);
        setMyDocs(data.documents);
        setMyServices(data.services);
        setMyRepairs(data.repairs);
        setChoisedCar(data.cars[0] ? data.cars[0] : 0);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [curentUser]);

  useEffect(() => {
    const finalAmount = calculateAmount(choisedCar);
    let currentAmount = 0;
    const interval = setInterval(() => {
      currentAmount += Math.ceil((finalAmount - currentAmount) / 10); // Increment by 1/10th of the remaining difference
      setDisplayedAmount(currentAmount);
      if (currentAmount >= finalAmount) {
        clearInterval(interval); // Stop the interval when the final amount is reached
      }
    }, 15); // Update every 15  milliseconds
    return () => {
      clearInterval(interval); // Cleanup the interval on component unmount
    };
  }, [choisedCar]);

  const handleChoisedCar = (selectedCar) => {
    const [carMake, carLicenseNumber] = selectedCar.split(" - ");
    const selectedCarObj = myCars.find(
      (car) => car.licenseNumber === carLicenseNumber
    );
    setChoisedCar(selectedCarObj);
  };

  const calculateAmount = (carObj) => {
    if (!myCars || myCars.length === 0 || !myRepairs) {
      return 0;
    }
    const { licenseNumber } = carObj;
    const repairsForCar = myRepairs.filter((repair) =>
      repair.forCar.includes(licenseNumber)
    );
    const totalAmount = repairsForCar.reduce(
      (acc, repair) => acc + Number(repair.amount),
      0
    );
    return totalAmount;
  };

  return (
    <div>
      {curentUser.user === null ? (
        <div className="home-login-register">
          <img
            src={process.env.PUBLIC_URL + "/car-service-logo.png"}
            className="logo"
          />
          <h2>
            Моля, влезте в профила си за да ползвате функционалността на сайта
            или ако нямате такъв, направете регистрация!
          </h2>
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
                {myCars ? (
                  <p className="count-registered-item">
                    {myCars ? myCars.length : 0}
                  </p>
                ) : (
                  <p className="count-registered-item">0</p>
                )}
              </section>
              <section className="home-registered-item orange">
                <p className="title-registered-item ">Документи</p>
                <FontAwesomeIcon icon={faList} />
                <p className="count-registered-item">
                  {myDocs ? myDocs.length : 0}
                </p>
              </section>
              <section className="home-registered-item green">
                <p className="title-registered-item ">Записани сервизи</p>
                <FontAwesomeIcon icon={faWarehouse} />
                <p className="count-registered-item">
                  {myServices ? myServices.length : 0}
                </p>
              </section>
              <section className="home-registered-item purple">
                <p className="title-registered-item">Ремонти и обслужвания</p>
                <FontAwesomeIcon icon={faScrewdriverWrench} />
                <p className="count-registered-item">
                  {myRepairs ? myRepairs.length : 0}
                </p>
              </section>
            </div>
            <div className="home-statistic">
              <h3>Статистика на разходите</h3>
              {myCars ? (
                <select onClick={(e) => handleChoisedCar(e.target.value)}>
                  {myCars && myCars.length > 0 ? (
                    myCars.map((c, i) => (
                      <option key={i}>
                        {c.make} - {c.licenseNumber}
                      </option>
                    ))
                  ) : (
                    <option>Нямате автомобили</option>
                  )}
                </select>
              ) : (
                <select>
                  <option>Нямате автомобили</option>
                </select>
              )}

              <p className="total-amount">{displayedAmount}лв</p>
            </div>

            <div className="home-recent-items">
              <h3>Последно добавени</h3>
              {myCars && myCars[myCars.length - 1] && (
                <p>
                  Автомобил:{" "}
                  {`${myCars[myCars.length - 1].make} ${
                    myCars[myCars.length - 1].model
                  } ${myCars[myCars.length - 1].year} с регистрационен номер ${
                    myCars[myCars.length - 1].licenseNumber
                  }`}
                </p>
              )}
              {myDocs && myDocs[myDocs.length - 1] && (
                <p>
                  Документ:{" "}
                  {`${myDocs[myDocs.length - 1].documentType} за ${
                    myDocs[myDocs.length - 1].forCar
                  }`}
                </p>
              )}

              {myServices && myServices[myServices.length - 1] && (
                <p>
                  Сервиз: {myServices[myServices.length - 1].nameOfService} в
                  град {myServices[myServices.length - 1].city}
                </p>
              )}
              {myRepairs && myRepairs[myRepairs.length - 1] && (
                <p>
                  Ремонт:{" "}
                  {`${myRepairs[myRepairs.length - 1].typeOfRepair} на цена
                  ${myRepairs[myRepairs.length - 1].amount}лв за автомобил
                  ${myRepairs[myRepairs.length - 1].forCar}`}
                </p>
              )}
            </div>
            <div className="home-messages">
              <h3>Съобщения</h3>
              <p>Изтичаща винетка!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
