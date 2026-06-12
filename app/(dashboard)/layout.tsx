import AppSidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <Navbar />

        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}