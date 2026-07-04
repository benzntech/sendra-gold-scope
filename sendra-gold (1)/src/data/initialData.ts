/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Branch, StaffUser, GoldRates, BuybackTicket, Order, AuditLogEntry } from "../types";
import { encryptKYCData } from "../lib/encryption";

// Initial Gold Pricing
export const INITIAL_GOLD_RATES: GoldRates = {
  sell24K: 7200,   // Rate in INR/USD per gram
  buy24K: 6850,
  sell22K: 6600,
  buy22K: 6280,
  sell18K: 5400,
  buy18K: 5130,
  lastUpdated: new Date().toISOString(),
  isOverride: false,
};

// Available Showroom Branches
export const INITIAL_BRANCHES: Branch[] = [
  {
    id: "br-mumbai",
    name: "Mumbai Flagship Showroom",
    city: "Mumbai",
    address: "Gold Plaza, Turner Road, Bandra West",
    phone: "+91 22 2640 1001",
    status: "active",
  },
  {
    id: "br-delhi",
    name: "Delhi Connaught Place",
    city: "New Delhi",
    address: "Block H, Connaught Place, Inner Circle",
    phone: "+91 11 4151 2002",
    status: "active",
  },
  {
    id: "br-bengaluru",
    name: "Bengaluru MG Road Office",
    city: "Bengaluru",
    address: "Garuda Mall Compound, MG Road",
    phone: "+91 80 4322 3003",
    status: "active",
  },
];

// Seed Staff accounts representing roles
export const INITIAL_STAFF: StaffUser[] = [
  {
    id: "st-exec-1",
    name: "Rahul Sharma (Mumbai)",
    email: "rahul.mumbai@sendragold.com",
    role: "executive",
    branchId: "br-mumbai",
    status: "active",
  },
  {
    id: "st-mgr-1",
    name: "Priyah Patel (Mumbai)",
    email: "priya.mumbai@sendragold.com",
    role: "manager",
    branchId: "br-mumbai",
    status: "active",
  },
  {
    id: "st-exec-2",
    name: "Amit Verma (Delhi)",
    email: "amit.delhi@sendragold.com",
    role: "executive",
    branchId: "br-delhi",
    status: "active",
  },
  {
    id: "st-mgr-2",
    name: "Vikram Malhotra (Delhi)",
    email: "vikram.delhi@sendragold.com",
    role: "manager",
    branchId: "br-delhi",
    status: "active",
  },
  {
    id: "st-admin",
    name: "Rajesh Sendra",
    email: "rajesh@sendragold.com",
    role: "admin",
    status: "active",
  },
];

// Initial Jewellery, Coin and Bar Products
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-nkl-01",
    name: "Imperial Kundan Bridal Necklace",
    description: "Exquisite 22K handcrafted Kundan necklace embedded with premium semi-precious rubies and floral motifs.",
    weight: 45.5,
    makingCharge: 450, // Making charge per gram
    category: "Jewellery",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    stock: 5,
    status: "active",
  },
  {
    id: "prod-bng-02",
    name: "Royal Temple Kada Bangles (Pair)",
    description: "Traditional 22K antique finish temple design bangles featuring rich filigree work and gold beads.",
    weight: 32.2,
    makingCharge: 380,
    category: "Jewellery",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
    stock: 8,
    status: "active",
  },
  {
    id: "prod-rng-03",
    name: "Classic Grace Gold Band",
    description: "A polished, timeless 18K gold band ring suitable for daily wear or stackable matching styles.",
    weight: 6.8,
    makingCharge: 250,
    category: "Jewellery",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600",
    stock: 15,
    status: "active",
  },
  {
    id: "prod-coin-04",
    name: "Lakshmi Auspicious 24K Gold Coin",
    description: "99.9% pure 24 Karat gold coin with high-relief embossing of Goddess Lakshmi. Certified tamper-proof packing.",
    weight: 10.0,
    makingCharge: 120,
    category: "Coins",
    image: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=600",
    stock: 50,
    status: "active",
  },
  {
    id: "prod-coin-05",
    name: "Lord Ganesha 24K Gold Coin",
    description: "999 Fine gold coin portraying Lord Ganesha, perfect for gifting and festival savings.",
    weight: 5.0,
    makingCharge: 150,
    category: "Coins",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    stock: 75,
    status: "active",
  },
  {
    id: "prod-bar-06",
    name: "Swiss Refining 24K Bullion Bar",
    description: "Individually serialized 100g Fine Gold casting pool bar, assayed globally and packed with security card.",
    weight: 100.0,
    makingCharge: 80,
    category: "Bars",
    image: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=600",
    stock: 12,
    status: "active",
  },
];

// Seed some initial buyback tickets with varied status for great demonstration capability
export const INITIAL_TICKETS: BuybackTicket[] = [
  {
    id: "SG-BB-2001",
    customerName: "Aditya Deshmukh",
    customerPhone: "+91 98200 12345",
    customerId: "cust-demo",
    branchId: "br-mumbai",
    branchName: "Mumbai Flagship Showroom",
    appointmentDate: "2026-06-05",
    appointmentTime: "11:00 AM",
    kycDocs: {
      aadhaarNumber: "7822-3849-2104",
      aadhaarUrl: encryptKYCData("Aadhaar Number verified. Aadhaar Image Uploaded (Demo)"),
      panNumber: "AMDPB1234K",
      panUrl: encryptKYCData("PAN Document verified. PAN Uploaded (Demo)"),
      customerPhotoUrl: encryptKYCData("Live photo captured. Face recognition match 98% (Demo)"),
      encrypted: true,
      encryptedAt: new Date(2026, 5, 5).toISOString(),
    },
    goldPurity: "22K",
    netWeight: 24.5,
    deductions: 1.2,
    deductionNotes: "Minor solder alloy traces on necklace links",
    liveBuybackRateApplied: 6280,
    payoutAmount: 146324, // (24.5 - 1.2) * 6280
    status: "completed",
    notes: "Customer paid via bank transfer. Transaction closed.",
    executiveId: "st-exec-1",
    executiveName: "Rahul Sharma (Mumbai)",
    managerId: "st-mgr-1",
    managerName: "Priyah Patel (Mumbai)",
    createdAt: new Date(2026, 5, 5, 11, 0, 0).toISOString(),
    updatedAt: new Date(2026, 5, 5, 12, 15, 0).toISOString(),
    invoiceGenerated: true,
    invoiceUrl: "INV-SG-BB-2001",
  },
  {
    id: "SG-BB-2002",
    customerName: "Sunita Sen",
    customerPhone: "+91 99100 55432",
    branchId: "br-mumbai",
    branchName: "Mumbai Flagship Showroom",
    appointmentDate: "2026-06-08",
    appointmentTime: "02:30 PM",
    kycDocs: {
      aadhaarNumber: "5543-9823-1109",
      aadhaarUrl: encryptKYCData("Aadhaar File Mumbai Ref 39402"),
      panNumber: "CHIPS4920M",
      panUrl: encryptKYCData("PAN File Mumbai Ref 39402"),
      customerPhotoUrl: encryptKYCData("Sunita Live Captured photo"),
      encrypted: true,
      encryptedAt: new Date(2026, 5, 8, 14, 30).toISOString(),
    },
    goldPurity: "18K",
    netWeight: 14.0,
    deductions: 0.5,
    deductionNotes: "Locket stone weight deduction",
    liveBuybackRateApplied: 5130,
    payoutAmount: 69255, // (13.5) * 5130
    status: "approval_pending",
    notes: "Purity tested using density spectrometer.",
    executiveId: "st-exec-1",
    executiveName: "Rahul Sharma (Mumbai)",
    createdAt: new Date(2026, 5, 8, 14, 30).toISOString(),
    updatedAt: new Date(2026, 5, 8, 14, 45).toISOString(),
    invoiceGenerated: false,
  },
  {
    id: "SG-BB-2003",
    customerName: "Mohammad Ali",
    customerPhone: "+91 98980 98980",
    customerId: "cust-demo",
    branchId: "br-delhi",
    branchName: "Delhi Connaught Place",
    appointmentDate: "2026-06-09",
    appointmentTime: "10:30 AM",
    kycDocs: { encrypted: false },
    goldPurity: "24K",
    netWeight: 0,
    deductions: 0,
    deductionNotes: "",
    liveBuybackRateApplied: 6850,
    payoutAmount: 0,
    status: "appointment_booked",
    createdAt: new Date(2026, 5, 7, 10, 0, 0).toISOString(),
    updatedAt: new Date(2026, 5, 7, 10, 0, 0).toISOString(),
    invoiceGenerated: false,
  },
];

// Initial Ecommerce Orders
export const INITIAL_ORDERS: Order[] = [
  {
    id: "SG-ORD-8801",
    customerId: "cust-demo",
    customerName: "Gaurav Malhotra",
    customerEmail: "vjtechspot@gmail.com",
    customerPhone: "+91 99999 00000",
    shippingAddress: "Flat 402, Sea Breeze, Juhu, Mumbai 400049",
    items: [
      {
        id: "prod-coin-04",
        name: "Lakshmi Auspicious 24K Gold Coin",
        category: "Coins",
        weight: 10.0,
        makingCharge: 120,
        quantity: 1,
        goldRateApplied: 7200,
        pricePerUnit: 73200, // (7200 * 10) + (120 * 10)
        totalPrice: 73200,
      }
    ],
    totalAmount: 73200,
    goldRateAtPurchase: 7200,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Credit Card / NetBanking",
    createdAt: new Date(2026, 5, 6, 12, 30, 0).toISOString(),
    trackingNumber: "FEDEX-SG-9923849",
  },
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "LOG-001",
    userId: "st-admin",
    userName: "Rajesh Sendra",
    userRole: "admin",
    action: "SYSTEM_INITIALIZED",
    details: "Sendra Gold ERP V1.0 initialized with 3 branches, 5 staff configuration and active catalogue.",
    timestamp: new Date(2026, 5, 1, 9, 0).toISOString(),
  },
  {
    id: "LOG-002",
    userId: "st-admin",
    userName: "Rajesh Sendra",
    userRole: "admin",
    action: "CATALOGUE_SYNC",
    details: "Imported 6 premium retail assets into online catalog.",
    timestamp: new Date(2026, 5, 1, 9, 15).toISOString(),
  },
];
