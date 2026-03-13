import { MainLayout } from "@/components/layout/main-layout";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return (
    <MainLayout>
      <AdminDashboard />
    </MainLayout>
  );
}

