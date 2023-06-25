import "./modalAddDocs.css";
import { useState, useEffect, useContext } from "react";
import { db, getDataFromFirestore } from "../../firebase-config";
import { collection, updateDoc, arrayUnion } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import UserContext from "../context/userContext";

export const ModalUpdateDocs = ({ setOpenUpdateModal, docToUpdate }) => {
  const [myCars, setMycars] = useState([]);
  const [choisedDoc, setChoisedDoc] = useState(docToUpdate.documentType);
  const [choisedCar, setChoisedCar] = useState(docToUpdate.forCar);
  const [validFrom, setValidFrom] = useState(docToUpdate.validFrom);
  const [expireDate, setExpireDate] = useState(docToUpdate.expireDate);
  const [myDocs, setMyDocs] = useState([]);
  const currentUser = useContext(UserContext);

  console.log("TUK", docToUpdate);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMycars(data.cars); // Set the fetched cars in the myCars state
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenUpdateModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="modal-body">
          <h2>{choisedDoc}</h2>
          <label>Избере тип документ</label>
          <select
            defaultValue={choisedDoc}
            onChange={(e) => setChoisedDoc(e.target.value)}
          >
            <option>Винетка</option>
            <option>Гражданска отговорност</option>
            <option>ГТП</option>
            <option>Автокаско</option>
          </select>
          <label>За автомобил</label>
          <select
            value={choisedCar}
            onChange={(e) => setChoisedCar(e.target.value)}
          >
            {myCars.length > 0 ? (
              myCars.map((car, i) => (
                <option key={i}>
                  {car.make} {car.model} {car.year}
                </option>
              ))
            ) : (
              <option>Нямате регистрирани автомобили</option>
            )}
          </select>

          <label>Валиден от</label>
          <input
            type="date"
            defaultValue={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
          ></input>
          <label>Валиден до</label>
          <input
            defaultValue={expireDate}
            type="date"
            onChange={(e) => setExpireDate(e.target.value)}
          ></input>
        </div>

        <div className="footer">
          <button
            onClick={() => {
              setOpenUpdateModal(false);
            }}
            id="cancelBtn"
          >
            Откажи
          </button>
          <button>Редактирай</button>
        </div>
      </div>
    </div>
  );
};
