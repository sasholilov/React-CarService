import UserContext from "../context/userContext";
import { useContext } from "react";
import "./profile.css";

export const Profile = () => {
  const user = useContext(UserContext);
  if (!user || !user.displayName) {
    return null;
  }
  const [firstName, lastName] = user.displayName.split(" ");

  return (
    <div>
      <section className="container-form">
        <p>Моите данни</p>
        <input type="text" value={firstName} />
        <input type="text" value={lastName} />
        <input type="email" value={user.email} />
        <input type="password" placeholder="Парола" />
        <button>Промени</button>
      </section>
    </div>
  );
};
