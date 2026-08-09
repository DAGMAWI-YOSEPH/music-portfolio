import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard works</h1>
      <p>User: {session.user.name}</p>
    </div>
  );
}
