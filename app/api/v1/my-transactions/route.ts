import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        equipment: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(
      transactions.map((t) => ({
        id: t.id,
        equipment_name: t.equipment.name,
        start_date: t.startDate,
        end_date: t.endDate,
        reason: t.reason,
        status: t.status
      }))
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to load transactions" },
      { status: 500 }
    );
  }
}
