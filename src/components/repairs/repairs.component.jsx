import { ModalAddRepairs } from "./modalAddRepairs";
import { getDataFromFirestore, db } from "../../firebase-config";
import { useState, useEffect } from "react";
import "./repairs.css";

export const Repairs = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [myRepairs, setMayRepairs] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMayRepairs(data.repairs);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [modalOpen]);

  return (
    <div>
      <div className="repairs-services">
        <h1>Регистрирай нов ремонт или обслужване</h1>
        <button onClick={() => setModalOpen(true)}>Добави</button>
        {modalOpen && <ModalAddRepairs setOpenModal={setModalOpen} />}
      </div>
      {myRepairs && (
        <div className="repairs-list">
          <div className="repair-item title">
            <span>Вид ремонт</span>
            <span>Сервиз</span>
            <span id="for-car-repair-title">За автомобил</span>
            <span>Дата</span>
            <span>Разход</span>
          </div>
          {myRepairs.map((r) => (
            <div className="repair-item">
              <span>{r.typeOfRepair}</span>
              <span>{r.service}</span>
              <span id="for-car-repair">{r.forCar}</span>
              <span>{new Date(r.onDate).toLocaleDateString("bg-BG")}</span>
              <span className="amount">{r.amount}лв</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
