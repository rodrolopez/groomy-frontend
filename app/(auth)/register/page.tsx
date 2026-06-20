import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-grid p-4">
      <AuthForm mode="register" />
    </div>
  );
}
