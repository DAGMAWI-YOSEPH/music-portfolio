import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
    id: session.user.id || "",
  };

  return <DashboardClient user={user} />;
}
