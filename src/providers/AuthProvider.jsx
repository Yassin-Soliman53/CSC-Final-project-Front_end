import { createContext, useContext, useEffect, useState } from "react";
import apiRequest from "../api/apirequest.js";
const AuthContext = createContext(null);

const checkAuth = async (setUser) => {
  try {
    const response = await apiRequest("/auth/authMe");
    console.log(response)
    setUser(response.user);
  } catch (error) {
    console.error(error);
    setUser(null);
  }
};
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth(setUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
