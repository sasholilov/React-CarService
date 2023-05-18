import "./sign-in.css";

export const SignIn = () => {
  return (
    <div>
      <form className="container-form">
        <p>Влез в профила си</p>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Вход</button>
      </form>
    </div>
  );
};
