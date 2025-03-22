"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useId, useState } from "react";
import { useTheme } from "next-themes";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
  const id = useId();

  const { resolvedTheme, setTheme } = useTheme();
  const [checked, setChecked] = useState<boolean>(resolvedTheme === "dark");

  const handleCheckedChange = (checked: boolean) => {
    setChecked(checked);
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div>
      <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
        <Switch
          checked={checked}
          className="peer data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
          id={id}
          onCheckedChange={handleCheckedChange}
        />
        <span className="peer-data-[state=checked]:text-muted-foreground/70 pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center">
          <SunIcon aria-hidden="true" size={16} />
        </span>
        <span className="peer-data-[state=unchecked]:text-muted-foreground/70 pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center">
          <MoonIcon aria-hidden="true" size={16} />
        </span>
      </div>
      <Label className="sr-only" htmlFor={id}>
        Labeled switch
      </Label>
    </div>
  );
}
