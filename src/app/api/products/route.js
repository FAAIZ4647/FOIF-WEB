import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query");
    const sort = searchParams.get("sort");

    let products = db.getProducts({ category, query });

    if (sort === "name-asc") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name-desc") {
      products.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "category") {
      products.sort((a, b) => a.categoryCode.localeCompare(b.categoryCode));
    }

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Products GET error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get("foif_session")?.value;
    const payload = verifyToken(token);

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 403 });
    }

    const body = await request.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ error: "Product name and category are required" }, { status: 400 });
    }

    const newProduct = db.createProduct(body);
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err) {
    console.error("Products POST error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
