import { Mic } from "lucide-react";
import Link from "next/link";

import { AccountButtons } from "./action-buttons";

const menuItems = [
  { name: "Streamers", href: "#" },
  { name: "Audiecito", href: "#" },
];

export function Header() {
  return (
    <header>
      <nav
        className="bg-background fixed z-20 w-full border-b border-dashed backdrop-blur md:relative lg:dark:bg-transparent"
        data-state="inactive"
      >
        <div className="m-auto max-w-5xl px-6 lg:px-0">
          <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link aria-label="home" className="flex items-center space-x-2" href="/">
                <Mic className="size-4" />
              </Link>

              {/* <button
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                type="button"
                onClick={() => setMenuState(!menuState)}
              >
                <Menu className="m-auto size-6 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100" />
              </button> */}
            </div>

            <div className="bg-background mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:pr-4">
                <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        href={item.href}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <AccountButtons />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
