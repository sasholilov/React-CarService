import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context/userContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const userCntx = useContext(UserContext);

  const signOutHandler = async () => {
    await signOut(auth);
    navigate("/");
  };

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
        {userCntx.user ? (
          <Link to="/profile">
            <li>{userCntx.user.displayName}</li>
          </Link>
        ) : (
          <Link to="/register">
            <li>Регистрация</li>
          </Link>
        )}
        {userCntx.user ? (
          <li onClick={signOutHandler}>Изход</li>
        ) : (
          <Link to="/sign-in">
            <li>Вход</li>
          </Link>
        )}
      </ul>
    </div>
  );
};
