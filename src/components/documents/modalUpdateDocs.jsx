import "./modal.styles.css";
import { useState, useEffect, useContext } from "react";
import {
  getDataFromFirestore,
  updateDataInFirestore,
} from "../../firebase-config";
import UserContext from "../context/userContext";

export const ModalUpdateDocs = ({ setOpenUpdateModal, docToUpdate }) => {
  const [myCars, setMycars] = useState([]);
  const [choisedDoc, setChoisedDoc] = useState(docToUpdate.documentType);
  const [choisedCar, setChoisedCar] = useState(docToUpdate.forCar);
  const [validFrom, setValidFrom] = useState(docToUpdate.validFrom);
  const [expireDate, setExpireDate] = useState(docToUpdate.expireDate);
  const [myDocs, setMyDocs] = useState([]);
  const currentUser = useContext(UserContext);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMycars(data.cars);
        setMyDocs(data.documents); // Set the fetched cars in the myCars state
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  console.log(docToUpdate, "as");

  const handleUpdateDoc = async () => {
    const docToUpdateObj = {
      id: docToUpdate.id,
      documentType: choisedDoc,
      expireDate: expireDate,
      forCar: choisedCar,
      validFrom: validFrom,
    };

    const dataType = "documents";
    const updatedDocs = await updateDataInFirestore(
      myDocs,
      docToUpdateObj,
      dataType
    );
    setMyDocs(updatedDocs);
    console.log("Document updated successfully!");
    setOpenUpdateModal(false);
  };

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
            {myCars?.length > 0 ? (
              myCars?.map((car, i) => (
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
          <button onClick={() => handleUpdateDoc()}>Редактирай</button>
        </div>
      </div>
    </div>
  );
};
