import { createContext, useState, useEffect } from "react";
import { auth } from "../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  const updateUserContext = (newUserData) => {
    setUser(newUserData);
  };

  return (
    <UserContext.Provider value={{ user, updateUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
