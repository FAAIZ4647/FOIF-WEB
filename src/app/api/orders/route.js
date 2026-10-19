import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const token = request.cookies.get("foif_session")?.value;
    const payload = verifyToken(token);

    let filter = {};
    if (payload?.role === "ADMIN") {
      // Admin sees all orders
    } else if (payload?.userId) {
      filter.customerId = payload.userId;
    } else {
      return NextResponse.json({ orders: [] });
    }

    const orders = db.getOrders(filter);
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Orders GET error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get("foif_session")?.value;
    const payload = verifyToken(token);

    const body = await request.json();
    const { customerName, companyName, deliveryAddress, poNumber, items, notes } = body;

    if (!customerName || !companyName || !deliveryAddress) {
      return NextResponse.json(
        { error: "Customer name, company name, and delivery address are mandatory for order placement." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart contains no line items to order." }, { status: 400 });
    }

    const newOrder = db.createDirectOrder({
      customerId: payload?.userId || null,
      customerName,
      companyName,
      deliveryAddress,
      poNumber: poNumber || `PO-${Date.now().toString().slice(-6)}`,
      items,
      notes: notes || "",
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (err) {
    console.error("Orders POST error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
