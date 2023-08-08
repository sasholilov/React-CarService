import "./buttons.style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faPen,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";

export const Buttons = ({ buttonStyle, onPush }) => {
  if (buttonStyle === "add")
    return (
      <em className="button-add" onClick={onPush}>
        <FontAwesomeIcon icon={faCirclePlus} />
      </em>
    );
  if (buttonStyle === "cancel")
    return (
      <em className="button-cancel" onClick={onPush}>
        <FontAwesomeIcon icon={faX} />
      </em>
    );
  if (buttonStyle === "edit")
    return (
      <em className="button-edit" onClick={onPush}>
        <FontAwesomeIcon icon={faPen} />
      </em>
    );

  if (buttonStyle === "delete")
    return (
      <em className="button-delete" onClick={onPush}>
        <FontAwesomeIcon icon={faTrash} />
      </em>
    );
};
