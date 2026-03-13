"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  total_items: number;
  active_borrows: number;
  overdue_items: number;
  top_borrowed: {
    equipmentId: string;
    count: number;
    name: string;
  }[];
}

interface TransactionRow {
  id: string;
  equipment_name: string;
  user_name: string;
  start_date: string;
  end_date: string;
  status: string;
  reason?: string;
}

function getDemoRole(): string {
  if (typeof window === "undefined") return "USER";
  return localStorage.getItem("demo-role") || "USER";
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [role, setRole] = useState<string>("USER");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchData = useCallback(() => {
    const currentRole = getDemoRole();
    setRole(currentRole);

    // Only fetch stats for ADMIN
    if (currentRole === "ADMIN") {
      void fetch("/api/v1/dashboard/stats", {
        headers: {
          "x-demo-role": currentRole
        }
      })
        .then((res) => res.json())
        .then((data: unknown) => {
          const statsData = data as DashboardStats;
          if (statsData && "total_items" in statsData) setStats(statsData);
        })
        .catch(() => {
          setStats(null);
        });
    }

    // Fetch transactions based on role
    const transactionsUrl = currentRole === "ADMIN" 
      ? "/api/v1/admin/transactions" 
      : "/api/v1/my-transactions";
    
    void fetch(transactionsUrl, {
      headers: {
        "x-demo-role": currentRole
      }
    })
      .then((res) => res.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setTransactions(data as TransactionRow[]);
      })
      .catch(() => {
        setTransactions([]);
      });
  }, []);

  useEffect(() => {
    fetchData();

    const handleRoleChange = () => fetchData();
    window.addEventListener("role-change", handleRoleChange);
    return () => window.removeEventListener("role-change", handleRoleChange);
  }, [fetchData]);

  const handleStatusChange = async (id: string, status: "APPROVED" | "REJECTED" | "RETURNED") => {
    const currentRole = getDemoRole();
    await fetch(`/api/v1/admin/transactions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-demo-role": currentRole
      },
      body: JSON.stringify({ status })
    });
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

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

  const filteredTransactions = statusFilter === "all" 
    ? transactions 
    : transactions.filter(t => t.status === statusFilter);

  // USER Dashboard View
  if (role === "USER") {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-800">
            ภาพรวมการยืมอุปกรณ์
          </h1>
          <p className="text-slate-500 max-w-2xl">
            ติดตามสถานะการยืมอุปกรณ์ของคุณ
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="relative overflow-hidden border-0 shadow-lg shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-10"></div>
            <CardContent className="relative p-6">
              <p className="text-sm font-medium text-slate-500">ยืมทั้งหมด</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{transactions.length}</p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-lg shadow-amber-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 opacity-10"></div>
            <CardContent className="relative p-6">
              <p className="text-sm font-medium text-slate-500">รออนุมัติ</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {transactions.filter(t => t.status === "PENDING").length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden border-0 shadow-lg shadow-emerald-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-10"></div>
            <CardContent className="relative p-6">
              <p className="text-sm font-medium text-slate-500">อนุมัติแล้ว</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {transactions.filter(t => t.status === "APPROVED" || t.status === "BORROWING").length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg shadow-slate-200/60">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-800">ประวัติการยืมของฉัน</CardTitle>
                <CardDescription className="text-slate-500">
                  แสดงประวัติการยืมและสถานะล่าสุด
                </CardDescription>
              </div>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-[180px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="PENDING">รออนุมัติ</option>
                <option value="APPROVED">อนุมัติแล้ว</option>
                <option value="BORROWING">กำลังยืม</option>
                <option value="RETURNED">คืนแล้ว</option>
                <option value="REJECTED">ถูกปฏิเสธ</option>
                <option value="OVERDUE">เลยกำหนด</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {filteredTransactions.length > 0 ? (
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
                    {filteredTransactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="py-3 font-medium text-slate-800">{t.equipment_name}</TableCell>
                        <TableCell className="py-3 text-slate-600">
                          {new Date(t.start_date).toLocaleDateString("th-TH")} -{" "}
                          {new Date(t.end_date).toLocaleDateString("th-TH")}
                        </TableCell>
                        <TableCell className="py-3 text-slate-600 max-w-xs truncate">{t.reason}</TableCell>
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

  // ADMIN Dashboard View
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800">
          แดชบอร์ดผู้ดูแลระบบ
        </h1>
        <p className="text-slate-500 max-w-2xl">
          ตรวจสอบสถานะการยืมอุปกรณ์ ภาพรวมการใช้งาน และจัดการอนุมัติคำขอยืม
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-blue-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-10"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">จำนวนอุปกรณ์ทั้งหมด</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats?.total_items ?? "-"}</p>
                <p className="text-xs text-slate-400 mt-1">รายการในระบบ</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-emerald-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-10"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">กำลังถูกยืมอยู่</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats?.active_borrows ?? "-"}</p>
                <p className="text-xs text-slate-400 mt-1">Approved / Borrowing</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-red-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-10"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">เลยกำหนดส่งคืน</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats?.overdue_items ?? "-"}</p>
                <p className="text-xs text-slate-400 mt-1">ต้องติดตาม</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-lg shadow-slate-200/60">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-800">อุปกรณ์ที่ถูกยืมบ่อยที่สุด</CardTitle>
            <CardDescription className="text-slate-500">
              Top 5 อุปกรณ์ที่ได้รับความนิยมในการยืม
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {stats?.top_borrowed && stats.top_borrowed.length > 0 ? (
              <div className="space-y-3">
                {stats.top_borrowed.map((item, index) => (
                  <div key={item.equipmentId} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      {item.count} ครั้ง
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-slate-500">ยังไม่มีข้อมูลการยืม</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg shadow-slate-200/60">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-800">คำขอยืมล่าสุด</CardTitle>
            <CardDescription className="text-slate-500">
              ตรวจสอบประวัติการยืมรายบุคคล
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{t.equipment_name}</p>
                      <p className="text-xs text-slate-400">{t.user_name} • {new Date(t.start_date).toLocaleDateString("th-TH")} - {new Date(t.end_date).toLocaleDateString("th-TH")}</p>
                    </div>
                    <div className="ml-3">
                      {getStatusBadge(t.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-slate-500">ยังไม่มีคำขอยืมในระบบ</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-0 shadow-lg shadow-slate-200/60">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-slate-800">จัดการคำขอยืม</CardTitle>
              <CardDescription className="text-slate-500">
                อนุมัติหรือปฏิเสธคำขอยืมอุปกรณ์
              </CardDescription>
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-[180px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="PENDING">รออนุมัติ</option>
              <option value="APPROVED">อนุมัติแล้ว</option>
              <option value="BORROWING">กำลังยืม</option>
              <option value="RETURNED">คืนแล้ว</option>
              <option value="REJECTED">ถูกปฏิเสธ</option>
              <option value="OVERDUE">เลยกำหนด</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">อุปกรณ์</TableHead>
                  <TableHead className="font-semibold text-slate-700">ผู้ยืม</TableHead>
                  <TableHead className="font-semibold text-slate-700">ช่วงวันที่</TableHead>
                  <TableHead className="font-semibold text-slate-700">สถานะ</TableHead>
                  <TableHead className="w-[180px] text-right font-semibold text-slate-700">การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="py-3 font-medium text-slate-800">{t.equipment_name}</TableCell>
                    <TableCell className="py-3 text-slate-600">{t.user_name}</TableCell>
                    <TableCell className="py-3 text-slate-600">
                      {new Date(t.start_date).toLocaleDateString("th-TH")} -{" "}
                      {new Date(t.end_date).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell className="py-3">
                      {getStatusBadge(t.status)}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleStatusChange(t.id, "APPROVED")}
                          className="shadow-md shadow-emerald-600/20"
                        >
                          อนุมัติ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(t.id, "REJECTED")}
                        >
                          ปฏิเสธ
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStatusChange(t.id, "RETURNED")}
                        >
                          คืนแล้ว
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-slate-500">
                      ยังไม่มีคำขอยืมในระบบ
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
