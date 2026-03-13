"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  equipment_name: string;
  start_date: string;
  end_date: string;
  status: string;
  reason: string;
}

export function MyBorrowHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/v1/my-transactions")
      .then((res) => res.json())
      .then((data: Transaction[]) => {
        setTransactions(data);
      })
      .catch(() => {
        setTransactions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning">รออนุมัติ</Badge>;
      case "APPROVED":
        return <Badge variant="success">อนุมัติแล้ว</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">ปฏิเสธ</Badge>;
      case "BORROWING":
        return <Badge variant="info">กำลังยืม</Badge>;
      case "RETURNED":
        return <Badge variant="success">คืนแล้ว</Badge>;
      case "OVERDUE":
        return <Badge variant="destructive">เลยกำหนด</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800">
          ประวัติการยืมของฉัน
        </h1>
        <p className="text-slate-500 max-w-2xl">
          ติดตามสถานะคำขอยืมอุปกรณ์ของคุณ
        </p>
      </div>

      <Card className="border-0 shadow-lg shadow-slate-200/60">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg text-slate-800">รายการยืมทั้งหมด</CardTitle>
          <CardDescription className="text-slate-500">
            แสดงประวัติการยืมและสถานะล่าสุด
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                <p className="text-sm text-slate-500">กำลังโหลด...</p>
              </div>
            </div>
          ) : transactions.length > 0 ? (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700">อุปกรณ์</TableHead>
                    <TableHead className="font-semibold text-slate-700">ช่วงวันที่</TableHead>
                    <TableHead className="font-semibold text-slate-700">เหตุผล</TableHead>
                    <TableHead className="font-semibold text-slate-700">สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="py-3 font-medium text-slate-800">
                        {t.equipment_name}
                      </TableCell>
                      <TableCell className="py-3 text-slate-600">
                        {new Date(t.start_date).toLocaleDateString("th-TH")} -{" "}
                        {new Date(t.end_date).toLocaleDateString("th-TH")}
                      </TableCell>
                      <TableCell className="py-3 text-slate-600 max-w-xs truncate">
                        {t.reason}
                      </TableCell>
                      <TableCell className="py-3">
                        {getStatusBadge(t.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">ยังไม่มีประวัติการยืม</p>
              <p className="text-sm text-slate-400 mt-1">เริ่มยืมอุปกรณ์ได้เลยจากหน้าหลัก</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
