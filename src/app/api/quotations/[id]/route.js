import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const quotation = db.getQuotationById(id);

    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    return NextResponse.json({ quotation });
  } catch (err) {
    console.error("Quotation GET error:", err);
    return NextResponse.json({ error: "Failed to fetch quotation" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get("foif_session")?.value;
    const payload = verifyToken(token);
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === "prepare") {
      // ADMIN PREPARATION: Sets prices & starts 24-hour countdown clock
      if (!payload || payload.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized: Admin privileges required to issue quotations" }, { status: 403 });
      }

      const { pricedItems, totalAmount, adminNotes } = body;
      if (!pricedItems || !Array.isArray(pricedItems)) {
        return NextResponse.json({ error: "Itemized pricing is required" }, { status: 400 });
      }

      const quotation = db.prepareQuotation(id, { pricedItems, totalAmount, adminNotes });
      if (!quotation) {
        return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, quotation });
    }

    if (action === "accept") {
      // CUSTOMER ACCEPTANCE: Strictly checks 24-hour expiry window
      try {
        const result = db.acceptQuotation(id, body.customerInfo);
        return NextResponse.json({
          success: true,
          message: "Quotation successfully accepted! Commercial Order has been generated.",
          quotation: result.quotation,
          order: result.order,
        });
      } catch (acceptErr) {
        return NextResponse.json({ error: acceptErr.message }, { status: 400 });
      }
    }

    if (action === "reject") {
      // CUSTOMER DECLINE
      const quotation = db.rejectQuotation(id, body.reason);
      return NextResponse.json({ success: true, quotation });
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
  } catch (err) {
    console.error("Quotation PUT error:", err);
    return NextResponse.json({ error: err.message || "Failed to process quotation" }, { status: 500 });
  }
}
