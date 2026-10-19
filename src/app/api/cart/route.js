import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const token = request.cookies.get("foif_session")?.value;
    const payload = verifyToken(token);
    const userId = payload?.userId || request.cookies.get("foif_client_id")?.value || "guest";

    const items = db.getCart(userId);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("Cart GET error:", err);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get("foif_session")?.value;
    const payload = verifyToken(token);
    let clientId = request.cookies.get("foif_client_id")?.value;
    let setClientCookie = false;

    if (!clientId) {
      clientId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      setClientCookie = true;
    }

    const userId = payload?.userId || clientId;
    const { items } = await request.json();

    const saved = db.saveCart(userId, Array.isArray(items) ? items : []);
    const response = NextResponse.json({ success: true, items: saved });

    if (setClientCookie) {
      response.cookies.set("foif_client_id", clientId, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("Cart POST error:", err);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
