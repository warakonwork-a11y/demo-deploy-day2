import { PrismaClient, UserRole, TransactionStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: "IT Equipment",
        description: "อุปกรณ์ IT เช่น Notebook, Tablet, Projector"
      }
    }),
    prisma.category.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: "Stationery",
        description: "เครื่องเขียนและอุปกรณ์สำนักงาน"
      }
    }),
    prisma.category.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: "Furniture",
        description: "เฟอร์นิเจอร์สำนักงาน"
      }
    })
  ]);

  console.log("Created categories:", categories.length);

  // Create equipment
  const equipments = [
    {
      sku: "IT-NB-001",
      name: "MacBook Pro 14-inch",
      categoryId: 1,
      totalStock: 5,
      availableStock: 3,
      location: "IT Room",
      imageUrl: null
    },
    {
      sku: "IT-NB-002",
      name: "Dell XPS 13",
      categoryId: 1,
      totalStock: 3,
      availableStock: 2,
      location: "IT Room",
      imageUrl: null
    },
    {
      sku: "IT-PROJ-001",
      name: "EPSON Projector EB-2250U",
      categoryId: 1,
      totalStock: 2,
      availableStock: 1,
      location: "Meeting Room A",
      imageUrl: null
    },
    {
      sku: "IT-TAB-001",
      name: "iPad Pro 12.9-inch",
      categoryId: 1,
      totalStock: 4,
      availableStock: 4,
      location: "IT Room",
      imageUrl: null
    },
    {
      sku: "STA-NB-001",
      name: "Notebook A5",
      categoryId: 2,
      totalStock: 100,
      availableStock: 80,
      location: "Stationery Cabinet",
      imageUrl: null
    },
    {
      sku: "STA-PEN-001",
      name: "Pilot G-2 Pen Set",
      categoryId: 2,
      totalStock: 50,
      availableStock: 45,
      location: "Stationery Cabinet",
      imageUrl: null
    },
    {
      sku: "STA-WB-001",
      name: "Whiteboard Marker Set",
      categoryId: 2,
      totalStock: 20,
      availableStock: 18,
      location: "Stationery Cabinet",
      imageUrl: null
    },
    {
      sku: "FUR-CH-001",
      name: "Office Chair Ergonomic",
      categoryId: 3,
      totalStock: 10,
      availableStock: 7,
      location: "Storage Room",
      imageUrl: null
    },
    {
      sku: "FUR-TB-001",
      name: "Conference Table (8 persons)",
      categoryId: 3,
      totalStock: 3,
      availableStock: 2,
      location: "Meeting Room A",
      imageUrl: null
    }
  ];

  for (const equipment of equipments) {
    await prisma.equipment.upsert({
      where: { sku: equipment.sku },
      update: equipment,
      create: equipment
    });
  }

  console.log("Created equipments:", equipments.length);

  // Create demo users
  const demoUser = await prisma.user.upsert({
    where: { email: "employee@example.com" },
    update: {},
    create: {
      email: "employee@example.com",
      name: "พนักงานทดสอบ",
      role: UserRole.USER,
      departmentId: "IT"
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "ผู้ดูแลระบบ",
      role: UserRole.ADMIN,
      departmentId: "ADMIN"
    }
  });

  console.log("Created users:", { demoUser: demoUser.email, adminUser: adminUser.email });

  // Get equipment for demo transactions
  const macbook = await prisma.equipment.findUnique({ where: { sku: "IT-NB-001" } });
  const projector = await prisma.equipment.findUnique({ where: { sku: "IT-PROJ-001" } });
  const ipad = await prisma.equipment.findUnique({ where: { sku: "IT-TAB-001" } });

  if (macbook && projector && ipad) {
    // Create demo transactions
    await Promise.all([
      prisma.transaction.upsert({
        where: { id: "tx-001" },
        update: {},
        create: {
          id: "tx-001",
          userId: demoUser.id,
          equipmentId: macbook.id,
          startDate: new Date("2026-03-10"),
          endDate: new Date("2026-03-15"),
          reason: "ใช้สำหรับการประชุมลูกค้า",
          status: TransactionStatus.PENDING
        }
      }),
      prisma.transaction.upsert({
        where: { id: "tx-002" },
        update: {},
        create: {
          id: "tx-002",
          userId: demoUser.id,
          equipmentId: projector.id,
          startDate: new Date("2026-03-05"),
          endDate: new Date("2026-03-08"),
          reason: "ใช้สำหรับงานนำเสนอ",
          status: TransactionStatus.APPROVED
        }
      }),
      prisma.transaction.upsert({
        where: { id: "tx-003" },
        update: {},
        create: {
          id: "tx-003",
          userId: demoUser.id,
          equipmentId: ipad.id,
          startDate: new Date("2026-02-20"),
          endDate: new Date("2026-02-25"),
          reason: "ใช้สำหรับอบรมลูกค้า",
          status: TransactionStatus.RETURNED,
          returnDate: new Date("2026-02-25")
        }
      }),
      prisma.transaction.upsert({
        where: { id: "tx-004" },
        update: {},
        create: {
          id: "tx-004",
          userId: demoUser.id,
          equipmentId: macbook.id,
          startDate: new Date("2026-01-15"),
          endDate: new Date("2026-01-20"),
          reason: "ขอยืมเพื่อทำงานนอก офис",
          status: TransactionStatus.REJECTED,
          adminRemark: "อุปกรณ์ถูกยืมไปแล้วในช่วงเวลาดังกล่าว"
        }
      })
    ]);

    // Decrease available stock for approved transaction
    await prisma.equipment.update({
      where: { id: projector.id },
      data: { availableStock: { decrement: 1 } }
    });

    console.log("Created demo transactions: 4 transactions");
  }

  console.log("\n✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
