import UserContext from "../context/userContext";
import { ModalAddRepairs } from "./modalAddRepairs";
import { ModalUpdateRepairs } from "./modalUpdateRepairs";
import { getDataFromFirestore, db } from "../../firebase-config";
import { useState, useEffect, useContext } from "react";
import { Buttons } from "../buttons/buttons.component";
import { Homenotloged } from "../home/homenotloged";
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
  const [currentRepair, setCurrentRepair] = useState(null);
  const currentUser = useContext(UserContext);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMayRepairs(data.repairs);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [modalOpen, openUpdateModal]);

  const handleUpdateRepair = (repairToUpdate) => {
    setCurrentRepair(repairToUpdate);
    setOpenUpdateModal(true);
  };

  return (
    <div>
      {currentUser.user === null ? (
        <Homenotloged />
      ) : (
        <div>
          {!modalOpen && !openUpdateModal && (
            <div className="repairs-header">
              <h3>История на ремонтите</h3>
              <div className="repairs-header-right">
                <h3>Добави нов</h3>
                <Buttons
                  buttonStyle={"add"}
                  onPush={() => setModalOpen(true)}
                />
              </div>
            </div>
          )}
          {modalOpen && <ModalAddRepairs setOpenModal={setModalOpen} />}
          {openUpdateModal && (
            <ModalUpdateRepairs
              setOpenUpdateModal={setOpenUpdateModal}
              repairToUpdate={currentRepair}
            />
          )}
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
                <div
                  className="repair-item"
                  key={i}
                  onClick={() => handleUpdateRepair(r)}
                >
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
      )}
    </div>
  );
};
