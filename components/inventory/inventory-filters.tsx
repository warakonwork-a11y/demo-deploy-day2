"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export interface InventoryFiltersValue {
  search: string;
  categoryId?: number;
}

interface InventoryFiltersProps {
  onChange: (value: InventoryFiltersValue) => void;
}

interface CategoryOption {
  id: number;
  name: string;
}

export function InventoryFilters({ onChange }: InventoryFiltersProps) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    void fetch("/api/v1/inventory-categories")
      .then((res) => res.json())
      .then((data: CategoryOption[]) => {
        setCategories(data);
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    onChange({ search, categoryId });
  }, [search, categoryId, onChange]);

  return (
    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          ค้นหาด้วยชื่อหรือรหัส (SKU)
        </label>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            placeholder="เช่น Notebook, PROJ-SKU-001"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          หมวดหมู่อุปกรณ์
        </label>
        <Select
          value={categoryId?.toString() ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setCategoryId(value ? Number(value) : undefined);
          }}
          className="bg-white"
        >
          <option value="">ทั้งหมด</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
