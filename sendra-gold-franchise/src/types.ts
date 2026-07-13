/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "customer" | "executive" | "manager" | "admin";

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  status: "active" | "inactive";
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string; // Optional for admin/customer, mandatory for executive/manager
  status: "active" | "inactive";
}

export interface GoldRates {
  sell24K: number; // rate per gram
  buy24K: number;  // rate per gram
  sell22K: number;
  buy22K: number;
  sell18K: number;
  buy18K: number;
  lastUpdated: string;
  isOverride: boolean;
}

export type ProductCategory = "Jewellery" | "Coins" | "Bars";

export interface Product {
  id: string;
  name: string;
  description: string;
  weight: number; // in grams
  makingCharge: number; // fixed charge per gram
  category: ProductCategory;
  image: string;
  stock: number;
  status: "active" | "inactive";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  category: string;
  weight: number;
  makingCharge: number;
  quantity: number;
  goldRateApplied: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  goldRateAtPurchase: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "unpaid";
  paymentMethod: string;
  createdAt: string;
  trackingNumber: string;
}

export interface KYCDocuments {
  aadhaarNumber?: string;
  aadhaarUrl?: string; // Mock Base64 or local blob URL
  panNumber?: string;
  panUrl?: string;
  customerPhotoUrl?: string;
  encrypted: boolean;
  encryptedAt?: string;
}

export interface BuybackTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  customerId?: string; // Empty for walk-ins
  branchId: string;
  branchName: string;
  appointmentDate: string;
  appointmentTime: string;
  kycDocs: KYCDocuments;
  goldPurity: "24K" | "22K" | "18K";
  netWeight: number; // Grams
  deductions: number; // % or weight deduction, let's say weight deduction in grams
  deductionNotes: string;
  liveBuybackRateApplied: number;
  payoutAmount: number;
  status: "appointment_booked" | "kyc_pending" | "testing_pending" | "approval_pending" | "approved" | "rejected" | "completed";
  notes?: string;
  rejectionReason?: string;
  executiveId?: string;
  executiveName?: string;
  managerId?: string;
  managerName?: string;
  createdAt: string;
  updatedAt: string;
  invoiceGenerated: boolean;
  invoiceUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}
