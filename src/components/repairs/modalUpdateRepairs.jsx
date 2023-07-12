import { useState, useEffect, useContext } from "react";
import { db, getDataFromFirestore } from "../../firebase-config";
import { collection, updateDoc, arrayUnion } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import UserContext from "../context/userContext";

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
    try {
      const userCollection = collection(db, "users");
      const userDocRef = doc(userCollection, currentUser.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User document exists, find the index of the car in the 'cars' array
        const repairIndex = myRepairs.findIndex(
          (d) => d.id === repairToUpdate.id
        );
        console.log(myRepairs[0]);
        console.log(repairToUpdate);
        console.log("tuk e indexa", repairToUpdate);

        if (repairIndex !== -1) {
          // Car found in the array, update the car at the specified index
          const updatedRepairs = [...myRepairs];
          const updateRepair = {
            typeOfRepair: typeOfRepair,
            service: choisedService,
            onDate: onDate,
            forCar: choisedCar,
            amount: amount,
          };
          updatedRepairs[repairIndex] = updateRepair; // Replace 'updatedCar' with the updated car object

          await updateDoc(userDocRef, {
            repairs: updatedRepairs,
          });

          setMyRepairs(updatedRepairs);
          console.log("Repairs updated successfully!");
          setOpenUpdateModal(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteRepair = async (rep) => {
    try {
      const userCollection = collection(db, "users");
      const userDocRef = doc(userCollection, currentUser.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User document exists, remove the car from the 'cars' array field
        const updatedRepairs = myRepairs.filter((r) => r.id !== rep.id);
        await updateDoc(userDocRef, {
          repairs: updatedRepairs,
        });
        setMyRepairs(updatedRepairs);
        setOpenUpdateModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
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

        <div className="footer">
          <button
            onClick={() => {
              setOpenUpdateModal(false);
            }}
            id="cancelBtn"
          >
            Откажи
          </button>
          <button onClick={handleUpdateRepair}>Редактирай</button>
          <button
            className="delete"
            onClick={() => handleDeleteRepair(repairToUpdate)}
          >
            Изтрий
          </button>
        </div>
      </div>
    </div>
  );
};
