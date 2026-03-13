import { NextRequest, NextResponse } from "next/server";
import { borrowRequestSchema } from "@/lib/validations/borrow-schema";
import { createBorrowTransaction } from "@/lib/inventory";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = borrowRequestSchema.parse({
      equipmentId: body.equipment_id,
      startDate: body.start_date,
      endDate: body.end_date,
      reason: body.reason
    });

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const transaction = await createBorrowTransaction({
      userId: user.id,
      equipmentId: parsed.equipmentId,
      startDate: new Date(parsed.startDate),
      endDate: new Date(parsed.endDate),
      reason: parsed.reason
    });

    return NextResponse.json(
      {
        id: transaction.id,
        status: transaction.status
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create borrow request" },
      { status: 500 }
    );
  }
}

