import { createContext, useState } from "react";
import { User } from '../../services/api';

type AuthData = { token: string; user: User } | null;

const AuthContext = createContext<{
  auth: AuthData;
  setAuth: (auth: AuthData) => void;
}>({ auth: null, setAuth: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthData>(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;