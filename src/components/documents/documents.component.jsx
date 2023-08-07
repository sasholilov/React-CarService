import { useEffect, useState, useContext } from "react";
import { ModalAddDocs } from "./modalAddDocs";
import { ModalUpdateDocs } from "./modalUpdateDocs";
import { getDataFromFirestore, db } from "../../firebase-config";
import { updateDoc, collection, getDoc, doc } from "firebase/firestore";
import UserContext from "../context/userContext";
import { Buttons } from "../buttons/buttons.component";
import { Homenotloged } from "../home/homenotloged";
import "./documents.styles.css";

export const Documents = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [myDocs, setMyDocs] = useState([]);
  const [currentDoc, setCurrentDoc] = useState(null);
  const currentUser = useContext(UserContext);

  useEffect(() => {
    getDataFromFirestore()
      .then((data) => {
        setMyDocs(data.documents);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [modalOpen, openUpdateModal, currentDoc]);

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

  const handleUpdateDoc = (docToUpdate) => {
    setCurrentDoc(docToUpdate);
    setOpenUpdateModal(true);
  };

  const isValidDocument = (currentDoc) => {
    const currentDate = new Date();
    const expire = new Date(currentDoc.expireDate);
    const differenceInMs = expire - currentDate;
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
    if (differenceInDays > 0) {
      return true;
    } else return false;
  };

  return (
    <div>
      {currentUser.user === null ? (
        <Homenotloged />
      ) : (
        <div>
          {!modalOpen && !openUpdateModal && (
            <div className="header-docs">
              <h3>Моите документи</h3>
              <div className="header-docs-right">
                <h3>Добави нов</h3>
                <Buttons
                  buttonStyle={"add"}
                  onPush={() => setModalOpen(true)}
                />
              </div>
            </div>
          )}
          {modalOpen && <ModalAddDocs setOpenModal={setModalOpen} />}
          {openUpdateModal && (
            <ModalUpdateDocs
              setOpenUpdateModal={setOpenUpdateModal}
              docToUpdate={currentDoc}
            />
          )}
          {!modalOpen && !openUpdateModal && (
            <div className="documents-list">
              {myDocs?.map((docs, index) => (
                <div className="document-card" key={index}>
                  <h3>{docs.documentType}</h3>
                  <p id="for-car">{docs.forCar}</p>
                  {isValidDocument(docs) ? (
                    <p className="active-doc">Активна</p>
                  ) : (
                    <p className="expire-doc">Изтекла</p>
                  )}
                  <p>
                    Платена на:
                    <span>
                      {new Date(docs.validFrom).toLocaleDateString("bg-BG")}
                    </span>
                  </p>
                  <p>
                    Изтича на:
                    <span>
                      {new Date(docs.expireDate).toLocaleDateString("bg-BG")}
                    </span>
                  </p>
                  <footer className="document-card-footer">
                    <button onClick={() => handleUpdateDoc(docs)}>
                      Редакция
                    </button>
                    <button onClick={() => handleDeleteDoc(docs)}>
                      Изтрий
                    </button>
                  </footer>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
