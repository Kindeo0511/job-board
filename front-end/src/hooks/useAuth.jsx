import { useState, useEffect } from "react";
import { login, logout, getRole } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("access");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await getRole(token);
        setUser(me);
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function signIn(username, password) {
    try {
      const token = await login(username, password);
      const me = await getRole(token.access);
      localStorage.setItem("access", token.access);
      localStorage.setItem("refresh", token.refresh);
      setUser(me);
      return me;
    } catch (err) {
      throw err;
    }
  }

  function signOut() {
    logout();
    setUser(null);
  }

  return { user, loading, signIn, signOut };
}
