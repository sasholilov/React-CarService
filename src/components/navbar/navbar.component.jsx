import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import UserContext from "../context/userContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const navigate = useNavigate();
  const userCntx = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const signOutHandler = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div>
      <div className="nav-bar">
        <div className="menu-mobile" onClick={toggleMenu}>
          <span className="menu-icon">
            <FontAwesomeIcon icon={faBars} />
          </span>
        </div>
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + "/car-service-logo.png"}
            className="logo"
          />
        </Link>
        <ul className="menu-links">
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
      <div className="menu-mobile-content">
        {menuOpen ? (
          <div className="menu-links-mobile">
            <Link to="/repairs" onClick={() => setActiveMenu("repairs")}>
              <span className={activeMenu === "repairs" ? "active" : ""}>
                Ремонти
              </span>
            </Link>
            <Link to="/services" onClick={() => setActiveMenu("services")}>
              <span className={activeMenu === "services" ? "active" : ""}>
                Сервизи
              </span>
            </Link>
            <Link to="/cars" onClick={() => setActiveMenu("cars")}>
              <span className={activeMenu === "cars" ? "active" : ""}>
                Моите автомобили
              </span>
            </Link>
            <Link to="/documents" onClick={() => setActiveMenu("documents")}>
              <span className={activeMenu === "documents" ? "active" : ""}>
                Документи
              </span>
            </Link>
            {userCntx.user ? (
              <Link to="/profile" onClick={() => setActiveMenu("profile")}>
                <span className={activeMenu === "profile" ? "active" : ""}>
                  {userCntx.user.displayName}
                </span>
              </Link>
            ) : (
              <Link to="/register" onClick={() => setActiveMenu("register")}>
                <span className={activeMenu === "register" ? "active" : ""}>
                  Регистрация
                </span>
              </Link>
            )}
            {userCntx.user ? (
              <span onClick={signOutHandler}>Изход</span>
            ) : (
              <Link to="/sign-in" onClick={() => setActiveMenu("sign-in")}>
                <span className={activeMenu === "sign-in" ? "active" : ""}>
                  Вход
                </span>
              </Link>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
