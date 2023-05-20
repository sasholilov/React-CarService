import { useState } from "react";
import "./sign-in.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  const navigate = useNavigate();

  const [signInEmail, setSignInEmail] = useState("");
  const [singInPassword, setSingInPassword] = useState("");
  const signInEmailHandler = (event) => {
    setSignInEmail(event.target.value);
  };
  const signInPasswordHandler = (event) => {
    setSingInPassword(event.target.value);
  };

  const signInWithEmailAndPasswordAction = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        signInEmail,
        singInPassword
      );
      console.log(userCredential);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
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
        <button onClick={signInWithEmailAndPasswordAction}>Вход</button>
      </section>
    </div>
  );
};
