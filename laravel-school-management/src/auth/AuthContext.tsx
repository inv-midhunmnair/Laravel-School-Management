import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (token: string | null, role: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<AuthContextType["token"]>(null);
  const [role, setRole] = useState<AuthContextType["role"]>(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  const login: AuthContextType["login"] = (token, userrole) => {
    if (!token) {
      navigate("/login");
      return;
    }
    localStorage.setItem("token", token);
    localStorage.setItem("role", userrole ?? "");
    setToken(token);
    setRole(userrole);
  };

  const logout: AuthContextType["logout"] = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);

    setRole(null);

    navigate("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
