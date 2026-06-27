import { Suspense } from "react";
import { LoginForm } from "@/components/shared/login-form";
import { getRuntimeDictionary } from "@/lib/i18n";
import { getCurrentLanguage } from "@/lib/site-settings";

export const metadata = { title: "Log In" };

export default async function LoginPage() {
  const currentLanguage = await getCurrentLanguage();
  const dict = await getRuntimeDictionary(currentLanguage);

  return (
    <Suspense>
      <LoginForm labels={dict.auth} />
    </Suspense>
  );
}
