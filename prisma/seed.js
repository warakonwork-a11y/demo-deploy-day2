const { PrismaClient, UserRole, TransactionStatus } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const cat1 = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "IT Equipment",
      description: "อุปกรณ์ IT เช่น Notebook, Tablet, Projector"
    }
  });

  const cat2 = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: "Stationery",
      description: "เครื่องเขียนและอุปกรณ์สำนักงาน"
    }
  });

  const cat3 = await prisma.category.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: "Furniture",
      description: "เฟอร์นิเจอร์สำนักงาน"
    }
  });

  console.log("Created categories");

  // Create equipment
  await prisma.equipment.upsert({
    where: { sku: "IT-NB-001" },
    update: {},
    create: {
      sku: "IT-NB-001",
      name: "MacBook Pro 14-inch",
      categoryId: 1,
      totalStock: 5,
      availableStock: 3,
      location: "IT Room"
    }
  });

  await prisma.equipment.upsert({
    where: { sku: "IT-NB-002" },
    update: {},
    create: {
      sku: "IT-NB-002",
      name: "Dell XPS 13",
      categoryId: 1,
      totalStock: 3,
      availableStock: 2,
      location: "IT Room"
    }
  });

  await prisma.equipment.upsert({
    where: { sku: "IT-PROJ-001" },
    update: {},
    create: {
      sku: "IT-PROJ-001",
      name: "EPSON Projector EB-2250U",
      categoryId: 1,
      totalStock: 2,
      availableStock: 1,
      location: "Meeting Room A"
    }
  });

  await prisma.equipment.upsert({
    where: { sku: "IT-TAB-001" },
    update: {},
    create: {
      sku: "IT-TAB-001",
      name: "iPad Pro 12.9-inch",
      categoryId: 1,
      totalStock: 4,
      availableStock: 4,
      location: "IT Room"
    }
  });

  await prisma.equipment.upsert({
    where: { sku: "STA-NB-001" },
    update: {},
    create: {
      sku: "STA-NB-001",
      name: "Notebook A5",
      categoryId: 2,
      totalStock: 100,
      availableStock: 80,
      location: "Stationery Cabinet"
    }
  });

  await prisma.equipment.upsert({
    where: { sku: "STA-PEN-001" },
    update: {},
    create: {
      sku: "STA-PEN-001",
      name: "Pilot G-2 Pen Set",
      categoryId: 2,
      totalStock: 50,
      availableStock: 45,
      location: "Stationery Cabinet"
    }
  });

  await prisma.equipment.upsert({
    where: { sku: "FUR-CH-001" },
    update: {},
    create: {
      sku: "FUR-CH-001",
      name: "Office Chair Ergonomic",
      categoryId: 3,
      totalStock: 10,
      availableStock: 7,
      location: "Storage Room"
    }
  });

  console.log("Created equipment");

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

  console.log("Created users:", demoUser.email, adminUser.email);

  console.log("\n✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
