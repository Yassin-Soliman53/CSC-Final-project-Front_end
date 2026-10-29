import { useEffect, useState } from "react";
import apiRequest from "../API/apirequest.js";
import AuthContext from "./AuthContext.js";

const checkAuth = async (setUser, setLoading) => {
  try {
    const response = await apiRequest("/auth/authMe");
    setUser(response.user);
  } catch (error) {
    if (error.status !== 401 && error.status !== 0) {
      console.error("Could not verify the current user:", error);
    }
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
