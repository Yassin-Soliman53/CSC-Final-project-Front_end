import { createContext, useContext, useEffect, useState } from "react";
import apiRequest from "../API/apirequest.js";
const AuthContext = createContext(null);

const checkAuth = async (setUser, setLoading) => {
  try {
    const response = await apiRequest("/auth/authMe");
    setUser(response.user);
  } catch (error) {
    console.error(error);
    setUser(null);
  } finally {
    setLoading(false);
  }
};
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth(setUser, setLoading);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: Boolean(user),
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
