import "./buttons.style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScrewdriverWrench,
  faWarehouse,
  faCar,
  faCalendar,
  faWallet,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

export const Buttons = ({ buttonStyle, onPush }) => {
  if (buttonStyle === "add")
    return (
      <em className="button-add" onClick={onPush}>
        <FontAwesomeIcon icon={faCirclePlus} />
      </em>
    );
};