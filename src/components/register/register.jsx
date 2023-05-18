import "./register.css";

export const Register = () => {
  return (
    <div>
      <form className="container-form">
        <p>Създай нова регистрация</p>
        <input type="text" placeholder="Име" />
        <input type="text" placeholder="Фамилия" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Парола" />
        <input type="password" placeholder="Повтори паролата" />
        <button type="submit">Създай</button>
      </form>
    </div>
  );
};
