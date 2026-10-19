import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const token = request.cookies.get("foif_session")?.value;
    const payload = verifyToken(token);
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    let filter = {};
    if (payload?.role === "ADMIN") {
      // Admin can see all or filter by status
      const status = searchParams.get("status");
      if (status) filter.status = status;
    } else if (payload?.userId) {
      filter.customerId = payload.userId;
    } else if (emailParam) {
      filter.email = emailParam;
    } else {
      return NextResponse.json({ quotations: [] });
    }

    const quotations = db.getQuotations(filter);
    return NextResponse.json({ quotations });
  } catch (err) {
    console.error("Quotations GET error:", err);
    return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get("foif_session")?.value;
    const payload = verifyToken(token);

    const body = await request.json();
    const { email, phone, companyName, customerName, items, destination, customerNotes, attachmentName } = body;

    // Strict validation
    if (!email || !phone || !companyName) {
      return NextResponse.json(
        { error: "Company name, email, and phone number are mandatory for enterprise RFQ submission." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "At least one product line item with quantity is required in your RFQ." },
        { status: 400 }
      );
    }

    // Sanitize and validate line items
    const validatedItems = items.map((item, idx) => {
      const quantity = parseInt(item.quantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for line item ${idx + 1}: ${item.name || "Fastener"}`);
      }
      return {
        productId: item.productId || item.id || `custom-item-${idx}`,
        name: item.name || "Industrial Fastener Lot",
        specs: item.specs || item.materialGrade || "Standard Specification",
        quantity,
        unit: item.unit || "pcs",
        unitPrice: null, // Initial RFQ has no price until engineering quote issued
        subtotal: null,
      };
    });

    const quotation = db.createQuotation({
      customerId: payload?.userId || null,
      customerName: customerName || payload?.name || "Procurement Officer",
      companyName,
      email,
      phone,
      destination: destination || "Chennai / All-India Site",
      customerNotes: customerNotes || "",
      attachmentName: attachmentName || null,
      items: validatedItems,
    });

    return NextResponse.json({ success: true, quotation }, { status: 201 });
  } catch (err) {
    console.error("Quotations POST error:", err);
    return NextResponse.json({ error: err.message || "Failed to submit RFQ" }, { status: 400 });
  }
}
