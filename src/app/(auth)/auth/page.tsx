import { Suspense } from "react";
import { LoginScreen } from "@/feature/auth/components/login-screen";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginScreen />}>
      <LoginScreen readSearchParams />
    </Suspense>
  );
}
