import { ModalAddRepairs } from "./modalAddRepairs";
import { getDataFromFirestore, db } from "../../firebase-config";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScrewdriverWrench,
  faWarehouse,
  faCar,
  faCalendar,
  faWallet,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
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
      {!modalOpen && (
        <div className="repairs-header">
          <h3>История на ремонтите</h3>
          <div className="repairs-header-right">
            <h3>Добави нов</h3>
            <em className="button-add" onClick={() => setModalOpen(true)}>
              <FontAwesomeIcon icon={faCirclePlus} />
            </em>
          </div>
        </div>
      )}
      {modalOpen && <ModalAddRepairs setOpenModal={setModalOpen} />}
      {myRepairs && (
        <div className="repairs-list">
          <div className="repair-item icons">
            <span>
              <FontAwesomeIcon icon={faScrewdriverWrench} />
            </span>
            <span>
              <FontAwesomeIcon icon={faWarehouse} />
            </span>
            <span id="for-car-repair-title">
              <FontAwesomeIcon icon={faCar} />
            </span>
            <span>
              <FontAwesomeIcon icon={faCalendar} />
            </span>
            <span>
              <FontAwesomeIcon icon={faWallet} />
            </span>
          </div>
          <div className="repair-item title">
            <span>Извършен ремонт</span>
            <span>Сервиз</span>
            <span id="for-car-repair-title">За автомобил</span>
            <span>Дата</span>
            <span>Разход</span>
          </div>
          {myRepairs.map((r, i) => (
            <div className="repair-item" key={i}>
              <span>{r.typeOfRepair}</span>
              <span>{r.service}</span>
              <span id="for-car-repair">{r.forCar}</span>
              <span>{new Date(r.onDate).toLocaleDateString("bg-BG")}</span>
              <span className="amount">
                <span className="amount-background">{r.amount}лв</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
