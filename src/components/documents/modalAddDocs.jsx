import "./modalAddDocs.css";

export const ModalAddDocs = ({ setOpenModal }) => {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="modal-body">
          <label id="label-docs-first">Избере тип документ</label>
          <select>
            <option>Винетка</option>
            <option>Гражданска отговорност</option>
            <option>ГТП</option>
            <option>Автокаско</option>
          </select>

          <label>Валиден от</label>
          <input type="date"></input>
          <label>Валиден до</label>
          <input type="date"></input>
        </div>

        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button>Add</button>
        </div>
      </div>
    </div>
  );
};
