import { RegisterForm } from "@/components/shared/register-form";
import { getRuntimeDictionary } from "@/lib/i18n";
import { getCurrentLanguage } from "@/lib/site-settings";

export const metadata = { title: "Sign Up" };

export default async function RegisterPage() {
  const currentLanguage = await getCurrentLanguage();
  const dict = await getRuntimeDictionary(currentLanguage);

  return <RegisterForm labels={dict.auth} />;
}
