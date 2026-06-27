import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { ProfileForm } from "@/components/shared/profile-form";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, image: true },
  });

  if (!dbUser) return null;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">My Profile</h1>
      <ProfileForm user={dbUser} />
    </div>
  );
}
