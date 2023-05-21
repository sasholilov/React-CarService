import "./navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import UserContext from "../context/userContext";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { Loading } from "../loading/loading";

export const Navbar = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userCntx = useContext(UserContext);

  const signOutHandler = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (user && !user.displayName && !loading) {
      fetchUserDisplayName();
    }
  }, [user, loading]);

  const fetchUserDisplayName = async () => {
    const { displayName } = await auth.currentUser;
    setUser((prevUser) => ({ ...prevUser, displayName }));
  };

  if (loading) {
    return <Loading />;
  }

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
        {user ? (
          <Link to="/profile">
            <li>{userCntx.user.displayName}</li>
          </Link>
        ) : (
          <Link to="/register">
            <li>Регистрация</li>
          </Link>
        )}
        {user ? (
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
