import {Footer} from "@/components/footer";
import {Header} from "@/components/header/header";

export default function IndexLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
