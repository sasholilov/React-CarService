import { useState } from "react";
import "./documents.styles.css";
import { ModalAddDocs } from "./modalAddDocs";

export const Documents = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="no-docs">
      <h1>Добави нов документ</h1>
      <button onClick={() => setModalOpen(true)}>Добави</button>
      {modalOpen && <ModalAddDocs setOpenModal={setModalOpen} />}
    </div>
  );
};
