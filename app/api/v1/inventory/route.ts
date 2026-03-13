import { NextRequest, NextResponse } from "next/server";
import { searchInventory } from "@/lib/inventory";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");
  const search = searchParams.get("search") ?? undefined;
  const pageParam = searchParams.get("page");

  const categoryId = categoryParam ? Number(categoryParam) : undefined;
  const page = pageParam ? Number(pageParam) : undefined;

  try {
    const result = await searchInventory({
      categoryId: Number.isNaN(categoryId) ? undefined : categoryId,
      search,
      page
    });

    return NextResponse.json(
      result.items.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        available_stock: item.availableStock,
        total_stock: item.totalStock,
        category: item.category.name,
        location: item.location,
        image_url: item.imageUrl
      }))
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load inventory" },
      { status: 500 }
    );
  }
}

