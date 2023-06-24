import { useEffect, useState, useContext } from "react";
import "./documents.styles.css";
import { ModalAddDocs } from "./modalAddDocs";
import { getDataFromFirestore, db } from "../../firebase-config";
import { updateDoc, collection, getDoc, doc } from "firebase/firestore";
import UserContext from "../context/userContext";

export const Documents = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [myDocs, setMyDocs] = useState([]);
  const currentUser = useContext(UserContext);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMyDocs(data.documents); // Set the fetched cars in the myCars state
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [modalOpen]);

  const handleDeleteDoc = async (docs) => {
    try {
      const userCollection = collection(db, "users");
      const userDocRef = doc(userCollection, currentUser.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User document exists, remove the car from the 'cars' array field
        const updatedDocs = myDocs.filter((d) => d !== docs);
        await updateDoc(userDocRef, {
          documents: updatedDocs,
        });
        setMyDocs(updatedDocs);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="no-docs">
        <h1>Добави нов документ</h1>
        <button onClick={() => setModalOpen(true)}>Добави</button>
        {modalOpen && <ModalAddDocs setOpenModal={setModalOpen} />}
      </div>
      <div className="documents-list">
        {myDocs.map((docs, index) => (
          <div className="document-card" key={index}>
            <h3>{docs.documentType}</h3>
            <p>{docs.forCar}</p>
            <p>{docs.validFrom}</p>
            <p>{docs.expireDate}</p>
            <footer className="document-card-footer">
              <button>Edit</button>
              <button onClick={() => handleDeleteDoc(docs)}>Delete</button>
            </footer>
          </div>
        ))}
      </div>
    </>
  );
};
