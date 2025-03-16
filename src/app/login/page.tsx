import {LoginForm} from "@/app/login/components/login-form";

export default function LoginPage() {
  return (
    <main className="from-primary to-secondary flex min-h-screen flex-col items-center justify-center bg-linear-to-b">
      <div className="w-full max-w-4xl">
        <LoginForm />
      </div>
    </main>
  );
}
