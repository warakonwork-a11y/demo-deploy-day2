import { NextRequest, NextResponse } from "next/server";
import { TransactionStatus } from "@prisma/client";
import { adminUpdateTransactionSchema } from "@/lib/validations/borrow-schema";
import { updateTransactionStatusWithStock } from "@/lib/inventory";
import { assertAdmin, getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const user = await getCurrentUser();
    assertAdmin(user);

    const body = await request.json();
    const parsed = adminUpdateTransactionSchema.parse({
      status: body.status,
      remarks: body.remarks
    });

    const updated = await updateTransactionStatusWithStock({
      transactionId: params.id,
      adminId: user.id,
      status: parsed.status as TransactionStatus,
      remarks: parsed.remarks
    });

    return NextResponse.json({
      id: updated.id,
      status: updated.status,
      admin_remark: updated.adminRemark
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

