import "./modalAddDocs.css";
import { useState, useEffect } from "react";
import { getCarsForCurrentUser } from "../../firebase-config";

export const ModalAddDocs = ({ setOpenModal }) => {
  const [myCars, setMycars] = useState([]);
  const [choisedDoc, setChoisedDoc] = useState("Избери вид документ");

  useEffect(() => {
    getCarsForCurrentUser()
      .then((cars) => {
        setMycars(cars);
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
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="modal-body">
          <h2>{choisedDoc}</h2>
          <label>За автомобил</label>
          <select>
            {myCars.map((car, i) => (
              <option key={i}>
                {car.make} {car.model} {car.year}
              </option>
            ))}
          </select>
          <label>Избере тип документ</label>
          <select onChange={(e) => setChoisedDoc(e.target.value)}>
            <option>Винетка</option>
            <option>Гражданска отговорност</option>
            <option>ГТП</option>
            <option>Автокаско</option>
          </select>
          <label>Валиден от</label>
          <input type="date"></input>
          <label>Валиден до</label>
          <input type="date"></input>
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
