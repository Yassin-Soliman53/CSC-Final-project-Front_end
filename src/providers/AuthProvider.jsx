import { useCallback, useEffect, useRef, useState } from "react";
import apiRequest from "../API/apirequest.js";
import socket from "../API/socketRequest.js";
import AuthContext from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const authVersion = useRef(0);
  const setUser = useCallback((nextUser) => {
    authVersion.current += 1;
    setUserState(nextUser);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const requestVersion = authVersion.current;

    const verifyUser = async () => {
      try {
        const response = await apiRequest("/auth/authMe");
        if (isMounted && authVersion.current === requestVersion) {
          setUserState(response.user);
        }
      } catch (error) {
        if (error.status !== 401 && error.status !== 0) {
          console.error("Could not verify the current user:", error);
        }
        if (isMounted && authVersion.current === requestVersion) {
          setUserState(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifyUser();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleRoleChange = () => window.location.reload();

    socket.on("accountRoleChanged", handleRoleChange);
    return () => socket.off("accountRoleChanged", handleRoleChange);
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
