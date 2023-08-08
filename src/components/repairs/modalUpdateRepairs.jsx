import { useState, useEffect, useContext } from "react";
import {
  getDataFromFirestore,
  deleteDataFromFirestore,
} from "../../firebase-config";
import UserContext from "../context/userContext";
import { updateDataInFirestore } from "../../firebase-config";
import { Buttons } from "../buttons/buttons.component";

export const ModalUpdateRepairs = ({ setOpenUpdateModal, repairToUpdate }) => {
  const [choisedCar, setChoisedCar] = useState(repairToUpdate.forCar);
  const [choisedService, setChoisedService] = useState(repairToUpdate.service);
  const [typeOfRepair, setTypeOfRepair] = useState(repairToUpdate.typeOfRepair);
  const [amount, setAmount] = useState(repairToUpdate.amount);
  const [myCars, setMyCars] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [myRepairs, setMyRepairs] = useState([]);
  const [onDate, setOnDate] = useState(repairToUpdate.onDate);
  const currentUser = useContext(UserContext);

  console.log("check here", repairToUpdate);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        if (data.cars.length > 0) {
          setMyCars(data.cars);
        }

        if (data.services.length > 0) {
          setMyServices((prev) => data.services);
        }
        if (data.repairs.length > 0) {
          setMyRepairs((prev) => data.repairs);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [repairToUpdate]);

  const handleUpdateRepair = async () => {
    const updateRepair = {
      id: repairToUpdate.id,
      typeOfRepair: typeOfRepair,
      service: choisedService,
      onDate: onDate,
      forCar: choisedCar,
      amount: amount,
    };
    const dataType = "repairs";
    const updateRepairs = await updateDataInFirestore(
      myRepairs,
      updateRepair,
      dataType
    );
    setMyRepairs(updateRepairs);
    console.log("Repairs updated successfully!");
    setOpenUpdateModal(false);
  };

  const handleDeleteRepair = async () => {
    const dataType = "repairs";
    const updatedRepairs = await deleteDataFromFirestore(
      myRepairs,
      repairToUpdate,
      dataType
    );
    setMyRepairs(updatedRepairs);
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
          <h2>Извършен ремонт или обслужване</h2>
          <label>За автомобил</label>
          <select
            value={choisedCar}
            onChange={(e) => setChoisedCar(e.target.value)}
          >
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
          <select
            value={choisedService}
            onChange={(e) => setChoisedService(e.target.value)}
          >
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
            defaultValue={typeOfRepair}
          />
          <label>На дата</label>
          <input
            type="date"
            onChange={(e) => setOnDate(e.target.value)}
            defaultValue={onDate}
          />
          <label>Разход</label>
          <input
            type="number"
            onChange={(e) => setAmount(e.target.value)}
            defaultValue={amount}
          />
        </div>

        <div className="footer-modal">
          <Buttons
            buttonStyle={"cancel"}
            onPush={() => {
              setOpenUpdateModal(false);
            }}
          />
          <Buttons buttonStyle={"edit"} onPush={handleUpdateRepair} />
          <Buttons buttonStyle={"delete"} onPush={handleDeleteRepair} />
        </div>
      </div>
    </div>
  );
};
