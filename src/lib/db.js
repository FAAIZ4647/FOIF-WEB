import fs from "fs";
import path from "path";
import { hashPassword } from "./auth";
import { products as seedProducts } from "@/data/products";
import { categories as seedCategories } from "@/data/categories";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "foif-database.json");

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const now = Date.now();
    const initialData = {
      users: [
        {
          id: "usr-admin-1",
          email: "admin@foifind.com",
          passwordHash: hashPassword("foifAdmin2025!"),
          name: "FOIF Central Procurement Desk",
          company: "Fortress of Industrial Fasteners",
          phone: "+91 72009 79731",
          role: "ADMIN",
          createdAt: now,
        },
        {
          id: "usr-customer-1",
          email: "procurement@larsentoubro.com",
          passwordHash: hashPassword("customer2025!"),
          name: "Rajesh Sharma",
          company: "Larsen & Toubro Heavy Infrastructure",
          phone: "+91 98401 23456",
          location: "Chennai Port Project Site, Tamil Nadu",
          role: "CUSTOMER",
          createdAt: now,
        },
      ],
      products: seedProducts,
      categories: seedCategories,
      quotations: [
        {
          id: "rfq-1001",
          rfqNumber: "FOIF-RFQ-2025-1001",
          customerId: "usr-customer-1",
          customerName: "Rajesh Sharma",
          companyName: "Larsen & Toubro Heavy Infrastructure",
          email: "procurement@larsentoubro.com",
          phone: "+91 98401 23456",
          destination: "Chennai Port Pier 4 Expansion Site",
          status: "QUOTATION_ISSUED", // PENDING_REVIEW | QUOTATION_ISSUED | ACCEPTED | REJECTED | EXPIRED
          items: [
            {
              productId: "foif-din933-hex-bolt",
              name: "Hex Head Structural Bolt (Full Thread)",
              specs: "M16 x 80mm | Grade 10.9 HT Alloy Steel | Hot Dip Galv",
              quantity: 5000,
              unit: "pcs",
              unitPrice: 42.5, // INR per unit
              subtotal: 212500,
            },
            {
              productId: "foif-chem-anchor-stud",
              name: "Chemical Injection Anchor Stud Rod with Capsule",
              specs: "M20 x 260mm | Grade A4-70 (SS316)",
              quantity: 1200,
              unit: "sets",
              unitPrice: 285.0,
              subtotal: 342000,
            },
          ],
          totalAmount: 554500,
          currency: "INR",
          issuedAt: now - 2 * 60 * 60 * 1000, // Issued 2 hours ago
          expiresAt: now + 22 * 60 * 60 * 1000, // Valid for 24h total (22h remaining)
          adminNotes: "MTR 3.1 certificates included for both lots. Batch heat number HT-9021. Dispatch within 48h upon PO confirmation.",
          customerNotes: "Critical civil pier construction timeline.",
          attachmentName: "LNT_Foundation_Pier_Drawing_Rev3.pdf",
          history: [
            { timestamp: now - 3 * 60 * 60 * 1000, action: "RFQ Submitted by Client" },
            { timestamp: now - 2 * 60 * 60 * 1000, action: "Quotation Prepared & Issued by FOIF Admin with 24h Expiry Window" },
          ],
        },
        {
          id: "rfq-1002",
          rfqNumber: "FOIF-RFQ-2025-1002",
          customerId: "usr-customer-1",
          customerName: "Rajesh Sharma",
          companyName: "Larsen & Toubro Heavy Infrastructure",
          email: "procurement@larsentoubro.com",
          phone: "+91 98401 23456",
          destination: "Kudankulam Nuclear Power Area Substation",
          status: "PENDING_REVIEW",
          items: [
            {
              productId: "foif-spec-titanium-fastener",
              name: "Titanium Grade 5 (Ti-6Al-4V) Hex & Socket Fasteners",
              specs: "M12 x 50mm | Ti-6Al-4V | Non-Magnetic",
              quantity: 450,
              unit: "pcs",
              unitPrice: null,
              subtotal: null,
            },
          ],
          totalAmount: null,
          currency: "INR",
          issuedAt: null,
          expiresAt: null,
          adminNotes: "",
          customerNotes: "Spectrometry composition cert required per ASTM B348.",
          attachmentName: "Titanium_Substation_Spec.dxf",
          history: [
            { timestamp: now - 1 * 60 * 60 * 1000, action: "RFQ Submitted by Client - Awaiting Engineering Review" },
          ],
        },
        {
          id: "rfq-1003",
          rfqNumber: "FOIF-RFQ-2025-1003",
          customerId: "usr-customer-1",
          customerName: "Rajesh Sharma",
          companyName: "Larsen & Toubro Heavy Infrastructure",
          email: "procurement@larsentoubro.com",
          phone: "+91 98401 23456",
          destination: "Tirunelveli Rail Yard Shed",
          status: "EXPIRED",
          items: [
            {
              productId: "foif-sd-hex-ruspert",
              name: "Hex Washer Head Self-Drilling Screw with EPDM",
              specs: "#12-14 x 68mm | Class 4 Ruspert",
              quantity: 35000,
              unit: "pcs",
              unitPrice: 8.2,
              subtotal: 287000,
            },
          ],
          totalAmount: 287000,
          currency: "INR",
          issuedAt: now - 32 * 60 * 60 * 1000, // Issued 32 hours ago
          expiresAt: now - 8 * 60 * 60 * 1000, // Expired 8 hours ago
          adminNotes: "Quotation lapsed per 24h metal commodity index policy.",
          customerNotes: "",
          attachmentName: null,
          history: [
            { timestamp: now - 33 * 60 * 60 * 1000, action: "RFQ Submitted" },
            { timestamp: now - 32 * 60 * 60 * 1000, action: "Quotation Issued" },
            { timestamp: now - 8 * 60 * 60 * 1000, action: "Expired (24-Hour Expiry Window Elapsed)" },
          ],
        },
      ],
      orders: [
        {
          id: "ord-5001",
          orderNumber: "FOIF-ORD-2025-5001",
          rfqReference: "FOIF-RFQ-2025-0994",
          customerId: "usr-customer-1",
          customerName: "Rajesh Sharma",
          companyName: "Larsen & Toubro Heavy Infrastructure",
          deliveryAddress: "Chennai Port Pier 4 Expansion Site, Chennai 600001",
          poNumber: "LNT-PO-2025-OCT-8812",
          status: "CONFIRMED_DISPATCHING", // PENDING | CONFIRMED_DISPATCHING | DISPATCHED | DELIVERED
          items: [
            {
              productId: "foif-din933-hex-bolt",
              name: "Hex Head Structural Bolt DIN 933",
              specs: "M24 x 100mm | Grade 10.9 | HDG",
              quantity: 2500,
              unit: "pcs",
              unitPrice: 94.0,
              subtotal: 235000,
            },
          ],
          totalAmount: 235000,
          paymentTerms: "Commercial Invoice (30 Days Net on MTR Acceptance)",
          mtrDossierNumber: "MTR-2025-BATCH-4412",
          dispatchDate: new Date(now + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          carrier: "FOIF Logistics Dedicated Freight - Tirunelveli Hub",
          createdAt: now - 24 * 60 * 60 * 1000,
        },
      ],
      carts: {},
      wishlists: {},
      auditLogs: [
        { id: "aud-1", timestamp: now - 2 * 60 * 60 * 1000, actor: "admin@foifind.com", event: "Issued Quotation FOIF-RFQ-2025-1001 with 24h validity" },
      ],
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
  }
}

function readDb() {
  ensureDb();
  try {
    const content = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database:", err);
    return { users: [], products: [], categories: [], quotations: [], orders: [], carts: {}, wishlists: {}, auditLogs: [] };
  }
}

function writeDb(data) {
  ensureDb();
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempPath, DB_PATH);
}

// ── Database API ────────────────────────────────────────────────────────────

export const db = {
  // Users
  getUsers() {
    return readDb().users;
  },

  getUserByEmail(email) {
    if (!email) return null;
    const users = readDb().users;
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getUserById(id) {
    const users = readDb().users;
    return users.find((u) => u.id === id) || null;
  },

  createUser(userData) {
    const data = readDb();
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
      role: userData.role || "CUSTOMER",
      ...userData,
    };
    data.users.push(newUser);
    writeDb(data);
    return newUser;
  },

  // Products
  getProducts(filter = {}) {
    let items = readDb().products;
    if (filter.category) {
      items = items.filter((p) => p.category === filter.category);
    }
    if (filter.query) {
      const q = filter.query.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.standards.some((s) => s.toLowerCase().includes(q)) ||
          p.materials.some((m) => m.toLowerCase().includes(q))
      );
    }
    return items;
  },

  getProductById(id) {
    const products = readDb().products;
    return products.find((p) => p.id === id || p.sku === id) || null;
  },

  createProduct(productData) {
    const data = readDb();
    const newProd = {
      id: productData.id || `foif-${Date.now()}`,
      createdAt: Date.now(),
      ...productData,
    };
    data.products.push(newProd);
    writeDb(data);
    return newProd;
  },

  updateProduct(id, updates) {
    const data = readDb();
    const idx = data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    data.products[idx] = { ...data.products[idx], ...updates, updatedAt: Date.now() };
    writeDb(data);
    return data.products[idx];
  },

  deleteProduct(id) {
    const data = readDb();
    data.products = data.products.filter((p) => p.id !== id);
    writeDb(data);
    return true;
  },

  // Categories
  getCategories() {
    return readDb().categories;
  },

  // Quotations / RFQs
  getQuotations(filter = {}) {
    const data = readDb();
    let quotes = data.quotations;

    // Check & update 24h expiry for all quotes automatically
    const now = Date.now();
    let hasUpdates = false;

    quotes.forEach((q) => {
      if (q.status === "QUOTATION_ISSUED" && q.expiresAt && now > q.expiresAt) {
        q.status = "EXPIRED";
        q.history.push({ timestamp: q.expiresAt, action: "Quotation auto-expired after 24 hours" });
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      writeDb(data);
    }

    if (filter.customerId) {
      quotes = quotes.filter((q) => q.customerId === filter.customerId || q.email === filter.email);
    }
    if (filter.status) {
      quotes = quotes.filter((q) => q.status === filter.status);
    }

    // Sort newest first
    return quotes.sort((a, b) => (b.issuedAt || 0) - (a.issuedAt || 0));
  },

  getQuotationById(id) {
    const quotes = this.getQuotations();
    return quotes.find((q) => q.id === id || q.rfqNumber === id) || null;
  },

  createQuotation(rfqData) {
    const data = readDb();
    const now = Date.now();
    const rfqNumber = `FOIF-RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newQuote = {
      id: `rfq-${Date.now()}`,
      rfqNumber,
      status: "PENDING_REVIEW",
      createdAt: now,
      issuedAt: null,
      expiresAt: null,
      items: rfqData.items || [],
      customerId: rfqData.customerId || null,
      customerName: rfqData.customerName || "Prospective Client",
      companyName: rfqData.companyName || "Industrial Enterprise",
      email: rfqData.email,
      phone: rfqData.phone,
      destination: rfqData.destination || "Chennai / All-India",
      customerNotes: rfqData.customerNotes || "",
      adminNotes: "",
      totalAmount: null,
      currency: "INR",
      attachmentName: rfqData.attachmentName || null,
      history: [
        { timestamp: now, action: `RFQ Submitted: ${rfqNumber} with ${rfqData.items?.length || 0} line items` },
      ],
    };

    data.quotations.unshift(newQuote);
    data.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      timestamp: now,
      actor: rfqData.email,
      event: `New RFQ submitted: ${rfqNumber}`,
    });

    writeDb(data);
    return newQuote;
  },

  prepareQuotation(rfqId, { pricedItems, totalAmount, adminNotes }) {
    const data = readDb();
    const quote = data.quotations.find((q) => q.id === rfqId || q.rfqNumber === rfqId);
    if (!quote) return null;

    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    quote.items = pricedItems;
    quote.totalAmount = totalAmount;
    quote.adminNotes = adminNotes || "Official B2B quotation valid for 24 hours from issuance.";
    quote.status = "QUOTATION_ISSUED";
    quote.issuedAt = now;
    quote.expiresAt = now + TWENTY_FOUR_HOURS; // STRICT 24-HOUR POLICY
    quote.history.push({
      timestamp: now,
      action: `Commercial Quotation Issued by Admin. Total: INR ${totalAmount?.toLocaleString()} (Valid until ${new Date(now + TWENTY_FOUR_HOURS).toLocaleString()})`,
    });

    data.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      timestamp: now,
      actor: "admin",
      event: `Prepared Quotation ${quote.rfqNumber} (24h window)`,
    });

    writeDb(data);
    return quote;
  },

  acceptQuotation(rfqId, customerInfo) {
    const data = readDb();
    const quote = data.quotations.find((q) => q.id === rfqId || q.rfqNumber === rfqId);
    if (!quote) throw new Error("Quotation not found");

    const now = Date.now();

    // Enforce 24-hour expiry check
    if (quote.expiresAt && now > quote.expiresAt) {
      quote.status = "EXPIRED";
      writeDb(data);
      throw new Error("This quotation has expired under the 24-hour metal commodity policy. Please request a quote refresh.");
    }

    if (quote.status !== "QUOTATION_ISSUED") {
      throw new Error(`Cannot accept quotation in '${quote.status}' status`);
    }

    quote.status = "ACCEPTED";
    quote.acceptedAt = now;
    quote.history.push({ timestamp: now, action: "Quotation Accepted by Customer. Order generation triggered." });

    // Automatically convert into an Order
    const orderNumber = `FOIF-ORD-${new Date().getFullYear()}-${Math.floor(5000 + Math.random() * 5000)}`;
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      rfqReference: quote.rfqNumber,
      customerId: quote.customerId,
      customerName: customerInfo?.customerName || quote.customerName,
      companyName: customerInfo?.companyName || quote.companyName,
      deliveryAddress: customerInfo?.deliveryAddress || quote.destination,
      poNumber: customerInfo?.poNumber || `PO-${Date.now().toString().slice(-6)}`,
      status: "CONFIRMED_DISPATCHING",
      items: quote.items,
      totalAmount: quote.totalAmount,
      currency: "INR",
      paymentTerms: "Commercial Invoice (30 Days Net on MTR Acceptance)",
      mtrDossierNumber: `MTR-${new Date().getFullYear()}-BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      dispatchDate: new Date(now + 48 * 60 * 60 * 1000).toISOString().split("T")[0],
      createdAt: now,
    };

    data.orders.unshift(newOrder);
    data.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      timestamp: now,
      actor: quote.email,
      event: `Converted accepted quote ${quote.rfqNumber} into Order ${orderNumber}`,
    });

    writeDb(data);
    return { quotation: quote, order: newOrder };
  },

  rejectQuotation(rfqId, reason) {
    const data = readDb();
    const quote = data.quotations.find((q) => q.id === rfqId || q.rfqNumber === rfqId);
    if (!quote) return null;

    quote.status = "REJECTED";
    quote.rejectionReason = reason || "Declined by customer";
    quote.history.push({ timestamp: Date.now(), action: `Quotation Declined: ${reason || "No reason specified"}` });
    writeDb(data);
    return quote;
  },

  // Orders
  getOrders(filter = {}) {
    let orders = readDb().orders;
    if (filter.customerId) {
      orders = orders.filter((o) => o.customerId === filter.customerId);
    }
    return orders;
  },

  getOrderById(id) {
    const orders = readDb().orders;
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  createDirectOrder(orderData) {
    const data = readDb();
    const now = Date.now();
    const orderNumber = `FOIF-ORD-${new Date().getFullYear()}-${Math.floor(5000 + Math.random() * 5000)}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      rfqReference: null,
      customerId: orderData.customerId || null,
      customerName: orderData.customerName,
      companyName: orderData.companyName,
      deliveryAddress: orderData.deliveryAddress,
      poNumber: orderData.poNumber || `PO-DIRECT-${Date.now().toString().slice(-6)}`,
      status: "PENDING_DISPATCH",
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      currency: "INR",
      paymentTerms: "30-Day B2B Commercial Invoicing",
      mtrDossierNumber: `MTR-${new Date().getFullYear()}-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
      dispatchDate: new Date(now + 48 * 60 * 60 * 1000).toISOString().split("T")[0],
      createdAt: now,
      notes: orderData.notes || "",
    };

    data.orders.unshift(newOrder);
    writeDb(data);
    return newOrder;
  },

  // Cart Storage (Persistent per user/session)
  getCart(userId) {
    const carts = readDb().carts || {};
    return carts[userId] || [];
  },

  saveCart(userId, items) {
    const data = readDb();
    if (!data.carts) data.carts = {};
    data.carts[userId] = items;
    writeDb(data);
    return items;
  },

  // Wishlist Storage (Persistent per user/session)
  getWishlist(userId) {
    const wishlists = readDb().wishlists || {};
    return wishlists[userId] || [];
  },

  saveWishlist(userId, items) {
    const data = readDb();
    if (!data.wishlists) data.wishlists = {};
    data.wishlists[userId] = items;
    writeDb(data);
    return items;
  },

  // Audit Logs
  getAuditLogs() {
    return readDb().auditLogs || [];
  },
};
