import "./navbar.css";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="nav-bar">
      <Link to="/">
        <img
          src={process.env.PUBLIC_URL + "/car-service-logo.png"}
          className="logo"
        />
      </Link>
      <ul>
        <Link to="/repairs">
          <li>Ремонти</li>
        </Link>
        <Link to="/services">
          <li>Сервизи</li>
        </Link>
        <Link to="/cars">
          <li>Моите автомобили</li>
        </Link>
        <Link to="/documents">
          <li>Документи</li>
        </Link>
        <Link to="/register">
          <li>Регистрация</li>
        </Link>
        <Link to="/sign-in">
          <li>Вход</li>
        </Link>
      </ul>
    </div>
  );
};
