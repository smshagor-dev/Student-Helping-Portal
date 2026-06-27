import { requireAdmin } from "@/lib/session";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getCurrentLanguage } from "@/lib/site-settings";
import { getRuntimeDictionary } from "@/lib/i18n";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const session = await auth();
  const currentLanguage = await getCurrentLanguage();
  const dict = await getRuntimeDictionary(currentLanguage);

  return (
    <div className="flex min-h-screen bg-secondary/20">
      <AdminSidebar labels={dict.admin} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar session={session} labels={dict.admin} common={dict.common} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
