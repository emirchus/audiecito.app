"use client";
import type { User } from "@supabase/supabase-js";

import { LogOut, Settings, Proportions, UserIcon } from "lucide-react";
import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/provider/auth-provider";

interface Props {
  user: User;
}

export function UserDropdown({ user }: Props) {
  const { logOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm">
          <UserIcon className="size-4" />
          <span className="text-xs">Dashboard</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
          {user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/integrations">
            <Settings className="size-4" />
            <span>Integraciones</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/widgets">
            <Proportions className="size-4" />
            <span>Widgets</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logOut()}>
          <LogOut className="size-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
