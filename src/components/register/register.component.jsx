import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./register.css";
import { auth } from "../../firebase-config";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../config/errorMessages";

export const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleNameOnChange = (event) => {
    setName(event.target.value);
  };

  const handleLastNameOnChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailOnChange = (event) => {
    setRegisterEmail(event.target.value);
  };

  const handlePasswordOnChange = (event) => {
    setRegisterPassword(event.target.value);
  };

  const handleConfirmPasswordOnChange = (event) => {
    setRegisterConfirmPassword(event.target.value);
  };

  const createUser = async () => {
    if (!name) {
      setErrorMessage("Моля въведете име!");
      return;
    }
    if (!lastName) {
      setErrorMessage("Моля въведете фамилия!");
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setErrorMessage("Паролата не съвпада!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );

      const user = userCredential.user;
      await updateDisplayName(user, name, lastName);
      navigate("/");
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      console.log(errorMsg);
      setErrorMessage(errorMsg);
    }
  };

  const updateDisplayName = async (user, name, lastName) => {
    const displayName = `${name} ${lastName}`;

    try {
      await updateProfile(user, { displayName });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <section className="container-form-register">
        <p>Създай нова регистрация</p>
        {errorMessage && <span className="error-message">{errorMessage}</span>}
        <input type="text" placeholder="Име" onChange={handleNameOnChange} />
        <input
          type="text"
          placeholder="Фамилия"
          onChange={handleLastNameOnChange}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={handleEmailOnChange}
        />
        <input
          type="password"
          placeholder="Парола"
          onChange={handlePasswordOnChange}
        />
        <input
          type="password"
          placeholder="Повтори паролата"
          onChange={handleConfirmPasswordOnChange}
        />
        <button onClick={createUser}>Създай</button>
      </section>
    </div>
  );
};
