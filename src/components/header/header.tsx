import Link from "next/link";
import {Mic} from "lucide-react";

import {UserDropdown} from "./user-dropdown";

import {Button} from "@/components/ui/button";
import {getSession} from "@/lib/auth";

export async function Header() {
  const session = await getSession();

  return (
    <header className="w-full border-b bg-white shadow-xs">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link className="flex items-center gap-2" href="/">
          <Mic className="text-primary h-6 w-6" />
          <span className="text-xl font-bold">Audonaciones</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link className="hover:text-primary text-sm font-medium transition-colors" href="/">
            Inicio
          </Link>

          {session && (
            <>
              <Link
                className="hover:text-primary text-sm font-medium transition-colors"
                href="/integration"
              >
                Integración
              </Link>
              <Link
                className="hover:text-primary text-sm font-medium transition-colors"
                href="/obs"
              >
                Widget OBS
              </Link>
            </>
          )}

          {!session && (
            <Link href="/login">
              <Button size="sm" variant="outline">
                Iniciar Sesión
              </Button>
            </Link>
          )}

          {session && <UserDropdown />}
        </nav>
      </div>
    </header>
  );
}
