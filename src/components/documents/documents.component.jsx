import { useEffect, useState, useContext } from "react";
import "./documents.styles.css";
import { ModalAddDocs } from "./modalAddDocs";
import { ModalUpdateDocs } from "./modalUpdateDocs";
import { getDataFromFirestore, db } from "../../firebase-config";
import { updateDoc, collection, getDoc, doc } from "firebase/firestore";
import UserContext from "../context/userContext";

export const Documents = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [myDocs, setMyDocs] = useState([]);
  const [currentDoc, setCurrentDoc] = useState(null);
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

  const handleUpdateDoc = (docIndex) => {
    setCurrentDoc(myDocs[docIndex]);
    setOpenUpdateModal(true);
  };

  const isValidDocument = (currentDoc) => {
    const currentDate = new Date();
    const expire = new Date(currentDoc.expireDate);
    const differenceInMs = expire - currentDate;
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    console.log(expire);
    console.log(differenceInDays);
    if (differenceInDays > 0) {
      return true;
    } else return false;
  };

  return (
    <>
      <div className="no-docs">
        <h1>Добави нов документ</h1>
        <button onClick={() => setModalOpen(true)}>Добави</button>
        {modalOpen && <ModalAddDocs setOpenModal={setModalOpen} />}
        {openUpdateModal && (
          <ModalUpdateDocs
            setOpenUpdateModal={setOpenUpdateModal}
            docToUpdate={currentDoc}
          />
        )}
      </div>
      <div className="documents-list">
        {myDocs.map((docs, index) => (
          <div className="document-card" key={index}>
            <h3>{docs.documentType}</h3>
            <p>За автомобил: {docs.forCar}</p>
            <p>Платена на: {docs.validFrom}</p>
            <p>Изтича на: {docs.expireDate}</p>

            {isValidDocument(docs) ? (
              <p className="active-doc">Активна</p>
            ) : (
              <p className="expire-doc">Изтекла</p>
            )}
            <footer className="document-card-footer">
              <button onClick={() => handleUpdateDoc(index)}>Edit</button>
              <button onClick={() => handleDeleteDoc(docs)}>Delete</button>
            </footer>
          </div>
        ))}
      </div>
    </>
  );
};
