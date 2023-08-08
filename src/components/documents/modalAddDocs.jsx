import "./modal.styles.css";
import { useState, useEffect, useContext } from "react";
import {
  getDataFromFirestore,
  addDataToFirestore,
} from "../../firebase-config";
import UserContext from "../context/userContext";

export const ModalAddDocs = ({ setOpenModal }) => {
  const [myCars, setMycars] = useState([]);
  const [choisedDoc, setChoisedDoc] = useState("Винетка");
  const [choisedCar, setChoisedCar] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const currentUser = useContext(UserContext);
  const { v4: uuidv4 } = require("uuid");

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        if (data.cars.length > 0) {
          setMycars(data.cars);
          const firstCar = `${data.cars[0].make} ${data.cars[0].model} ${data.cars[0].year} ${data.cars[0].licenseNumber}`;
          setChoisedCar(firstCar);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  console.log(choisedCar, validFrom, expireDate);

  const handleAddDoc = async () => {
    const document = {
      id: uuidv4(),
      documentType: choisedDoc,
      forCar: choisedCar,
      validFrom: validFrom,
      expireDate: expireDate,
    };
    const typeData = "documents";
    await addDataToFirestore(document, typeData);
    setOpenModal(false);
  };

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
          <h2>{choisedDoc}</h2>
          <label>Избере тип документ</label>
          <select onChange={(e) => setChoisedDoc(e.target.value)}>
            <option>Винетка</option>
            <option>Гражданска отговорност</option>
            <option>ГТП</option>
            <option>Автокаско</option>
          </select>
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

          <label>Валиден от</label>
          <input
            type="date"
            onChange={(e) => setValidFrom(e.target.value)}
          ></input>
          <label>Валиден до</label>
          <input
            type="date"
            onChange={(e) => setExpireDate(e.target.value)}
          ></input>
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
          <button onClick={handleAddDoc}>Добави</button>
        </div>
      </div>
    </div>
  );
};
