import { Link } from "react-router-dom";

export const Homenotloged = () => {
  return (
    <div className="home-login-register">
      <img
        src={process.env.PUBLIC_URL + "/car-service-logo.png"}
        className="logo"
      />
      <h2>
        Моля, влезте в профила си за да ползвате функционалността на сайта или
        ако нямате такъв, направете регистрация!
      </h2>
      <Link to="/sign-in">
        <button>Вход</button>
      </Link>
      <Link to="/register">
        <button>Регистрация</button>
      </Link>
    </div>
  );
};
