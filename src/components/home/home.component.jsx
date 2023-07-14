import "./home.css";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/userContext";
import { Link } from "react-router-dom";
import { getDataFromFirestore } from "../../firebase-config";

export const Home = () => {
  const curentUser = useContext(UserContext);
  const [myCars, setMyCars] = useState([]);
  const [myDocs, setMyDocs] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [myRepairs, setMyRepairs] = useState([]);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMyCars(data.cars);
        setMyDocs(data.documents);
        setMyServices(data.services);
        setMyRepairs(data.repairs);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <div>
      (
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
              <p>Регистрирани автомобили: {myCars.length}</p>
              <p>Документи: {myDocs.length}</p>
              <p>Записани сервизи: {myServices.length}</p>
              <p>Извършени ремонти или обслужвания: {myServices.length}</p>
            </div>
            <div className="home-recent-items">
              <h3>Наскоро добавени</h3>
              <p>Запис 1</p>
              <p>Запис 2</p>
              <p>Запис 3</p>
              <p>Запис 4</p>
            </div>
            <div className="home-statistic">
              <h3>Статистика</h3>
              <p>Запис 1</p>
              <p>Запис 2</p>
              <p>Запис 3</p>
              <p>Запис 4</p>
            </div>
            <div className="home-messages">
              <h3>Съобщения</h3>
              <p>Запис 1</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
