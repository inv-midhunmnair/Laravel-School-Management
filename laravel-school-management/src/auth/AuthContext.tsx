import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

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

  const login: AuthContextType["login"] = (token, userrole) => {
    localStorage.setItem("token", token ? token : "");
    localStorage.setItem("role", userrole ? userrole : "");
    setToken(token);
    setRole(userrole);
  };

  const logout: AuthContextType["logout"] = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedrole = localStorage.getItem("role");
    if (storedToken) setToken(storedToken);
    if (storedrole) setRole(storedrole);
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
  return context;
};
