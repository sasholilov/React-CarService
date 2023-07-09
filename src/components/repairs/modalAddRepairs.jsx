import { useState, useEffect } from "react";
import { db, getDataFromFirestore } from "../../firebase-config";

export const ModalAddRepairs = ({ setOpenModal }) => {
  const [choisedCar, setChoisedCar] = useState("");
  const [choisedService, setChoisedService] = useState("");
  const [typeOfRepair, setTypeOfRepair] = useState("");
  const [amount, setAmount] = useState(0);
  const [myCars, setMyCars] = useState([]);
  const [myServices, setMyServices] = useState([]);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        if (data.cars.length > 0) {
          setMyCars(data.cars);
          const firstCar = `${data.cars[0].make} ${data.cars[0].model} ${data.cars[0].year} ${data.cars[0].licenseNumber}`;
          setChoisedCar(firstCar);
        }

        if (data.services.length > 0) {
          setMyServices((prev) => data.services);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);
  console.log(amount, typeOfRepair);
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="modal-body">
          <h2>Извършен ремонт или обслужване</h2>
          <label>За автомобил</label>
          <select onChange={(e) => setChoisedCar(e.target.value)}>
            {myCars.length > 0 ? (
              myCars.map((car, i) => (
                <option key={i}>
                  {car.make} {car.model} {car.year} {car.licenseNumber}
                </option>
              ))
            ) : (
              <option>Нямате регистрирани автомобили</option>
            )}
          </select>
          <label>В сервиз</label>
          <select onChange={(e) => setChoisedService(e.target.value)}>
            {myServices.length > 0 ? (
              myServices.map((serv, i) => (
                <option key={i}>{serv.nameOfService}</option>
              ))
            ) : (
              <option>Нямате регистрирани сервизи</option>
            )}
          </select>
          <label>Вид извършен ремонт или обслужване</label>
          <input
            type="text"
            onChange={(e) => setTypeOfRepair(e.target.value)}
          />
          <label>Разход</label>
          <input type="number" onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Откажи
          </button>
          <button>Добави</button>
        </div>
      </div>
    </div>
  );
};
