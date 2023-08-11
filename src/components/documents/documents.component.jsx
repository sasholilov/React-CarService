import { useEffect, useState, useContext } from "react";
import { ModalAddDocs } from "./modalAddDocs";
import { ModalUpdateDocs } from "./modalUpdateDocs";
import {
  getDataFromFirestore,
  deleteDataFromFirestore,
} from "../../firebase-config";
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
    const dataType = "documents";
    const updatedDocs = await deleteDataFromFirestore(myDocs, docs, dataType);
    setMyDocs(updatedDocs);
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
                    <Buttons
                      buttonStyle="edit"
                      onPush={() => handleUpdateDoc(docs)}
                    />
                    <Buttons
                      buttonStyle="delete"
                      onPush={() => handleDeleteDoc(docs)}
                    />
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
