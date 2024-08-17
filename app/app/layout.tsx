import Link from "next/link";
import { LogoutButton } from "./components/logout-button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 w-full justify-between">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/app" className="w-[120px]">
            <div className="font-bold">Change Detector</div>
          </Link>
        </nav>
        <LogoutButton />
      </header>

      <main className="h-full flex-1 container ">{children}</main>
    </div>
  );
}
