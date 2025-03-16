"use client";

import * as React from "react";
import {ThemeProvider as NextThemesProvider} from "next-themes";

export function ThemeProvider({children}: {children: React.ReactNode}) {
  return (
    <NextThemesProvider enableSystem attribute="class" defaultTheme="system">
      {children}
    </NextThemesProvider>
  );
}
