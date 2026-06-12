import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserResponse } from "@/types/auth";
import Cookies from "js-cookie";

interface AuthState {
    user: UserResponse | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    // Actions
    setAuth: (
        user: UserResponse,
        accessToken: string,
        refreshToken: string
    ) => void;
    clearAuth: () => void;
    updateUser: (user: UserResponse) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken, refreshToken) => {
                // Save to localStorage for axios interceptor
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                // Also save to cookies for middleware
                Cookies.set("accessToken", accessToken, { expires: 1 });
                Cookies.set("refreshToken", refreshToken, { expires: 7 });

                // Save role to cookie for middleware
                Cookies.set("userRole", user.role, { expires: 1 });

                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                });
            },

            clearAuth: () => {
                // Clear localStorage
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                // Also clear cookies
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                Cookies.remove("userRole");

                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            updateUser: (user) => {
                set({ user });
            },
        }),
        {
            name: "auth-storage",
            // Only persist these fields
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);