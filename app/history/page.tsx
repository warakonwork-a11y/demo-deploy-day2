import { MainLayout } from "@/components/layout/main-layout";
import { MyBorrowHistory } from "@/components/inventory/my-borrow-history";

export default function HistoryPage() {
  return (
    <MainLayout>
      <MyBorrowHistory />
    </MainLayout>
  );
}
