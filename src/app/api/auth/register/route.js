import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password, name, company, phone, location } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "An account with this corporate email already exists" }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    const newUser = db.createUser({
      email,
      passwordHash,
      name,
      company: company || "Enterprise Buyer",
      phone: phone || "",
      location: location || "Chennai",
      role: "CUSTOMER",
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      company: newUser.company,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        company: newUser.company,
        role: newUser.role,
      },
    });

    response.cookies.set("foif_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
