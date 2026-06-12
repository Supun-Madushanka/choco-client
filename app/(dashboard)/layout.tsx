import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-cream-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="ml-[260px] pt-16 min-h-screen">
                <div className="p-6">
                    {children}
                </div>
            </main>

        </div>
    );
}