import Link from "next/link";

import {UserDropdown} from "./user-dropdown";

import {Button} from "@/components/ui/button";
import {getSession} from "@/lib/auth";

export async function AccountButtons() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
        <Button asChild size="sm" variant="outline">
          <Link href="/login">
            <span>Ingresar</span>
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">
            <span>Crear una cuenta</span>
          </Link>
        </Button>
      </div>
    );
  }

  return <p>xd</p>;
}
