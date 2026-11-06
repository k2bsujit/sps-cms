"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "SALES_MANAGER" | "FIELD_ENGINEER" | string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    // Safety timeout: never allow authentication check to hang
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
      }
    }, 1200);

    const checkUser = async () => {
      try {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("sps_user");
          if (stored && stored !== "undefined" && stored !== "null") {
            try {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.email) {
                if (mounted) {
                  setUser(parsed);
                  setIsLoading(false);
                }
                clearTimeout(safetyTimer);
                return;
              }
            } catch (e) {
              localStorage.removeItem("sps_user");
            }
          }
        }

        // Fast session check with abort controller
        const controller = new AbortController();
        const fetchTimer = setTimeout(() => controller.abort(), 1000);
        const res = await fetch("/api/auth/me", { signal: controller.signal });
        clearTimeout(fetchTimer);

        if (res.ok) {
          const data = await res.json();
          if (data && data.user && mounted) {
            setUser(data.user);
            try {
              localStorage.setItem("sps_user", JSON.stringify(data.user));
            } catch (e) {}
          }
        }
      } catch (err) {
        // Silently proceed to unauthenticated state
      } finally {
        if (mounted) setIsLoading(false);
        clearTimeout(safetyTimer);
      }
    };

    checkUser();

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("sps_user", JSON.stringify(data.user));
        setIsLoading(false);
        router.push("/");
        return true;
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    setUser(null);
    localStorage.removeItem("sps_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
