import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const swaggerJson = fs.readFileSync(
    path.join(process.cwd(), "public", "swagger.json"),
    "utf-8"
  );
  return NextResponse.json(JSON.parse(swaggerJson));
}
