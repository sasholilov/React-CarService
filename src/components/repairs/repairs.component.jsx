import { ModalAddRepairs } from "./modalAddRepairs";
import { useState } from "react";
import "./repairs.css";

export const Repairs = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  return (
    <div className="repairs-services">
      <h1>Добави нов сервиз</h1>
      <button onClick={() => setModalOpen(true)}>Добави</button>
      {modalOpen && <ModalAddRepairs setOpenModal={setModalOpen} />}
    </div>
  );
};
