import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession, isSupabaseConfigured } from "@/lib/supabase/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PermissionDeniedState } from "@/components/states/PermissionDeniedState";

export const instant = false;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=unconfigured");
  }

  const session = await getAdminSession();

  if (!session.isAuthenticated) {
    redirect("/admin/login");
  }

  if (!session.isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-4 py-12">
        <PermissionDeniedState
          title="ADMIN ACCESS RESTRICTED"
          description={`Your authenticated account (${session.user?.email || "Unknown"}) is not listed in the authorized GENZLOG admin roster.`}
          permissionType="general"
          fallbackContent={session.user?.email ? `Contact GENZLOG administration to whitelist: ${session.user.email}` : undefined}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <AdminHeader userEmail={session.user?.email} />
      <div className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10">
        {children}
      </div>
    </div>
  );
}
