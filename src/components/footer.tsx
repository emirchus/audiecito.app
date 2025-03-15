import Link from "next/link";
import {Mic} from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Mic className="text-primary size-5" />
            <span className="font-bold">Audonaciones</span>
          </div>

          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Audonaciones. Por Emirchus.
          </div>
        </div>
      </div>
    </footer>
  );
}
