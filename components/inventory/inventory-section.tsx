"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryFilters, InventoryFiltersValue } from "@/components/inventory/inventory-filters";
import { InventoryTable } from "@/components/inventory/inventory-table";

export function InventorySection() {
  const [filters, setFilters] = useState<InventoryFiltersValue>({
    search: "",
    categoryId: undefined
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800">
          ค้นหาและจองอุปกรณ์สำนักงาน
        </h1>
        <p className="text-slate-500 max-w-2xl">
          เลือกอุปกรณ์ที่ต้องการใช้สำหรับงานประจำวันหรืออีเวนต์ พร้อมจองช่วงเวลายืม-คืนล่วงหน้า
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg shadow-blue-500/25">
          <div className="absolute right-0 top-0 -translate-y-2 translate-x-2 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-blue-100 text-sm font-medium">อุปกรณ์ทั้งหมด</p>
          <p className="text-3xl font-bold mt-1">ยืมได้เลย</p>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg shadow-emerald-500/25">
          <div className="absolute right-0 top-0 -translate-y-2 translate-x-2 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-emerald-100 text-sm font-medium">สถานะ</p>
          <p className="text-3xl font-bold mt-1">พร้อมใช้งาน</p>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white shadow-lg shadow-amber-500/25">
          <div className="absolute right-0 top-0 -translate-y-2 translate-x-2 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-amber-100 text-sm font-medium">จองล่วงหน้า</p>
          <p className="text-3xl font-bold mt-1">วางแผนง่าย</p>
        </div>
      </div>
      
      <Card className="shadow-lg shadow-slate-200/60 border-0">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-slate-800">รายการอุปกรณ์</CardTitle>
              <CardDescription className="text-slate-500">
                กรองตามหมวดหมู่ หรือค้นหาด้วยชื่อ/รหัส เพื่อลดเวลาการค้นหา
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <InventoryFilters onChange={setFilters} />
          <InventoryTable filters={filters} />
        </CardContent>
      </Card>
    </section>
  );
}
