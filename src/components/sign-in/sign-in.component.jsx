import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../firebase-config";
import "./sign-in.css";

export const SignIn = () => {
  const navigate = useNavigate();
  const buttonEnter = useRef();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        buttonEnter.current.click();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [signInEmail, setSignInEmail] = useState("");
  const [singInPassword, setSingInPassword] = useState("");
  const signInEmailHandler = (event) => {
    setSignInEmail(event.target.value);
  };
  const signInPasswordHandler = (event) => {
    setSingInPassword(event.target.value);
  };

  const signInHandler = function () {
    signIn(signInEmail, singInPassword);
    navigate("/");
  };

  return (
    <div>
      <section className="container-form">
        <p>Влез в профила си</p>
        <input type="email" placeholder="Email" onChange={signInEmailHandler} />
        <input
          type="password"
          placeholder="Password"
          onChange={signInPasswordHandler}
        />
        <button onClick={signInHandler} ref={buttonEnter}>
          Вход
        </button>
      </section>
    </div>
  );
};
