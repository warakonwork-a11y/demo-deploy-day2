import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertAdmin, getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  assertAdmin(user);

  const transactions = await prisma.transaction.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: 20,
    include: {
      equipment: true,
      user: true
    }
  } as never);

  return NextResponse.json(
    transactions.map((t) => ({
      id: t.id,
      equipment_name: t.equipment.name,
      user_name: t.user.name,
      start_date: t.startDate,
      end_date: t.endDate,
      status: t.status
    }))
  );
}

