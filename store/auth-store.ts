import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponseData } from "@/types/auth";

const setCookie = (name: string, value: string, days = 1) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

interface AuthState {
  user: Omit<LoginResponseData, "accessToken" | "refreshToken"> | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (data: LoginResponseData) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (data) => {
        setCookie("access-token", data.accessToken, 1);
        setCookie("user-role", data.role, 1);

        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: {
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            roleDisplayName: data.roleDisplayName,
          },
        });
      },

      clearAuth: () => {
        deleteCookie("access-token");
        deleteCookie("user-role");
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    { name: "auth-storage" }
  )
);