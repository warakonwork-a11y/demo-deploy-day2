## 1. Project Overview

ระบบบริหารจัดการการยืม-คืนอุปกรณ์สำนักงาน (IT Equipment, Stationery, Furniture) แบบครบวงจร 

* **Objective:** เพื่อเปลี่ยนกระบวนการ manual ให้เป็นระบบ Digital 100% ลดความผิดพลาดของข้อมูล (Human Error) และลดอัตราการสูญหายของทรัพย์สินบริษัท

* **Scope:** * Web-based Application (Responsive) สำหรับพนักงานและผู้ดูแลระบบ

    * ระบบจองล่วงหน้า (Reservation) และการอนุมัติ (Approval Workflow)

    * ระบบรายงานและแดชบอร์ดสรุปผล (Analytics Dashboard)



## 2. User Persona & Journey

* **Employee (Borrower):**

    * **Persona:** พนักงานที่ต้องการใช้อุปกรณ์ในการทำงานหรือจัดอีเวนต์

    * **Journey:** Login (Email/password) -> ค้นหาอุปกรณ์ตามหมวดหมู่ -> สร้างคำขอยืม (Specify Date/Reason) 

* **Inventory Manager (Admin):**

    * **Persona:** เจ้าหน้าที่ธุรการหรือ IT Support ที่ดูแลทรัพย์สิน

    * **Journey:** ตรวจสอบประวัติการยืมรายบุคคล



## 3. Core Features & User Stories

* **Inventory Management:** * "ในฐานะ Admin ฉันต้องการดูข้อมูลว่าใครยืมของไปบ้าง"

* **Smart Search & Filtering:**

    * "ในฐานะ User ฉันต้องการกรองอุปกรณ์ตามหมวดหมู่เพื่อให้หาของที่ต้องการได้รวดเร็ว"

* **Borrowing & Calendar Booking:**

    * "ในฐานะ User ฉันต้องการเลือกช่วงวันที่ยืม-คืน เพื่อจองอุปกรณ์"

* **Inventory Dashboard:**

    * "ในฐานะ Admin ฉันต้องการดูสถิติอุปกรณ์ที่ถูกยืมบ่อยที่สุด"



## 4. Tech Stack & Tools

* **Frontend:** Next.js 14 (App Router), Tailwind CSS, Shadcn/UI (Modern & Responsive UI)

* **Backend:** Next.js API Routes (Serverless Functions)

* **Database:** Vercel Postgres (Serverless PostgreSQL)

* **ORM:** Prisma

* **Validation:** Zod (Schema Validation)



## 5. Database Schema (High-level)

* **User**

    * `id` (UUID, PK), `name` (String), `email` (String, Unique), `role` (Enum: ADMIN, USER), `department_id` (FK)

* **Category**

    * `id` (Int, PK), `name` (String), `description` (Text)

* **Equipment**

    * `id` (UUID, PK), `sku` (String, Unique), `name` (String), `category_id` (FK), `total_stock` (Int), `available_stock` (Int), `location` (String), `image_url` (String)

* **Transaction**

    * `id` (UUID, PK), `user_id` (FK), `equipment_id` (FK), `start_date` (DateTime), `end_date` (DateTime), `return_date` (DateTime, Nullable), `status` (Enum: PENDING, APPROVED, REJECTED, BORROWING, RETURNED, OVERDUE), `reason` (Text), `admin_remark` (Text)

* **AuditLog**

    * `id` (BigInt, PK), `action` (String), `table_name` (String), `record_id` (String), `performed_by` (FK), `timestamp` (DateTime)



## 6. API Contract & Interfaces

* **GET /api/v1/inventory?category={id}&search={query}**

    * Response: `Array<{ id, name, sku, available_stock, ... }>`

* **POST /api/v1/borrow**

    * Body: `{ equipment_id: string, start_date: ISO8601, end_date: ISO8601, reason: string }`

* **PATCH /api/v1/admin/transactions/{id}**

    * Body: `{ status: "APPROVED" | "REJECTED" | "RETURNED", remarks?: string }`

* **GET /api/v1/dashboard/stats** (Admin Only)

    * Response: `{ total_items: number, active_borrows: number, overdue_items: number, top_borrowed: [] }`



## 7. Constraints & Non-Functional Requirements

* **Concurrency Control:** ใช้ **Prisma Transaction ($transaction)** ในจังหวะการกด Approve เพื่อตัด Stock ป้องกันปัญหาการยืมเกินจำนวนที่มีอยู่จริง (Race Condition)

* **Security:** * Implement **RBAC (Role-Based Access Control)**: เฉพาะ Admin เท่านั้นที่เข้าถึง Route `/admin/*` ได้

    * Data Sanitization เพื่อป้องกัน SQL Injection และ XSS

* **Performance:** * ใช้ **Indexing** ใน Database สำหรับ Field ที่ถูกค้นหาบ่อย เช่น `sku`, `status`, `user_id`

    * หน้ารายการอุปกรณ์ต้องใช้ **Pagination** (Limit 20 items per page)

* **Availability & Reliability:**

    * ระบบต้องรองรับการจองล่วงหน้าโดยไม่เกิด Slot ทับซ้อนกัน (Date Range Overlap Validation)

    * มีระบบบันทึก Log ทุกครั้งที่มีการแก้ไขสถานะของ Transaction