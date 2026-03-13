"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryFiltersValue } from "@/components/inventory/inventory-filters";
import { BorrowDialog } from "@/components/inventory/inventory-borrow-dialog";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  available_stock: number;
  total_stock: number;
  category: string;
  location: string;
  image_url?: string | null;
}

interface InventoryTableProps {
  filters: InventoryFiltersValue;
}

export function InventoryTable({ filters }: InventoryTableProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.categoryId) params.set("category", filters.categoryId.toString());
        const res = await fetch(`/api/v1/inventory?${params.toString()}`);
        if (!res.ok) return;
        const data: InventoryItem[] = await res.json();
        if (!cancelled) {
          setItems(data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void fetchData();
    return () => {
      cancelled = true;
    };
  }, [filters.search, filters.categoryId]);

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            <p className="text-sm text-slate-500">กำลังโหลดรายการอุปกรณ์...</p>
          </div>
        </div>
      )}
      
      {!loading && items.length > 0 && (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="font-semibold text-slate-700">อุปกรณ์</TableHead>
                <TableHead className="font-semibold text-slate-700">SKU</TableHead>
                <TableHead className="font-semibold text-slate-700">หมวดหมู่</TableHead>
                <TableHead className="font-semibold text-slate-700">สถานที่</TableHead>
                <TableHead className="text-center font-semibold text-slate-700">คงเหลือ</TableHead>
                <TableHead className="w-[120px] text-right font-semibold text-slate-700">การกระทำ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/80">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-400">
                          ทั้งหมด {item.total_stock} ชิ้น
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-mono text-slate-600">
                      {item.sku}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="bg-white">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.location}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <Badge 
                      variant={item.available_stock > 0 ? "success" : "destructive"}
                      className="px-3 py-1"
                    >
                      {item.available_stock > 0 ? `${item.available_stock} ชิ้น` : 'ไม่พร้อม'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button
                      size="sm"
                      variant={item.available_stock > 0 ? "default" : "secondary"}
                      disabled={item.available_stock <= 0}
                      onClick={() => setSelectedId(item.id)}
                      className={item.available_stock > 0 ? "shadow-md shadow-blue-600/20" : ""}
                    >
                      ขอจอง
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">ไม่พบอุปกรณ์ที่ตรงกับเงื่อนไข</p>
          <p className="text-sm text-slate-400 mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองอื่นๆ</p>
        </div>
      )}
      
      {selectedId && (
        <BorrowDialog
          equipmentId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
