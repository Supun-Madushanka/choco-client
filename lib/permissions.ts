export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [
    "/dashboard",
    "/users",
    "/roles",
    "/settings",
  ],

  HR_MANAGER: [
    "/dashboard",
    "/employees",
    "/attendance",
    "/leaves",
  ],
};