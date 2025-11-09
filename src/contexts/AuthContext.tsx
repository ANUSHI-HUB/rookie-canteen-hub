import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "shop" | "admin";

interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => boolean;
  register: (name: string, username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers: (User & { password: string })[] = [
  { id: "1", name: "John Doe", username: "student1", password: "pass123", role: "student" },
  { id: "2", name: "Jane's Shop", username: "shop1", password: "pass123", role: "shop" },
  { id: "3", name: "Admin User", username: "admin1", password: "admin123", role: "admin" },
];

let userIdCounter = 4;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, role: UserRole): boolean => {
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password && u.role === role
    );
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const register = (name: string, username: string, password: string, role: UserRole): boolean => {
    const exists = mockUsers.find((u) => u.username === username);
    if (exists) return false;
    
    const newUser = {
      id: String(userIdCounter++),
      name,
      username,
      password,
      role,
    };
    mockUsers.push(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
