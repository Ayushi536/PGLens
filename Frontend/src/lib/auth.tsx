import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "student" | "owner" | "admin";

interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, role: "student" | "owner") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const ADMIN_EMAIL = "admin@pglens.com";
const ADMIN_PASSWORD = "admin123";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("pglens_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admin: User = { name: "Admin", email: ADMIN_EMAIL, role: "admin" };
      setUser(admin);
      localStorage.setItem("pglens_user", JSON.stringify(admin));
      return true;
    }
    // For demo: any other email/password logs in as stored role or student
    const stored = localStorage.getItem(`pglens_account_${email}`);
    if (stored) {
      const account = JSON.parse(stored);
      setUser(account);
      localStorage.setItem("pglens_user", JSON.stringify(account));
      return true;
    }
    // Demo fallback: create student user
    const u: User = { name: email.split("@")[0], email, role: "student" };
    setUser(u);
    localStorage.setItem("pglens_user", JSON.stringify(u));
    return true;
  };

  const register = (name: string, email: string, role: "student" | "owner") => {
    const u: User = { name, email, role };
    setUser(u);
    localStorage.setItem("pglens_user", JSON.stringify(u));
    localStorage.setItem(`pglens_account_${email}`, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pglens_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const getDashboardPath = (role: UserRole) => {
  switch (role) {
    case "admin": return "/admin";
    case "owner": return "/owner";
    case "student": return "/dashboard";
  }
};
