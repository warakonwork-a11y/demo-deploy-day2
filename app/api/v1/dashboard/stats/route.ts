import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/inventory";
import { assertAdmin, getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    assertAdmin(user);

    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}

