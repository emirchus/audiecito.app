import {LoginForm} from "@/app/login/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-4xl">
        <LoginForm />
        <div className="text-muted-foreground mt-4 text-center text-sm">
          <p>Para pruebas, usa: admin@example.com / password</p>
        </div>
      </div>
    </main>
  );
}
