"use client";

import { useAuthStore } from "@/store/auth-store";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import HRDashboard from "@/components/dashboard/hr-dashboard";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  switch (user?.role) {
    case "SUPER_ADMIN":
      return <AdminDashboard />;

    case "HR_MANAGER":
      return <HRDashboard />;

    default:
      return (
        <div>
          Dashboard not available
        </div>
      );
  }
}