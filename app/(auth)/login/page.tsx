import LoginForm from "@/components/auth/login-form";
import { GiChocolateBar } from "react-icons/gi";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex bg-background">

      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-amber-950 via-stone-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_40%)]" />

        <div className="relative z-10 flex flex-col justify-between p-14 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-secondary-foreground p-3 rounded-xl">
                <GiChocolateBar className="h-7 w-7 text-primary" />
              </div>

              <div>
                <h1 className="font-bold text-2xl">
                  Ceylon Chocolate
                </h1>
                <p className="text-sm text-zinc-400">
                  Factory Management System
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-lg">
            <h2 className="text-5xl font-bold leading-tight">
              Crafted with Care.
              <br />
              Managed with Precision.
            </h2>

            <p className="mt-6 text-lg text-zinc-400">
              Streamline production, inventory, HR, quality control,
              and reporting from a single platform.
            </p>
          </div>

          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Ceylon Chocolate Factory
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-muted/30">
        <LoginForm />
      </div>
    </main>
  );
}