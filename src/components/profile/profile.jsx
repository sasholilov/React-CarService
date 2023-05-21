import UserContext from "../context/userContext";
import { useContext, useState } from "react";
import {
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase-config";
import "./profile.css";

export const Profile = () => {
  const user = useContext(UserContext);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [success, setSuccess] = useState(false);

  if (!user.user || !user.user.displayName) {
    return null;
  }

  const [firstName, lastName] = user.user.displayName.split(" ");

  const updateProfileAction = async () => {
    try {
      //update Email
      if (newEmail) {
        const enteredPassword = prompt("Въведете тукущата ви парола");
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          enteredPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        const newMail = await updateEmail(auth.currentUser, newEmail);
        setNewEmail("");
      }

      // Update the profile
      if (newFirstName && newLastName) {
        await updateProfile(auth.currentUser, {
          displayName: `${newFirstName} ${newLastName}`,
        });
      } else if (newFirstName && !newLastName) {
        await updateProfile(auth.currentUser, {
          displayName: `${newFirstName} ${lastName}`,
        });
      } else if (!newFirstName && newLastName) {
        await updateProfile(auth.currentUser, {
          displayName: `${firstName} ${newLastName}`,
        });
      }

      console.log(user.user.email);
      user.updateUserContext(user, {
        displayName: `${newFirstName} ${newLastName}`,
      });
      setSuccess(true);
      console.log("USER CONTEXT", user);
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log("TUK", user);

  return (
    <div>
      <section className="container-form">
        {success ? (
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
        <input
          type="email"
          defaultValue={user.user.email}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={updateProfileAction}>Промени</button>
      </section>
    </div>
  );
};
