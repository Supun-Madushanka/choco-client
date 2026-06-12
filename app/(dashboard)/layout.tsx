import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">

            {/* Sidebar — hidden on mobile */}
            <aside className="hidden md:block fixed top-0 left-0
                              h-screen w-65 z-40">
                <Sidebar />
            </aside>

            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="md:ml-65 pt-16 min-h-screen">
                <div className="p-4 md:p-6">
                    {children}
                </div>
            </main>

        </div>
    );
}