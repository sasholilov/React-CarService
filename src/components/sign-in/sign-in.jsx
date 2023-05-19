import "./sign-in.css";

export const SignIn = () => {
  return (
    <div>
      <section className="container-form">
        <p>Влез в профила си</p>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Вход</button>
      </section>
    </div>
  );
};
