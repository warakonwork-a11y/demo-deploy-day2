import { MainLayout } from "@/components/layout/main-layout";
import { InventorySection } from "@/components/inventory/inventory-section";

export default function HomePage() {
  return (
    <MainLayout>
      <InventorySection />
    </MainLayout>
  );
}

