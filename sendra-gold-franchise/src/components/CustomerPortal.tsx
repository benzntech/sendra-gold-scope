/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext";
import { Product, CartItem } from "../types";
import {
  ShoppingBag,
  Sparkles,
  Calendar,
  Layers,
  Heart,
  Search,
  ShoppingCart,
  ArrowRight,
  Inbox,
  User,
  Clock,
  CheckCircle,
  FileText,
  Upload,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Check,
  AlertCircle,
  TrendingDown,
  Trash2,
  X
} from "lucide-react";

export const CustomerPortal: React.FC = () => {
  const {
    products,
    goldRates,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    wishlist,
    toggleWishlist,
    orders,
    createOrder,
    branches,
    tickets,
    bookAppointment,
    logAction
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<"store" | "sell" | "tracker" | "orders">("store");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Wishlist and Cart details
  const [showCartModal, setShowCartModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"review" | "shipping" | "payment" | "success">("review");

  // Cart customer details
  const [custName, setCustName] = useState("vjtechspot");
  const [custEmail, setCustEmail] = useState("vjtechspot@gmail.com");
  const [custPhone, setCustPhone] = useState("+91 91234 56789");
  const [custAddress, setCustAddress] = useState("Flat 402, Sea Breeze, Juhu, Mumbai 400049");
  const [paymentCard, setPaymentCard] = useState("4321 0098 7654 3210");
  const [paymentExpiry, setPaymentExpiry] = useState("09/29");
  const [paymentCvv, setPaymentCvv] = useState("991");
  const [latestCreatedOrder, setLatestCreatedOrder] = useState<any>(null);

  // Appointment states
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || "");
  const [appointmentDate, setAppointmentDate] = useState("2026-06-15");
  const [appointmentTime, setAppointmentTime] = useState("11:00 AM");
  const [customerSellName, setCustomerSellName] = useState("Aditya Sen");
  const [customerSellPhone, setCustomerSellPhone] = useState("+91 98888 77777");
  const [aadhaarNum, setAadhaarNum] = useState("");
  const [panNum, setPanNum] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState<string>("");
  const [panFile, setPanFile] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<string>("");
  const [purityExpectation, setPurityExpectation] = useState<"24K" | "22K" | "18K">("22K");
  const [weightExpectation, setWeightExpectation] = useState("");
  const [appointmentSuccessTicket, setAppointmentSuccessTicket] = useState<any>(null);

  // Helper: determine purity/karats for product
  const getProductKarat = (p: Product): "24K" | "22K" | "18K" => {
    if (p.id === "prod-rng-03") return "18K";
    if (p.category === "Coins" || p.category === "Bars") return "24K";
    return "22K";
  };

  // Helper: calculate live price of product based on weight, live rate, and making charges per gram
  const calculateProductPrice = (p: Product): number => {
    const karat = getProductKarat(p);
    let ratePerGram = goldRates.sell24K;
    if (karat === "22K") ratePerGram = goldRates.sell22K;
    if (karat === "18K") ratePerGram = goldRates.sell18K;

    const baseCost = p.weight * ratePerGram;
    const makingCost = p.weight * p.makingCharge;
    return Math.round(baseCost + makingCost);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Drag and Drop simulation base64 uploaders
  const handleDummyUpload = (fileType: "aadhaar" | "pan" | "photo") => {
    const mockFiles = {
      aadhaar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==[MOCK_AADHAAR_DOC]",
      pan: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==[MOCK_PAN_DOC]",
      photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==[MOCK_CUSTOMER_LIVE_PHOTO]"
    };

    if (fileType === "aadhaar") {
      setAadhaarFile(mockFiles.aadhaar);
    } else if (fileType === "pan") {
      setPanFile(mockFiles.pan);
    } else {
      setPhotoFile(mockFiles.photo);
    }
    logAction("KYC_PRE_UPLOAD", `Customer pre-uploaded simulated document binary for ${fileType.toUpperCase()}`);
  };

  // Booking submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerSellName || !customerSellPhone || !selectedBranchId) {
      alert("Please enter Name, Phone, and select a Branch.");
      return;
    }

    const branch = branches.find((b) => b.id === selectedBranchId);
    
    // Create new ticket
    const ticket = bookAppointment({
      customerName: customerSellName,
      customerPhone: customerSellPhone,
      customerId: "cust-demo", // Simulated active login
      branchId: selectedBranchId,
      branchName: branch?.name || "Selected Branch",
      appointmentDate,
      appointmentTime,
      kycDocs: {
        aadhaarNumber: aadhaarNum || undefined,
        aadhaarUrl: aadhaarFile || undefined,
        panNumber: panNum || undefined,
        panUrl: panFile || undefined,
        customerPhotoUrl: photoFile || undefined,
        encrypted: !!(aadhaarFile || panFile || photoFile),
      },
      goldPurity: purityExpectation,
      netWeight: parseFloat(weightExpectation) || 0,
      deductions: 0,
      deductionNotes: "",
      liveBuybackRateApplied: purityExpectation === "24K" ? goldRates.buy24K : purityExpectation === "22K" ? goldRates.buy22K : goldRates.buy18K,
      payoutAmount: 0, // calculated later during staff check
      notes: "Pre-booked online appointment. Expected weight: " + (weightExpectation || "not defined") + "g.",
      invoiceGenerated: false
    });

    setAppointmentSuccessTicket(ticket);
    // Reset form
    setAadhaarNum("");
    setPanNum("");
    setAadhaarFile("");
    setPanFile("");
    setPhotoFile("");
    setWeightExpectation("");
  };

  // Checkout order submit
  const handleCheckoutSubmit = () => {
    const orderItems = cart.map((item) => {
      const p = item.product;
      const unitKarat = getProductKarat(p);
      const appliedRate = unitKarat === "24K" ? goldRates.sell24K : unitKarat === "22K" ? goldRates.sell22K : goldRates.sell18K;
      const priceUnit = calculateProductPrice(p);

      return {
        id: p.id,
        name: p.name,
        category: p.category,
        weight: p.weight,
        makingCharge: p.makingCharge,
        quantity: item.quantity,
        goldRateApplied: appliedRate,
        pricePerUnit: priceUnit,
        totalPrice: priceUnit * item.quantity,
      };
    });

    const totalCartSum = orderItems.reduce((acc, curr) => acc + curr.totalPrice, 0);

    const order = createOrder({
      customerId: "cust-demo",
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: custPhone,
      shippingAddress: custAddress,
      items: orderItems,
      totalAmount: totalCartSum,
      paymentMethod: "Credit Card (Simulated Payment)",
    });

    setLatestCreatedOrder(order);
    setCheckoutStep("success");
  };

  const filteredProducts = products.filter((p) => {
    if (p.status === "inactive") return false;
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalAmount = cart.reduce((sum, item) => sum + (calculateProductPrice(item.product) * item.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* 1. Mobile-friendly App Navigation Rails */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto scrolls-hide bg-white p-1 rounded-xl shadow-sm gap-2">
        {[
          { id: "store", label: "Buy New Gold", icon: ShoppingBag, desc: "B2C Catalogue" },
          { id: "sell", label: "Sell Old Gold", icon: Calendar, desc: "Book Showroom Sell" },
          { id: "tracker", label: "Track Buyback", icon: Clock, desc: "Live Approval Tracker" },
          { id: "orders", label: "My Order History", icon: FileText, desc: "Purchase Invoice Archive" }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as any);
                setAppointmentSuccessTicket(null);
                setLatestCreatedOrder(null);
              }}
              className={`flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center md:justify-start ${
                activeTab === t.id
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="text-left hidden md:block">
                <div className="leading-tight font-bold">{t.label}</div>
                <div className="text-[10px] opacity-75 font-normal">{t.desc}</div>
              </div>
              <span className="md:hidden font-bold">{t.label.split(" ")[1]}</span>
              
              {t.id === "store" && cart.length > 0 && (
                <span className="bg-rose-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================= TAB 1: NEW GOLD ECOMMERCE STOREFRONT ======================= */}
      {activeTab === "store" && (
        <div>
          {/* Main Hero & Store Filters */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white mb-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-yellow-400/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="relative z-10 max-w-2xl">
              <span className="bg-amber-400/15 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-amber-400/30">
                Purity Guaranteed
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-white">
                Purchase Authentic Gold Assets On-demand
              </h1>
              <p className="text-slate-300 text-sm md:text-base mt-2">
                All prices are calculated dynamically using the current live gold market rate. Standard making charge added transparently. No hidden premiums.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 relative z-10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pure jewellery, bullion coins, gold casting bars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-400 placeholder:text-slate-500 text-amber-100"
                />
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-sm shrink-0">
                {["All", "Jewellery", "Coins", "Bars"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* View Cart Pill (Floating on mobile, inline on desktop) */}
              <button
                onClick={() => {
                  setCheckoutStep("review");
                  setShowCartModal(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>My Cart ({cart.length})</span>
                <span className="font-mono bg-slate-950 text-white text-xs px-2 py-0.5 rounded font-extrabold ml-1">
                  {formatCurrency(cartTotalAmount)}
                </span>
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-semibold mb-1">No gold assets match your query</p>
              <p className="text-xs text-slate-400">Try tweaking your keyword search or category filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const finalPrice = calculateProductPrice(p);
                const isWished = wishlist.includes(p.id);
                const karat = getProductKarat(p);
                const ratePerGram = karat === "24K" ? goldRates.sell24K : karat === "22K" ? goldRates.sell22K : goldRates.sell18K;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    {/* Image Area */}
                    <div className="relative h-56 bg-slate-100 overflow-hidden shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // fallback if unsplash fails
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      {/* Badge / Overlay */}
                      <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-amber-400/20">
                        {karat} Pure Gold
                      </span>

                      {/* Wishlist button */}
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all border ${
                          isWished
                            ? "bg-rose-500 border-rose-400 text-white"
                            : "bg-slate-950/55 border-white/20 text-white hover:bg-white hover:text-rose-500"
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Metadata */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] text-amber-600 font-extrabold uppercase tracking-widest">{p.category}</div>
                        <h3 className="font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors mt-0.5 line-clamp-1">
                          {p.name}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 h-8 leading-relaxed">
                          {p.description}
                        </p>

                        {/* Gold Specific Breakdowns */}
                        <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11px] text-slate-500">
                          <div>
                            <span className="text-slate-400">Asset Weight:</span>{" "}
                            <span className="font-bold text-slate-800">{p.weight.toFixed(2)}g</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Making Chg:</span>{" "}
                            <span className="font-bold text-slate-800">{formatCurrency(p.makingCharge)}/g</span>
                          </div>
                        </div>

                        {/* Interactive dynamic price calculation guide */}
                        <div className="mt-2.5 px-1 flex text-[9.5px] text-slate-400 font-mono items-center gap-1">
                          <TrendingDown className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>
                            ({p.weight}g &times; ₹{ratePerGram}) + ({p.weight}g &times; ₹{p.makingCharge})
                          </span>
                        </div>
                      </div>

                      {/* Price Action Footer */}
                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
                        <div>
                          <div className="text-[9.5px] uppercase font-bold text-slate-400 leading-none">TODAY'S VALUE</div>
                          <div className="text-xl font-black text-slate-900 font-mono mt-1">
                            {formatCurrency(finalPrice)}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            addToCart(p);
                            logAction("ECOMMERCE_CART_ADD", `Added Product ${p.id} ("${p.name}") to online order cart.`);
                          }}
                          className="bg-slate-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all flex items-center gap-1.5"
                        >
                          <span>Add to Cart</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================= TAB 2: OLD GOLD SELL REQUEST (BOOK APPOINTMENT) ======================= */}
      {activeTab === "sell" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Form Banner */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 text-white text-center">
              <Sparkles className="w-10 h-10 mx-auto mb-2 text-amber-200" />
              <h2 className="text-2xl font-black tracking-tight">Sell Old Gold / Scrap Directly to Showroom</h2>
              <p className="text-xs text-amber-100/90 max-w-xl mx-auto mt-1">
                Book a slot at your closest branch. We evaluate purity in person using top-tier density spectrometers and pay you instantly on today's live wholesale buyback quotes.
              </p>
            </div>

            {appointmentSuccessTicket ? (
              /* Booking Success Module */
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Appointment Booked Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">Please note your permanent showroom tracking ticket number:</p>
                
                <div className="my-6 inline-block bg-slate-900 text-amber-400 font-mono text-2xl font-black py-3.5 px-8 rounded-2xl border border-amber-400/30 tracking-widest shadow-inner">
                  {appointmentSuccessTicket.id}
                </div>

                <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl text-left text-xs text-slate-600 leading-relaxed border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Appointment Details:</div>
                  <div className="grid grid-cols-2 gap-1 font-mono">
                    <div>Branch:</div> <div className="font-semibold text-slate-800">{appointmentSuccessTicket.branchName}</div>
                    <div>Date/Time:</div> <div className="font-semibold text-slate-800">{appointmentSuccessTicket.appointmentDate} at {appointmentSuccessTicket.appointmentTime}</div>
                    <div>Customer Name:</div> <div className="font-semibold text-slate-800">{appointmentSuccessTicket.customerName}</div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTab("tracker")}
                    className="bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5 rounded-xl font-bold text-xs transition-all"
                  >
                    Track Status and Approval Queue
                  </button>
                  <button
                    onClick={() => setAppointmentSuccessTicket(null)}
                    className="bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-amber-400 transition-all"
                  >
                    Book Another Slot
                  </button>
                </div>
              </div>
            ) : (
              /* Active booking form */
              <form onSubmit={handleBookingSubmit} className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Branch selector */}
                  <div>
                    <label className="block text-xs text-slate-500 font-bold uppercase mb-1.5">Select Gold Showroom Branch *</label>
                    <select
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                    >
                      {branches
                        .filter((b) => b.status === "active")
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.city})
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Appt Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 font-bold uppercase mb-1.5">Date *</label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 font-bold uppercase mb-1.5">Time Slot *</label>
                      <select
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                      >
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="02:30 PM">02:30 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="05:30 PM">05:30 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div>
                    <label className="block text-xs text-slate-500 font-bold uppercase mb-1.5">Full Customer Name *</label>
                    <input
                      type="text"
                      placeholder="Enter legal name"
                      value={customerSellName}
                      onChange={(e) => setCustomerSellName(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 font-bold uppercase mb-1.5">Mobile Contact *</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 99999 55555"
                      value={customerSellPhone}
                      onChange={(e) => setCustomerSellPhone(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 my-6"></div>

                {/* Optional KYC pre-upload segment */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase">Pre-Upload KYC Secure Documents</h4>
                      <p className="text-[11px] text-slate-400">Save check-in time. Documents are stored fully encrypted at rest.</p>
                    </div>
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border border-slate-200">
                      Recommended
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Aadhaar details */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-700">Aadhaar Card (UIDAI)</div>
                        <input
                          type="text"
                          placeholder="Enter 12 Digit Aadhaar No"
                          value={aadhaarNum}
                          onChange={(e) => setAadhaarNum(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 mt-2 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      
                      <div className="mt-4">
                        {aadhaarFile ? (
                          <div className="bg-emerald-50 text-emerald-700 p-2 rounded text-[10.5px] font-mono flex items-center justify-between border border-emerald-100">
                            <span>aadhaar_scan.pdf (encrypted)</span>
                            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDummyUpload("aadhaar")}
                            className="w-full border border-dashed border-slate-300 py-3.5 rounded-lg text-slate-400 text-xs flex flex-col items-center justify-center gap-1 hover:border-amber-500 hover:text-slate-600 transition-all bg-white"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Simulate Aadhaar Upload</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* PAN Card Details */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-700">PAN Card (Income Tax Dept)</div>
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="Enter 10 Digit Alphanumeric PAN"
                          value={panNum}
                          onChange={(e) => setPanNum(e.target.value.toUpperCase())}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 mt-2 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="mt-4">
                        {panFile ? (
                          <div className="bg-emerald-50 text-emerald-700 p-2 rounded text-[10.5px] font-mono flex items-center justify-between border border-emerald-100">
                            <span>pan_scan.pdf (encrypted)</span>
                            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDummyUpload("pan")}
                            className="w-full border border-dashed border-slate-300 py-3.5 rounded-lg text-slate-400 text-xs flex flex-col items-center justify-center gap-1 hover:border-amber-500 hover:text-slate-600 transition-all bg-white"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Simulate PAN Upload</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer live photo upload request */}
                  <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-700">Live Showroom Verification Photo</div>
                        <p className="text-[10px] text-slate-400">Match customer against KYC documents at counter counter desk.</p>
                      </div>
                      
                      {photoFile ? (
                        <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-[10.5px] font-mono flex items-center gap-2 border border-emerald-100">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Photo Encoded &amp; Logged</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDummyUpload("photo")}
                          className="bg-slate-950 text-white font-bold text-xs px-3.5 py-2 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-1.5"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Capture Mock Profile Photo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 my-6"></div>

                {/* Estimate weight expectations */}
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-500/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 font-bold uppercase mb-1">Expected Purity</label>
                    <div className="flex gap-2">
                      {["24K", "22K", "18K"].map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setPurityExpectation(k as any)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            purityExpectation === k
                              ? "bg-amber-500 text-slate-950 shadow-sm"
                              : "bg-white text-slate-600 border border-slate-200"
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 font-bold uppercase mb-1">Approximate Weight (Grams)</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 15.5"
                      value={weightExpectation}
                      onChange={(e) => setWeightExpectation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold tracking-wider uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 border border-amber-500/15 shadow-lg select-none"
                  >
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span>Confirm Booking &amp; Generate Ticket</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 3: TRACK BUYBACK (TICKET STATUS PANEL) ======================= */}
      {activeTab === "tracker" && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900">Your Old Gold Sell Requests</h2>
              <p className="text-xs text-slate-400">Real-time workflow tracker directly monitoring physical showroom actions and approvals.</p>
            </div>
            <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1 rounded text-[11px] font-bold">
              Customer ID: Demo Account
            </span>
          </div>

          {/* List of customer's tickets */}
          {tickets.filter((t) => t.customerId === "cust-demo").length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold mb-1">No ticket bookings detected</p>
              <p className="text-slate-400 text-xs">Jump over to the "Sell Old Gold" tab to generate a showroom appointment ticket.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets
                .filter((t) => t.customerId === "cust-demo")
                .map((t) => {
                  // Determine status step/color
                  let statusColor = "bg-slate-100 text-slate-600 border-slate-200";
                  let statusText = "";
                  let activeStepIdx = 1;

                  switch (t.status) {
                    case "appointment_booked":
                      statusColor = "bg-sky-50 text-sky-700 border-sky-100";
                      statusText = "Appointment Checked in - KYC Verification Pending";
                      activeStepIdx = 1;
                      break;
                    case "kyc_pending":
                      statusColor = "bg-indigo-50 text-indigo-700 border-indigo-100";
                      statusText = "KYC Uploads Pending Review";
                      activeStepIdx = 1;
                      break;
                    case "testing_pending":
                      statusColor = "bg-orange-50 text-orange-700 border-orange-100";
                      statusText = "Gold Purity / Density Assay Testing";
                      activeStepIdx = 2;
                      break;
                    case "approval_pending":
                      statusColor = "bg-purple-50 text-purple-700 border-purple-100";
                      statusText = "Awaiting Branch Manager Authorization";
                      activeStepIdx = 3;
                      break;
                    case "approved":
                      statusColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                      statusText = "Approved! Bill Generation and Print Stage";
                      activeStepIdx = 4;
                      break;
                    case "rejected":
                      statusColor = "bg-rose-50 text-rose-700 border-rose-100";
                      statusText = "Rejected by Branch Manager";
                      activeStepIdx = 3;
                      break;
                    case "completed":
                      statusColor = "bg-teal-50 text-teal-700 border-teal-100";
                      statusText = "Transaction fully settled. Invoice generated.";
                      activeStepIdx = 4;
                      break;
                  }

                  return (
                    <div key={t.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      {/* Ticket Header */}
                      <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center border-b border-amber-500/10">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-amber-400 font-extrabold tracking-wider">{t.id}</span>
                            <span className="text-slate-400 text-xs font-mono">&bull; booking scheduled</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Showroom: <span className="text-white font-medium">{t.branchName}</span>
                          </div>
                        </div>

                        <div className="text-right sm:text-right">
                          <div className="text-[10px] text-slate-400 font-mono">APPOINTMENT DATE</div>
                          <div className="text-xs font-bold font-mono text-amber-200">
                            {t.appointmentDate} @ {t.appointmentTime}
                          </div>
                        </div>
                      </div>

                      {/* Timeline Workflow */}
                      <div className="p-6">
                        {/* Status alert bar */}
                        <div className={`p-3 rounded-xl border text-xs font-semibold mb-6 flex items-center gap-2 ${statusColor}`}>
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>Current Status: <span className="font-extrabold">{statusText}</span></span>
                          {t.rejectionReason && (
                            <div className="text-rose-600 block mt-1 font-normal">
                              Reason provided: <span className="italic font-bold">"{t.rejectionReason}"</span>. Please return to staff counter.
                            </div>
                          )}
                        </div>

                        {/* Interactive flow trace */}
                        <div className="relative pt-2 pb-6">
                          <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block"></div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                            {[
                              { label: "1. Slot Booked", desc: "Showroom booking active", val: 1 },
                              { label: "2. KYC Verified", desc: "Aadhaar / Passport logs", val: 2 },
                              { label: "3. Manager Approved", desc: "Non-bypassable validation", val: 3 },
                              { label: "4. Cash Payout", desc: "Disbursement & Bill", val: 4 }
                            ].map((step) => {
                              const isPassed = activeStepIdx >= step.val && t.status !== "rejected";
                              const isCurrent = activeStepIdx === step.val && t.status !== "rejected";

                              return (
                                <div key={step.val} className="flex gap-2.5 items-center md:flex-col md:text-center text-left">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none ${
                                      isPassed
                                        ? "bg-amber-500 text-slate-950"
                                        : isCurrent
                                        ? "bg-white text-slate-800 border-2 border-amber-500 animate-pulse"
                                        : "bg-slate-100 text-slate-400 border border-slate-200"
                                    }`}
                                  >
                                    {isPassed ? <Check className="w-4 h-4" /> : step.val}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-slate-800 leading-none">{step.label}</div>
                                    <div className="text-[10px] text-slate-400 mt-1">{step.desc}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Gold specs list if tested */}
                        {t.status !== "appointment_booked" && t.status !== "kyc_pending" && (
                          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <h4 className="text-xs text-slate-500 font-extrabold uppercase mb-2">Showroom Evaluation Report</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                              <div>
                                <span className="text-slate-400">Purity Assayed:</span>
                                <div className="font-extrabold text-slate-900">{t.goldPurity} Gold</div>
                              </div>
                              <div>
                                <span className="text-slate-400">Net Weight:</span>
                                <div className="font-extrabold text-slate-900">{t.netWeight.toFixed(2)} Grams</div>
                              </div>
                              <div>
                                <span className="text-slate-400">Deductions Logged:</span>
                                <div className="font-extrabold text-amber-700">{t.deductions.toFixed(2)} Grams</div>
                              </div>
                              <div>
                                <span className="text-slate-400">Approved Payout:</span>
                                <div className="font-black text-emerald-600 text-sm">
                                  {formatCurrency(t.payoutAmount)}
                                </div>
                              </div>
                            </div>
                            
                            {t.deductionNotes && (
                              <p className="text-[10.5px] mt-2.5 text-slate-500 font-serif italic border-t border-slate-200 pt-2">
                                <span className="font-semibold font-sans text-[10px] not-italic text-slate-400 uppercase">Assay Notes:</span> "{t.deductionNotes}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ======================= TAB 4: MY ORDERS & ECOMMERCE PURCHASE ARCHIVE ======================= */}
      {activeTab === "orders" && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-lg font-black text-slate-900">Online Purchases</h2>
              <p className="text-xs text-slate-400">Historical delivery tracking and printable invoice logs for your B2C catalog orders.</p>
            </div>
            <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded text-xs font-mono font-bold">
              {custEmail}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold mb-1">No orders detected</p>
              <p className="text-slate-400 text-xs">Pick some premium gold assets in our catalogue to check out.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  {/* Order Header */}
                  <div className="bg-slate-950 p-4 text-white flex flex-col sm:flex-row gap-3 justify-between font-mono text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-extrabold">{o.id}</span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="text-slate-300">Ordered {new Date(o.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 text-slate-400">
                        Shipping address: <span className="text-white font-sans">{o.shippingAddress}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">Total Charged</span>
                      <div className="text-sm font-black text-white">{formatCurrency(o.totalAmount)}</div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div className="space-y-3 flex-1 w-full">
                        <div className="text-[10px] text-slate-400 font-extrabold uppercase">ORDER ITEMS</div>
                        {o.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl text-xs">
                            <div>
                              <div className="font-extrabold text-slate-900">{item.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Qty: {item.quantity} &bull; Gold standard: {item.weight}g &bull; Applied Sell Quote: ₹{item.goldRateApplied}/g
                              </div>
                            </div>
                            <div className="font-mono font-bold text-slate-800 text-right shrink-0">
                              {formatCurrency(item.totalPrice)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery statuses */}
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center self-stretch sm:self-auto flex flex-col justify-center sm:w-60">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase mb-1">Tracking Logistics</span>
                        <div className="font-mono font-bold text-slate-600 text-[10.5px] truncate bg-slate-200/50 py-1 px-2 rounded mb-2.5">
                          {o.trackingNumber}
                        </div>
                        <div className={`py-1 px-3 rounded-full text-xs font-bold inline-block mx-auto ${
                          o.status === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : o.status === "shipped"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {o.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================= GLOBAL SHOPPING CART SLIDE OVER MODAL ======================= */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex justify-between items-center border-b border-rose-500/10">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <span className="font-black text-md">Shopping Bag ({cart.length})</span>
              </div>
              <button
                onClick={() => setShowCartModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core checkout selector steps */}
            {cart.length > 0 && (
              <div className="grid grid-cols-3 text-center border-b border-slate-200 text-xs font-bold bg-slate-50">
                {[
                  { key: "review", label: "1. Cart Summary" },
                  { key: "shipping", label: "2. Shipping Details" },
                  { key: "payment", label: "3. Simulated Payment" }
                ].map((st) => (
                  <div
                    key={st.key}
                    className={`py-3.5 border-b-2 transition-all ${
                      checkoutStep === st.key
                        ? "border-amber-500 text-amber-600 bg-white"
                        : "border-transparent text-slate-400"
                    }`}
                  >
                    {st.label}
                  </div>
                ))}
              </div>
            )}

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="text-slate-600 font-bold">Your shopping bag is empty</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Select dynamic-priced custom jewellery, coins or bars from the Buy Gold panel.
                  </p>
                  <button
                    onClick={() => setShowCartModal(false)}
                    className="bg-slate-900 text-white text-xs font-bold py-2.5 px-6 rounded-xl mt-5 hover:bg-slate-800 transition-all"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                <>
                  {/* STEP 1: CART LIST SUMMARY */}
                  {checkoutStep === "review" && (
                    <div className="space-y-4">
                      {cart.map((item) => {
                        const originalP = item.product;
                        const karat = getProductKarat(originalP);
                        const ratePerGram = karat === "24K" ? goldRates.sell24K : karat === "22K" ? goldRates.sell22K : goldRates.sell18K;
                        const singlePricePrice = calculateProductPrice(originalP);

                        return (
                          <div key={originalP.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                            <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                              <img src={originalP.image} alt={originalP.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between text-xs">
                              <div>
                                <h4 className="font-extrabold text-slate-900 leading-snug">{originalP.name}</h4>
                                <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide font-mono">
                                  {karat} &bull; {originalP.weight}g weight &bull; Making: ₹{originalP.makingCharge}/g
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                {/* Quantity counters */}
                                <div className="flex items-center gap-2 bg-white rounded border border-slate-200">
                                  <button
                                    onClick={() => updateCartQuantity(originalP.id, item.quantity - 1)}
                                    className="px-2 py-0.5 text-slate-500 hover:bg-slate-100 font-bold text-xs"
                                  >
                                    -
                                  </button>
                                  <span className="font-mono font-bold text-xs px-1">{item.quantity}</span>
                                  <button
                                    onClick={() => addToCart(originalP, 1)}
                                    className="px-2 py-0.5 text-slate-500 hover:bg-slate-100 font-bold text-xs"
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Math Trace */}
                                <div className="text-right">
                                  <div className="text-[10.5px] font-mono font-bold text-slate-950">
                                    {formatCurrency(singlePricePrice * item.quantity)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(originalP.id)}
                              className="text-slate-300 hover:text-rose-500 p-1 self-start rounded-full hover:bg-slate-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* STEP 2: SHIPPING DETAILS */}
                  {checkoutStep === "shipping" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-550 mb-1">Customer Full Name *</label>
                        <input
                          type="text"
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-700 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-550 mb-1">Email Address *</label>
                        <input
                          type="email"
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-700 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-550 mb-1">Contact Phone *</label>
                        <input
                          type="text"
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-700 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-550 mb-1">Gold Delivery Target Address *</label>
                        <textarea
                          rows={3}
                          value={custAddress}
                          onChange={(e) => setCustAddress(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-700 font-semibold"
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: SIMULATED PAYMENT */}
                  {checkoutStep === "payment" && (
                    <div className="space-y-5">
                      <div className="bg-amber-500/10 border border-amber-500/20 text-slate-800 p-3.5 rounded-xl text-xs flex gap-2">
                        <LockIndicatorIcon />
                        <div>
                          <span className="font-bold text-amber-700 block">PCI-DSS Compliant Gold Payment Gate</span>
                          Your actual transaction is simulated on our sandboxed proofing server securely. Enter a generic card number below. Let's showcase checkout execution.
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Generic Card Number *</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={paymentCard}
                              onChange={(e) => setPaymentCard(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-700 font-semibold font-mono"
                            />
                            <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Expiry Date *</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={paymentExpiry}
                              onChange={(e) => setPaymentExpiry(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-700 font-semibold font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Security CVV *</label>
                            <input
                              type="password"
                              maxLength={3}
                              value={paymentCvv}
                              onChange={(e) => setPaymentCvv(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-700 font-semibold font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUCCESS */}
                  {checkoutStep === "success" && latestCreatedOrder && (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                        <Check className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">Payment Authorization Success!</h3>
                      <p className="text-xs text-slate-500 mt-1">Your order has been registered securely. Details:</p>
                      
                      <div className="my-5 inline-block bg-slate-950 text-white font-mono text-lg font-bold py-2 px-6 rounded-xl border border-amber-500/20">
                        ID: {latestCreatedOrder.id}
                      </div>

                      <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl text-left text-xs font-mono text-slate-600 space-y-1 max-w-sm mx-auto">
                        <div>Tracking No:</div>
                        <div className="font-bold text-slate-800">{latestCreatedOrder.trackingNumber}</div>
                        <div className="pt-2">Address:</div>
                        <div className="font-normal text-slate-500 font-sans">{latestCreatedOrder.shippingAddress}</div>
                      </div>

                      <div className="mt-6 flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setShowCartModal(false);
                            setActiveTab("orders");
                          }}
                          className="bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl hover:bg-slate-800 transition-all"
                        >
                          View Order History
                        </button>
                        <button
                          onClick={() => setShowCartModal(false)}
                          className="bg-amber-500 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl hover:bg-amber-400 transition-all"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Summary (Not if success) */}
            {cart.length > 0 && checkoutStep !== "success" && (
              <div className="p-4 sm:p-6 bg-slate-900 text-white border-t border-rose-500/10">
                <div className="space-y-2 mb-4 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Retail Commodities subtotal:</span>
                    <span>{formatCurrency(cartTotalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Eco Shipping &amp; Insurance:</span>
                    <span className="text-emerald-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-[13px] font-bold text-white pt-2 border-t border-slate-800">
                    <span>Secured Total:</span>
                    <span className="text-amber-400 font-black">{formatCurrency(cartTotalAmount)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {checkoutStep !== "review" && (
                    <button
                      onClick={() => {
                        if (checkoutStep === "shipping") setCheckoutStep("review");
                        if (checkoutStep === "payment") setCheckoutStep("shipping");
                      }}
                      className="bg-slate-800 text-white hover:bg-slate-700 px-4 py-3 rounded-xl font-bold text-xs transition-all"
                    >
                      Back
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (checkoutStep === "review") setCheckoutStep("shipping");
                      else if (checkoutStep === "shipping") setCheckoutStep("payment");
                      else if (checkoutStep === "payment") handleCheckoutSubmit();
                    }}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>
                      {checkoutStep === "review" && "Proceed to Delivery"}
                      {checkoutStep === "shipping" && "Proceed to Cash Payment Gateway"}
                      {checkoutStep === "payment" && `Authorize Payment of ${formatCurrency(cartTotalAmount)}`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const LockIndicatorIcon = () => (
  <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
