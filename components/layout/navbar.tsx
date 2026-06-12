"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    logout();

    document.cookie =
      "access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie =
      "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div>
        <h2 className="font-semibold">
          Welcome, {user?.fullName}
        </h2>

        <p className="text-sm text-muted-foreground">
          {user?.roleDisplayName}
        </p>
      </div>

      <Button
        variant="outline"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}