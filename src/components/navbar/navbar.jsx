import "./navbar.css";

export const Navbar = () => {
  return (
    <div className="nav-bar">
      <span className="logo">Logo</span>
      <ul>
        <li>Ремонти</li>
        <li>Сервизи</li>
        <li>Моите автомобили</li>
        <li>Напомняния</li>
        <li>Регистрация</li>
        <li>Вход</li>
      </ul>
    </div>
  );
};
