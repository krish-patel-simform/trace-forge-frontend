import React, { createContext, useState, useEffect } from "react";
import { apiClient } from "../api/client";
import { isAxiosError } from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("tf_access_token");
      if (token) {
        try {
          const res = await apiClient.get("/auth/me");
          setUser(res.data.data.user);
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem("tf_access_token");
            localStorage.removeItem("tf_refresh_token");
          } else {
            console.error("Failed to fetch user", error);
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem("tf_access_token", accessToken);
    localStorage.setItem("tf_refresh_token", refreshToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("tf_access_token");
    localStorage.removeItem("tf_refresh_token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
