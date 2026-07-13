/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext";
import { Product, Branch, StaffUser, UserRole } from "../types";
import { decryptKYCData, maskSensitiveValue } from "../lib/encryption";
import {
  Sparkles,
  TrendingUp,
  LayoutDashboard,
  Coins,
  MapPin,
  Users,
  ShieldAlert,
  FileText,
  Download,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Filter,
  DollarSign,
  Briefcase,
  Search
} from "lucide-react";

export const AdminPortal: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    goldRates,
    updateGoldRates,
    branches,
    addBranch,
    updateBranchStatus,
    staffUsers,
    addStaffUser,
    updateStaffStatus,
    orders,
    tickets,
    auditLogs
  } = usePlatform();

  const [activeAdminTab, setActiveAdminTab] = useState<"dashboard" | "catalogue" | "rates" | "staff" | "branches" | "log">("dashboard");

  // Dynamic filter states
  const [logSearch, setLogSearch] = useState("");
  const [logActionFilter, setLogActionFilter] = useState("All");

  // Add Product form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProductObj, setEditProductObj] = useState<Product | null>(null);
  const [pName, setPName] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pWeight, setPWeight] = useState("");
  const [pMaking, setPMaking] = useState("");
  const [pCat, setPCat] = useState<"Jewellery" | "Coins" | "Bars">("Jewellery");
  const [pStock, setPStock] = useState("");
  const [pImage, setPImage] = useState("");

  // Rate form states (Sell and Buy manual adjustment overrides)
  const [manualSell24K, setManualSell24K] = useState(goldRates.sell24K.toString());
  const [manualBuy24K, setManualBuy24K] = useState(goldRates.buy24K.toString());

  // Add Staff form states
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [stName, setStName] = useState("");
  const [stEmail, setStEmail] = useState("");
  const [stRole, setStRole] = useState<UserRole>("executive");
  const [stBranchId, setStBranchId] = useState(branches[0]?.id || "");

  // Add Branch form states
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [brName, setBrName] = useState("");
  const [brCity, setBrCity] = useState("");
  const [brPhone, setBrPhone] = useState("");
  const [brAddress, setBrAddress] = useState("");

  const [decryptedKycState, setDecryptedKycState] = useState<{ [ticketId: string]: boolean }>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper: compute total buyback weight & payouts
  const totalBuybackSpent = tickets.filter(t => t.status === "completed").reduce((sum, t) => sum + t.payoutAmount, 0);
  const totalEcommerceSales = orders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + o.totalAmount, 0);

  // CSV generation exporters
  const handleExportCSV = (dataType: "catalogue" | "buyback" | "orders" | "audit") => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let fileName = "sendra_gold_export.csv";

    if (dataType === "catalogue") {
      headers = ["ID", "Name", "Category", "Weight (g)", "Making Charge/g", "Stock", "Status"];
      rows = products.map((p) => [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`,
        p.category,
        p.weight.toString(),
        p.makingCharge.toString(),
        p.stock.toString(),
        p.status,
      ]);
      fileName = "sendra_gold_catalogue.csv";
    } else if (dataType === "buyback") {
      headers = ["Ticket ID", "Customer Name", "Customer Phone", "Branch Name", "Date", "Purity", "Weight (g)", "Deductions (g)", "Payout Sum (INR)", "Status"];
      rows = tickets.map((t) => [
        t.id,
        `"${t.customerName.replace(/"/g, '""')}"`,
        t.customerPhone,
        `"${t.branchName}"`,
        t.appointmentDate,
        t.goldPurity,
        t.netWeight.toString(),
        t.deductions.toString(),
        t.payoutAmount.toString(),
        t.status,
      ]);
      fileName = "sendra_gold_buyback_ledger.csv";
    } else if (dataType === "orders") {
      headers = ["Order ID", "Customer Name", "Customer Email", "Shipping Address", "Total Amount (INR)", "Date", "Payment Status", "Tracking logistics"];
      rows = orders.map((o) => [
        o.id,
        `"${o.customerName.replace(/"/g, '""')}"`,
        o.customerEmail,
        `"${o.shippingAddress.replace(/"/g, '""')}"`,
        o.totalAmount.toString(),
        new Date(o.createdAt).toLocaleDateString(),
        o.paymentStatus,
        o.trackingNumber,
      ]);
      fileName = "sendra_gold_ecommerce_orders.csv";
    } else if (dataType === "audit") {
      headers = ["Log ID", "User ID", "User Name", "Role", "Action Type", "Details", "Timestamp"];
      rows = auditLogs.map((l) => [
        l.id,
        l.userId,
        `"${l.userName.replace(/"/g, '""')}"`,
        l.userRole,
        l.action,
        `"${l.details.replace(/"/g, '""')}"`,
        l.timestamp,
      ]);
      fileName = "sendra_gold_immutable_audit_trail.csv";
    }

    // Compose CSV Content
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Product Add/Edit Submit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pWeight || !pMaking || !pStock) return;

    const sampleImages = {
      Jewellery: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
      Coins: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=600",
      Bars: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=600"
    };

    const finalImage = pImage.trim() || sampleImages[pCat];

    if (editProductObj) {
      updateProduct({
        ...editProductObj,
        name: pName,
        description: pDesc,
        weight: parseFloat(pWeight),
        makingCharge: parseFloat(pMaking),
        category: pCat,
        stock: parseInt(pStock, 10),
        image: finalImage,
      });
      setEditProductObj(null);
    } else {
      addProduct({
        id: "prod-" + Math.floor(100 + Math.random() * 899),
        name: pName,
        description: pDesc,
        weight: parseFloat(pWeight),
        makingCharge: parseFloat(pMaking),
        category: pCat,
        stock: parseInt(pStock, 10),
        image: finalImage,
        status: "active",
      });
    }

    // Reset Form
    setPName("");
    setPDesc("");
    setPWeight("");
    setPMaking("");
    setPStock("");
    setPImage("");
    setShowProductForm(false);
  };

  // Populate Edit product form
  const handleStartEditProduct = (p: Product) => {
    setEditProductObj(p);
    setPName(p.name);
    setPDesc(p.description);
    setPWeight(p.weight.toString());
    setPMaking(p.makingCharge.toString());
    setPCat(p.category);
    setPStock(p.stock.toString());
    setPImage(p.image);
    setShowProductForm(true);
  };

  // Apply Live Rates Manual Override
  const handleRatesOverride = (e: React.FormEvent) => {
    e.preventDefault();
    const sellVal = parseInt(manualSell24K, 10);
    const buyVal = parseInt(manualBuy24K, 10);
    if (isNaN(sellVal) || isNaN(buyVal)) return;

    updateGoldRates({
      sell24K: sellVal,
      buy24K: buyVal,
      isOverride: true,
    });
  };

  const handleClearOverride = () => {
    updateGoldRates({
      isOverride: false, // resume random ticker fluctuation calculation
    });
  };

  // Create staff account
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stName || !stEmail) return;

    addStaffUser({
      id: "st-" + Math.floor(100 + Math.random() * 899),
      name: stName,
      email: stEmail,
      role: stRole,
      branchId: stRole === "admin" ? undefined : stBranchId,
      status: "active",
    });

    setStName("");
    setStEmail("");
    setShowStaffForm(false);
  };

  // Create branch showroom
  const handleAddBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brName || !brCity || !brPhone) return;

    addBranch({
      id: "br-" + brName.toLowerCase().replace(/\s+/g, "-"),
      name: brName,
      city: brCity,
      phone: brPhone,
      address: brAddress,
      status: "active",
    });

    setBrName("");
    setBrCity("");
    setBrPhone("");
    setBrAddress("");
    setShowBranchForm(false);
  };

  // Filtering Audit logs dynamically
  const filteredAuditLogs = auditLogs.filter((l) => {
    const matchesAction = logActionFilter === "All" || l.action === logActionFilter;
    const matchesKeyword =
      l.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.userName.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.action.toLowerCase().includes(logSearch.toLowerCase());
    return matchesAction && matchesKeyword;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans">
      
      {/* 1. Super Admin Navigation Sidebars */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto bg-white p-1 rounded-xl shadow-sm gap-1.5 scroll-hide">
        {[
          { id: "dashboard", label: "Dashboard Hub", icon: LayoutDashboard },
          { id: "catalogue", label: "Ecomm Catalogue Mode", icon: Coins },
          { id: "rates", label: "Live Gold Market Quotes", icon: TrendingUp },
          { id: "staff", label: "Staff Role control", icon: Users },
          { id: "branches", label: "Showroom Branches Admin", icon: MapPin },
          { id: "log", label: "Immutable Security Audit Log", icon: ShieldAlert }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-4.5 py-3.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap flex-1 justify-center ${
                activeAdminTab === tab.id
                  ? "bg-slate-900 text-amber-400 shadow-md border-b border-amber-500"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================== TAB 1: MASTER DASHBOARD ANALYTICS ===================== */}
      {activeAdminTab === "dashboard" && (
        <div className="space-y-6">
          {/* Master Visual Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">ECOMMERCE INCOMING SALES</span>
              <div className="text-2xl font-black text-slate-800 font-mono mt-1.5">{formatCurrency(totalEcommerceSales)}</div>
              <p className="text-[10.5px] text-emerald-600 mt-2 font-semibold">Ordered B2C retail gold coins &amp; jewelry</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">BUYBACK DISBURSED OUTFLOWS</span>
              <div className="text-2xl font-black text-slate-800 font-mono mt-1.5">{formatCurrency(totalBuybackSpent)}</div>
              <p className="text-[10.5px] text-purple-600 mt-2 font-semibold">Total settled client-purchased gold reserves</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">ACTIVE REGISTERED SHOWROOMS</span>
              <div className="text-2xl font-black text-slate-800 font-mono mt-1.5">
                {branches.filter((b) => b.status === "active").length} <span className="text-sm text-slate-400">Branches</span>
              </div>
              <p className="text-[10.5px] text-indigo-600 mt-2 font-semibold">Mumbai, Delhi, and Bengaluru flags status active</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm bg-gradient-to-tr from-slate-900 to-slate-800 text-white">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">CURRENT 24K LIQUID MARKET RATE</span>
              <div className="text-2xl font-black text-amber-300 font-mono mt-1.5">{formatCurrency(goldRates.sell24K)}<span className="text-xs text-white/50">/g</span></div>
              <p className="text-[10px] text-slate-300 mt-2 font-mono truncate">
                Last quote refresh: {new Date(goldRates.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Unified Branch buybacks transactions view with Decrypt logs */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-xs">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Unified Master Buybacks &amp; KYC Register</h3>
                  <p className="text-[10.5px] text-slate-400">Centralized view across all physical showrooms. Manage approval archives and kyc rest encryption.</p>
                </div>
                <button
                  onClick={() => handleExportCSV("buyback")}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV Ledger</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[350px]">
                {tickets.map((t) => (
                  <div key={t.id} className="p-4 flex justify-between items-center gap-4 hover:bg-slate-50/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-slate-900 text-xs">{t.id}</span>
                        <span className="bg-slate-100 text-slate-500 border px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold uppercase">
                          {t.branchName.split(" ")[0]} Branch
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800">Cust Name: {t.customerName}</div>
                      
                      {/* Decryption tester in Super admin */}
                      {t.kycDocs?.aadhaarNumber && (
                        <div className="mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200 text-[10px] text-slate-505 space-y-1 max-w-sm">
                          <div>
                            Aadhaar: <span className="font-mono font-bold">
                              {decryptedKycState[t.id] ? t.kycDocs.aadhaarNumber : maskSensitiveValue(t.kycDocs.aadhaarNumber, 4)}
                            </span>
                          </div>
                          <div>
                            Attachment Base64: <span className="font-mono text-slate-400 truncate block max-w-xs text-[9px]">
                              {decryptedKycState[t.id] ? decryptKYCData(t.kycDocs.aadhaarUrl || "") : "[ENCRYPTED_REST_AES255] Secured at rest"}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const decVal = decryptedKycState[t.id];
                              setDecryptedKycState({
                                ...decryptedKycState,
                                [t.id]: !decVal
                              });
                            }}
                            className="text-[9px] font-extrabold text-amber-600 uppercase flex items-center gap-0.5 pt-0.5"
                          >
                            {decryptedKycState[t.id] ? (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Re-mask Attachment</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Administrative Decrypt</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-black text-slate-800 font-mono">{formatCurrency(t.payoutAmount)}</div>
                      <span className="text-[10px] font-mono font-semibold text-slate-400 block">{t.goldPurity} Assayed weight ({t.netWeight}g)</span>
                      <div className="text-[9.5px] font-bold text-emerald-600 block pt-0.5">{t.status.replace("_", " ").toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unified Ecommerce B2C Orders ledger */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-xs">
              <div className="p-4 border-b border-slate-105 bg-slate-50 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Unified B2C Retail Orders Register</h3>
                  <p className="text-[10.5px] text-slate-400">Total consumer ecomm checkout orders ledger across all shipping nodes.</p>
                </div>
                <button
                  onClick={() => handleExportCSV("orders")}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV Orders</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[350px]">
                {orders.map((o) => (
                  <div key={o.id} className="p-4 flex justify-between items-center gap-4 hover:bg-slate-50/50">
                    <div className="space-y-1">
                      <span className="font-mono font-black text-slate-900 text-xs">{o.id}</span>
                      <div className="font-semibold text-slate-800">{o.customerName}</div>
                      <div className="text-[10px] text-slate-400">{o.shippingAddress}</div>
                      <div className="text-[10.5px] font-mono text-slate-500">Items: {o.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-black text-slate-800 font-mono">{formatCurrency(o.totalAmount)}</div>
                      <span className="text-[9.5px] font-mono font-bold text-sky-600 bg-sky-50 px-1.5 py-0.2 border border-sky-100 rounded">
                        {o.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Showroom visual distribution performance tables */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-xs">
            <h3 className="font-extrabold text-slate-900 text-sm mb-3">Branch Showrooms Distribution Summary</h3>
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold font-sans">
                  <th className="p-3">SHOWROOM SITE</th>
                  <th className="p-3">CITY NODE</th>
                  <th className="p-3 text-right">TOTAL COMPLETED BUYBACKS</th>
                  <th className="p-3 text-right">TOTAL PAYOUT OUTFLOW</th>
                  <th className="p-3 text-right">BRANCH STATUS</th>
                </tr>
              </thead>
              <tbody>
                {branches.map(b => {
                  const branchCompletedCount = tickets.filter(t => t.branchId === b.id && t.status === "completed").length;
                  const branchPayoutOutflow = tickets.filter(t => t.branchId === b.id && t.status === "completed").reduce((sum, t) => sum + t.payoutAmount, 0);
                  
                  return (
                    <tr key={b.id} className="border-b border-slate-100 text-slate-705 font-medium hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-bold font-sans">{b.name}</td>
                      <td className="p-3 font-sans text-slate-400">{b.city}</td>
                      <td className="p-3 text-right">{branchCompletedCount}</td>
                      <td className="p-3 text-right font-bold text-rose-500">{formatCurrency(branchPayoutOutflow)}</td>
                      <td className="p-3 text-right font-semibold font-sans">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${b.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: PRODUCT CATALOGUE MANAGEMENT ===================== */}
      {activeAdminTab === "catalogue" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 flex-wrap gap-2 text-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Online B2C Product Catalogue Config</h3>
              <p className="text-slate-400 text-[10.5px]">Configure physical assets listed in our customer storefront. Update stock, weight and raw making costs instantly.</p>
            </div>
            
            <button
              onClick={() => {
                setEditProductObj(null);
                setPName("");
                setPDesc("");
                setPWeight("");
                setPMaking("");
                setPStock("");
                setPImage("");
                setShowProductForm(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow select-none"
            >
              <PlusCircle className="w-4 h-4 text-amber-500" />
              <span>Add New Retail Product</span>
            </button>
          </div>

          {/* Product form toggle drawer */}
          {showProductForm && (
            <form onSubmit={handleProductSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg max-w-xl space-y-4 text-xs">
              <h4 className="font-black text-slate-900 text-sm border-b pb-2">
                {editProductObj ? "Edit Ecomm Product" : "Create New Gold Asset Catalog Entry"}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24K Lord Lakshmi Coin"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Category Standard *</label>
                  <select
                    value={pCat}
                    onChange={(e) => setPCat(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Jewellery">Jewellery (22K Standard)</option>
                    <option value="Coins">Coins (24K Standard)</option>
                    <option value="Bars">Bars (24K Standard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Retail marketing catalog copy details..."
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Weight (Grams) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 10.0"
                    value={pWeight}
                    onChange={(e) => setPWeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Making Cost (Per Gram) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 200"
                    value={pMaking}
                    onChange={(e) => setPMaking(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Starting Stock Qty *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10"
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Custom Asset Image (Unsplash URL or blank for auto-sample)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold px-5 py-2 rounded-lg"
                >
                  {editProductObj ? "Apply Product Edits" : "Create Product Asset"}
                </button>
              </div>
            </form>
          )}

          {/* Catalog Listing Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase text-[9.5px]">
                  <th className="p-3">Asset</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Standard Weight</th>
                  <th className="p-3 text-right">Making charge /g</th>
                  <th className="p-3 text-right">Raw Stock</th>
                  <th className="p-3 text-right">Dynamic Selling Prc</th>
                  <th className="p-3 text-right">Action Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const karat = p.id === "prod-rng-03" ? "18K" : p.category === "Coins" || p.category === "Bars" ? "24K" : "22K";
                  const ratePerGram = karat === "24K" ? goldRates.sell24K : karat === "22K" ? goldRates.sell22K : goldRates.sell18K;
                  
                  // calculated dynamically:
                  const currentPrice = Math.round((p.weight * ratePerGram) + (p.weight * p.makingCharge));

                  return (
                    <tr key={p.id} className={`hover:bg-slate-50/50 ${p.status === "inactive" ? "opacity-45 bg-slate-50" : ""}`}>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img src={p.image} className="w-9 h-9 object-cover rounded border" />
                          <div>
                            <span className="font-extrabold text-slate-900 block leading-tight">{p.name}</span>
                            <span className="text-[9.5px] text-slate-400 font-mono italic">Karat: {karat} &bull; ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-500">{p.category}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-800">{p.weight.toFixed(2)}g</td>
                      <td className="p-3 text-right font-mono text-slate-500">{formatCurrency(p.makingCharge)}</td>
                      <td className="p-3 text-right font-mono text-slate-500">{p.stock} items</td>
                      <td className="p-3 text-right font-mono font-black text-amber-600 font-bold">{formatCurrency(currentPrice)}</td>
                      <td className="p-3 text-right shrink-0">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEditProduct(p)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          
                          {p.status === "active" && (
                            <button
                              onClick={() => {
                                deleteProduct(p.id);
                              }}
                              className="bg-rose-50 text-rose-600 hover:bg-rose-100 p-1.5 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: LIVE RATES MANUAL OVERRIDES ===================== */}
      {activeAdminTab === "rates" && (
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-xs">
            <div className="bg-slate-900 text-white p-5">
              <TrendingUp className="w-8 h-8 text-amber-400 mb-2" />
              <h3 className="text-md font-extrabold">Set manual gold rate overrides</h3>
              <p className="text-slate-400 text-[11px] leading-tight mt-0.5">
                Bypass automatic fluctuates for direct control. The buy/sell values for smaller karats (22K, 18K) are recalculated instantly based on these benchmarks.
              </p>
            </div>

            <form onSubmit={handleRatesOverride} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">24K Sell Gold rate (INR per Gram) *</label>
                  <input
                    type="number"
                    required
                    value={manualSell24K}
                    onChange={(e) => setManualSell24K(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">24K Buy gold rate (INR per Gram) *</label>
                  <input
                    type="number"
                    required
                    value={manualBuy24K}
                    onChange={(e) => setManualBuy24K(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {goldRates.isOverride && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl flex items-center gap-1.5 font-semibold">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Manual Overrides active. Automatic fluctuation countdown is currently frozen.</span>
                </div>
              )}

              <div className="pt-2 flex gap-2 justify-end">
                {goldRates.isOverride && (
                  <button
                    type="button"
                    onClick={handleClearOverride}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-all"
                  >
                    Release Override &amp; Resume Ticker
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold px-5 py-2.5 rounded-xl shadow"
                >
                  Apply Gold Rate Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: STAFF CONTROLS ===================== */}
      {activeAdminTab === "staff" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 flex-wrap gap-2 text-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Staff role-based access controllers</h3>
              <p className="text-slate-400 text-[10.5px]">Configure identities representing desk Executives or Showroom Branch Chiefs. All approvals depend on assigned role tags.</p>
            </div>

            <button
              onClick={() => {
                setStName("");
                setStEmail("");
                setShowStaffForm(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow select-none"
            >
              <PlusCircle className="w-4 h-4 text-amber-500" />
              <span>Create Staff User</span>
            </button>
          </div>

          {/* Create Staff Form */}
          {showStaffForm && (
            <form onSubmit={handleAddStaffSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg max-w-sm space-y-4 text-xs">
              <h4 className="font-black text-slate-900 text-sm border-b pb-2">Add New Showroom Identity</h4>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Full Staff Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe (Mumbai)"
                    value={stName}
                    onChange={(e) => setStName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Corporate Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@sendragold.com"
                    value={stEmail}
                    onChange={(e) => setStEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Role Tag *</label>
                    <select
                      value={stRole}
                      onChange={(e) => setStRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="executive">Counter Executive</option>
                      <option value="manager">Branch Manager</option>
                      <option value="admin">Global Admin</option>
                    </select>
                  </div>

                  {stRole !== "admin" && (
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Assign Showroom *</label>
                      <select
                        value={stBranchId}
                        onChange={(e) => setStBranchId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      >
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.name.split(" ")[0]} ({b.city})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowStaffForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold px-5 py-2 rounded-lg"
                >
                  Register User
                </button>
              </div>
            </form>
          )}

          {/* Staff registry listing */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase text-[9.5px]">
                  <th className="p-3">Staff Identity</th>
                  <th className="p-3">Corporate Contact</th>
                  <th className="p-3">Role Authority</th>
                  <th className="p-3">Assigned Working Node</th>
                  <th className="p-3 text-right">Status control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffUsers.map((su) => {
                  const bName = branches.find(b => b.id === su.branchId)?.name || "Central Corporate Headquarters";
                  return (
                    <tr key={su.id} className={su.status === "inactive" ? "opacity-45 bg-slate-50" : ""}>
                      <td className="p-3 font-extrabold text-slate-900">{su.name}</td>
                      <td className="p-3 font-mono font-bold text-slate-500">{su.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          su.role === "admin" ? "bg-slate-900 text-amber-400 border border-slate-800" :
                          su.role === "manager" ? "bg-purple-100 text-purple-800" : "bg-sky-100 text-sky-800"
                        }`}>
                          {su.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-600">{bName}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            const toggled = su.status === "active" ? "inactive" : "active";
                            updateStaffStatus(su.id, toggled);
                          }}
                          className="text-slate-400 hover:text-amber-500 p-1"
                        >
                          {su.status === "active" ? (
                            <ToggleRight className="w-7 h-7 text-emerald-500" />
                          ) : (
                            <ToggleLeft className="w-7 h-7 text-slate-300" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 5: BRANCHES CONFIGURATION ===================== */}
      {activeAdminTab === "branches" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 flex-wrap gap-2 text-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Showroom branches configuration</h3>
              <p className="text-slate-400 text-[10.5px]">Manage active retail showroom outlets participating in gold buyback program.</p>
            </div>

            <button
              onClick={() => {
                setBrName("");
                setBrCity("");
                setBrPhone("");
                setBrAddress("");
                setShowBranchForm(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow select-none"
            >
              <PlusCircle className="w-4 h-4 text-amber-500" />
              <span>Create Retail Branch</span>
            </button>
          </div>

          {/* Add Branch Form */}
          {showBranchForm && (
            <form onSubmit={handleAddBranchSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg max-w-sm space-y-4 text-xs">
              <h4 className="font-black text-slate-900 text-sm border-b pb-2">Create New Branch Site</h4>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Showroom Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune Camp Office"
                    value={brName}
                    onChange={(e) => setBrName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Showroom City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune"
                      value={brCity}
                      onChange={(e) => setBrCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Showroom Phone contact *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 ...."
                      value={brPhone}
                      onChange={(e) => setBrPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Full Physical Postal Address</label>
                  <textarea
                    rows={2}
                    placeholder="Turner Road..."
                    value={brAddress}
                    onChange={(e) => setBrAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowBranchForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold px-5 py-2 rounded-lg"
                >
                  Provision Branch
                </button>
              </div>
            </form>
          )}

          {/* Branch table list */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase text-[9.5px]">
                  <th className="p-3">Showroom Outlet</th>
                  <th className="p-3">City Node</th>
                  <th className="p-3">Contact Phone</th>
                  <th className="p-3 font-sans">Full Mailing Address</th>
                  <th className="p-3 text-right">Status control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {branches.map((b) => (
                  <tr key={b.id} className={b.status === "inactive" ? "opacity-35 bg-slate-50" : ""}>
                    <td className="p-3 font-extrabold text-slate-905">{b.name}</td>
                    <td className="p-3 font-bold text-slate-500">{b.city}</td>
                    <td className="p-3 font-mono text-slate-500">{b.phone}</td>
                    <td className="p-3 font-semibold text-slate-500">{b.address}</td>
                    <td className="p-3 text-right border-l-0">
                      <button
                        onClick={() => {
                          const status = b.status === "active" ? "inactive" : "active";
                          updateBranchStatus(b.id, status);
                        }}
                        className="text-slate-400 hover:text-amber-500 p-1"
                      >
                        {b.status === "active" ? (
                          <ToggleRight className="w-7 h-7 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="w-7 h-7 text-slate-300" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 6: IMMUTABLE SECURITY AUDIT LOG TRAIL ===================== */}
      {activeAdminTab === "log" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white p-4.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Immutable security audit logs trail</h3>
              <p className="text-slate-400 text-[10.5px]">Read-only micro-events captured securely. Uniquely logs customer actions, staff overrides, rates changes, and manager decisions.</p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleExportCSV("audit")}
                className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow select-none w-full sm:w-auto"
              >
                <Download className="w-3.5 h-3.5 text-amber-500" />
                <span>Download Compliance CSV</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-xs">
            {/* Filter Logs bar */}
            <div className="p-4 bg-slate-50/50 border-b border-slate-200.5 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Keyword search logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex bg-white rounded-xl border border-slate-200 p-1 shrink-0 text-slate-500">
                {["All", "RATES_UPDATE", "TICKET_APPROVED", "ECOMMERCE_CHECKOUT", "OFFLINE_SYNC"].map((actionType) => (
                  <button
                    key={actionType}
                    onClick={() => setLogActionFilter(actionType)}
                    className={`px-3 py-1 rounded text-[10.5px] font-bold uppercase tracking-wide transition-all ${
                      logActionFilter === actionType
                        ? "bg-slate-900 text-amber-400 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {actionType.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Logs Timeline */}
            <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto font-mono text-[11px] bg-slate-950 text-slate-300 p-4">
              {filteredAuditLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-sans">
                  No audit logs found matching your filter parameters.
                </div>
              ) : (
                filteredAuditLogs.map((l) => (
                  <div key={l.id} className="py-2.5 flex flex-col sm:flex-row justify-between gap-1 hover:bg-white/5 px-2.5 rounded">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-amber-400 font-extrabold text-[10px] bg-amber-500/10 px-1 rounded">{l.id}</span>
                        <span className="text-purple-400 font-black">[{l.action}]</span>
                        <span className="text-slate-400">
                          By <span className="text-white hover:underline cursor-pointer">{l.userName}</span> ({l.userRole.toUpperCase()})
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans font-medium text-[11px] mt-1 leading-normal">
                        {l.details}
                      </p>
                    </div>

                    <div className="text-right sm:text-right text-slate-500 text-[10px] shrink-0 font-sans font-semibold pt-1">
                      {new Date(l.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const AlertCircleIcon = () => (
  <svg className="w-4 h-4 text-amber-600 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
