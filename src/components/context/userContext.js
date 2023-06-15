import { createContext, useState, useEffect } from "react";
import { auth } from "../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { Loading } from "../loading/loading.component";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const updateUserContext = (newUserData) => {
    setUser(newUserData);
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <UserContext.Provider value={{ user, updateUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
