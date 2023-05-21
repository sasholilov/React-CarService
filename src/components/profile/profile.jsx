import UserContext from "../context/userContext";
import { useContext, useState } from "react";
import { updateProfile } from "firebase/auth";
import { updateEmail } from "firebase/auth";
import { auth } from "../../firebase-config";
import "./profile.css";

export const Profile = () => {
  const user = useContext(UserContext);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [succes, setSuccess] = useState(false);
  if (!user.user || !user.user.displayName) {
    return null;
  }
  const [firstName, lastName] = user.user.displayName.split(" ");
  const updateProfileAction = async () => {
    console.log(succes);

    try {
      if (newFirstName && newLastName) {
        const profile = await updateProfile(auth.currentUser, {
          displayName: `${newFirstName} ${newLastName}`,
        });
      }
      if (newFirstName && !newLastName) {
        const profile = await updateProfile(auth.currentUser, {
          displayName: `${newFirstName} ${lastName}`,
        });
      }

      if (!newFirstName && newLastName) {
        const profile = await updateProfile(auth.currentUser, {
          displayName: `${firstName} ${newLastName}`,
        });
      }

      console.log(user.user.email);
      user.updateUserContext(user, {
        displayName: `${newFirstName} ${newLastName}`,
      });
      setSuccess(true);
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log("TUK", user);
  return (
    <div>
      <section className="container-form">
        {succes ? (
          <span className="success-message">Успешно променени данни!</span>
        ) : (
          <p>Моите данни</p>
        )}
        <input
          type="text"
          defaultValue={firstName}
          onChange={(e) => setNewFirstName(e.target.value)}
        />
        <input
          type="text"
          defaultValue={lastName}
          onChange={(e) => setNewLastName(e.target.value)}
        />
        <input type="email" defaultValue={user.user.email} />
        <input type="password" placeholder="Парола" />
        <button onClick={updateProfileAction}>Промени</button>
      </section>
    </div>
  );
};
