/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { usePlatform } from "../context/PlatformContext";
import { BuybackTicket } from "../types";
import { decryptKYCData, maskSensitiveValue } from "../lib/encryption";
import {
  Sparkles,
  Users,
  Search,
  PlusCircle,
  FileText,
  ShieldCheck,
  Scale,
  DollarSign,
  TrendingUp,
  FileMinus,
  CheckCircle,
  XCircle,
  RotateCcw,
  Printer,
  ChevronRight,
  Eye,
  EyeOff,
  Clock,
  Wifi,
  Database,
  ArrowRight,
  Check
} from "lucide-react";

export const StaffPortal: React.FC = () => {
  const {
    currentRole,
    currentStaffId,
    assignedBranchId,
    branches,
    staffUsers,
    tickets,
    goldRates,
    isOnline,
    offlineQueue,
    addWalkInTicket,
    updateTicketKYC,
    updateTicketGoldDetails,
    submitTicketForApproval,
    approveTicket,
    rejectTicket,
    requestTicketCorrection,
    completeBuybackTransaction,
    logAction
  } = usePlatform();

  // Selected branch details
  const branchObj = branches.find((b) => b.id === assignedBranchId);
  const activeStaff = staffUsers.find((s) => s.id === currentStaffId);

  // States
  const [ticketSearchQuery, setTicketSearchQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Walk-in booking states
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");

  // Step state for active evaluation
  const [purity, setPurity] = useState<"24K" | "22K" | "18K">("22K");
  const [netWeight, setNetWeight] = useState("");
  const [deductions, setDeductions] = useState("");
  const [deductionNotes, setDeductionNotes] = useState("");

  // KYC Input states at desk
  const [aadhaarNum, setAadhaarNum] = useState("");
  const [panNum, setPanNum] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState("");
  const [panFile, setPanFile] = useState("");
  const [photoFile, setPhotoFile] = useState("");

  // Decryption viewing logs (representing audit decrypt)
  const [decryptedAttachments, setDecryptedAttachments] = useState<{ [ticketId: string]: boolean }>({});
  const [showInvoiceTicket, setShowInvoiceTicket] = useState<BuybackTicket | null>(null);

  // Manager correction state
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionReason, setCorrectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Upload simulation helper
  const handleSimulatedDocumentScan = (docType: "aadhaar" | "pan" | "photo") => {
    const dataUrls = {
      aadhaar: "data:image/jpeg;base64,f03h48fh394h38[SECURE_AADHAAR_SCAN_RAW]",
      pan: "data:image/jpeg;base64,fj0394hf3984jf8[SECURE_PAN_SCAN_RAW]",
      photo: "data:image/jpeg;base64,f834hf83h498h38fjf938[SECURE_LIVE_DESK_PHOTO]"
    };
    if (docType === "aadhaar") setAadhaarFile(dataUrls.aadhaar);
    else if (docType === "pan") setPanFile(dataUrls.pan);
    else setPhotoFile(dataUrls.photo);

    logAction("STAFF_KYC_UPLOAD", `Staff captured and uploaded ${docType.toUpperCase()} file at desk.`);
  };

  // Filter queue of tickets based on branch logic
  const filteredBranchTickets = tickets.filter((t) => {
    // ❗ Security Enforced: Only show tickets for their ASSIGNED branch!
    if (t.branchId !== assignedBranchId) return false;

    if (ticketSearchQuery) {
      const query = ticketSearchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(query) ||
        t.customerName.toLowerCase().includes(query) ||
        t.customerPhone.includes(query)
      );
    }
    return true;
  });

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId && t.branchId === assignedBranchId);

  // Handle Walk-in ticket creation
  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone) return;

    const tk = addWalkInTicket({
      customerName: walkinName,
      customerPhone: walkinPhone,
      branchId: assignedBranchId,
      branchName: branchObj?.name || "Unassigned Branch",
      appointmentDate: new Date().toISOString().slice(0, 10),
      appointmentTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      kycDocs: { encrypted: false },
      goldPurity: "22K",
      netWeight: 0,
      deductions: 0,
      deductionNotes: "",
      liveBuybackRateApplied: goldRates.buy22K,
      payoutAmount: 0,
    });

    // Automatically highlight newly created walk-in ticket
    setSelectedTicketId(tk.id);
    setWalkinName("");
    setWalkinPhone("");
    setShowWalkinModal(false);
  };

  // Submit KYC Step
  const submitKYCStep = (tId: string) => {
    if (!aadhaarNum || !panNum || !aadhaarFile || !panFile || !photoFile) {
      alert("Verification checklist incomplete! Ensure Aadhaar No, PAN No, and ALL 3 document files are uploaded/captured.");
      return;
    }

    updateTicketKYC(tId, {
      aadhaarNumber: aadhaarNum,
      panNumber: panNum,
      aadhaarUrl: aadhaarFile,
      panUrl: panFile,
      customerPhotoUrl: photoFile,
    });

    // Reset fields
    setAadhaarNum("");
    setPanNum("");
    setAadhaarFile("");
    setPanFile("");
    setPhotoFile("");
  };

  // Submit Gold Testing Details
  const submitGoldAssayStep = (tId: string) => {
    const weightGrams = parseFloat(netWeight);
    const deductionsGrams = parseFloat(deductions) || 0;

    if (!netWeight || isNaN(weightGrams) || weightGrams <= 0) {
      alert("Invalid weight. Please provide a validated net gold weight.");
      return;
    }

    updateTicketGoldDetails(tId, purity, weightGrams, deductionsGrams, deductionNotes);
    
    // Reset inputs
    setNetWeight("");
    setDeductions("");
    setDeductionNotes("");
  };

  const handlePrintDocument = (id: string) => {
    window.print();
    logAction("BILL_PRINTED", `Tax Invoice printed physically at showroom printer for ticket ${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans">
      
      {/* 1. Offline Mode Indicator Status banner when working offline */}
      {!isOnline && (
        <div className="bg-rose-500 text-white py-3 px-6 rounded-2xl mb-6 font-bold text-xs flex justify-between items-center shadow-lg border border-rose-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
            <span>SHOWROOM OFFLINE MODE COMPLIANT &bull; FORM ENTRIES CACHED LOCALLY</span>
          </div>
          <span className="text-[10px] bg-black/30 border border-white/25 px-2 py-0.5 rounded uppercase font-mono">
            Queue Size: {offlineQueue.length} Pending Sync
          </span>
        </div>
      )}

      {/* 2. Top Portal Header Details */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div>
          <span className="text-[10.5px] uppercase font-mono font-black text-amber-500 flex items-center gap-1 leading-none">
            <Database className="w-3.5 h-3.5" /> Showroom Management Workspace
          </span>
          <h2 className="text-xl font-black text-slate-800 mt-1">
            {branchObj?.name || "Global Office Grid"}
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Logged in as: <span className="font-semibold text-slate-700">{activeStaff?.name}</span> ({currentRole === "manager" ? "Branch Chief Manager" : "Counter Executive Officer"})
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {currentRole === "executive" && (
            <button
              onClick={() => setShowWalkinModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md flex-1 sm:flex-initial"
            >
              <PlusCircle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Register New Desk Walk-in</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Master & Details Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ===================== COLUMN 1: PENDING/ACTIVE QUEUE VIEW ===================== */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
          {/* Header & Filter Search */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 mb-3 flex justify-between items-center">
              <span>Showroom Queue ({filteredBranchTickets.length})</span>
              <span className="font-mono text-[10px] text-slate-500">Filters: Current Branch only</span>
            </h3>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Ticket, Cust ID, Phone..."
                value={ticketSearchQuery}
                onChange={(e) => setTicketSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Ticket Queue list elements */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredBranchTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FileMinus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-xs text-slate-500">No active queue elements</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Create a walk-in to test the sequence.</p>
              </div>
            ) : (
              filteredBranchTickets.map((t) => {
                const isSelected = t.id === selectedTicketId;
                
                // Color mapping for ticket status
                let statusBadge = "bg-slate-100 text-slate-600";
                if (t.status === "appointment_booked") statusBadge = "bg-sky-100 text-sky-800";
                else if (t.status === "kyc_pending") statusBadge = "bg-indigo-100 text-indigo-800";
                else if (t.status === "testing_pending") statusBadge = "bg-orange-100 text-orange-800";
                else if (t.status === "approval_pending") statusBadge = "bg-purple-100 text-purple-800 font-black tracking-wide";
                else if (t.status === "approved") statusBadge = "bg-emerald-100 text-emerald-800 font-extrabold";
                else if (t.status === "rejected") statusBadge = "bg-rose-100 text-rose-800";
                else if (t.status === "completed") statusBadge = "bg-teal-100 text-teal-800";

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTicketId(t.id);
                      setDecryptedAttachments({});
                    }}
                    className={`w-full p-4 text-left transition-all flex justify-between items-start border-l-4 ${
                      isSelected
                        ? "bg-amber-500/10 border-l-amber-500"
                        : "hover:bg-slate-50/50 border-l-transparent"
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-slate-900 font-extrabold text-xs">{t.id}</span>
                        {t.id.includes("-WI-") && (
                          <span className="bg-slate-100 text-slate-500 font-mono text-[8.5px] font-bold px-1 rounded">
                            Walk-In
                          </span>
                        )}
                        <span className={`text-[9px] font-bold px-1.5 rounded uppercase font-mono ${statusBadge}`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </div>
                      
                      <div className="font-semibold text-slate-800 text-xs truncate">
                        {t.customerName}
                      </div>

                      <div className="text-[10px] font-mono text-slate-400">
                        Ph: {t.customerPhone}
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(t.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {t.payoutAmount > 0 && (
                        <div className="text-[11px] font-mono font-black text-slate-700 leading-none">
                          {formatCurrency(t.payoutAmount)}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ===================== COLUMN 2 & 3: FORM WORKSPACE & APPROVAL OVERVIEW ===================== */}
        <div className="lg:col-span-2 bg-slate-50/20 rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-[calc(100vh-180px)] min-h-[500px] flex flex-col bg-white">
          {selectedTicket ? (
            <div className="flex-1 overflow-y-auto flex flex-col justify-between">
              
              {/* Ticket Top-level display info */}
              <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold text-lg tracking-wider">{selectedTicket.id}</span>
                    <span className="bg-white/10 text-white/80 font-mono text-[9px] px-2 py-0.5 rounded font-medium border border-white/10 uppercase">
                      Status: {selectedTicket.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Customer: <span className="text-white font-medium">{selectedTicket.customerName}</span> ({selectedTicket.customerPhone})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">SHOWROOM BRANCH</span>
                  <span className="text-xs font-bold text-amber-200 font-mono uppercase">{branchObj?.name}</span>
                </div>
              </div>

              {/* Core Active Role Process Segment */}
              <div className="p-6 space-y-6 flex-1">
                
                {/* 1. Counter Executive flow sequence */}
                {currentRole === "executive" && (
                  <div className="space-y-6">
                    
                    {/* STEP 1: COLLECT KYC */}
                    {selectedTicket.status === "kyc_pending" || selectedTicket.status === "appointment_booked" ? (
                      <div className="bg-white border text-xs border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                        <div className="flex items-center gap-2 font-black text-slate-900 uppercase">
                          <Users className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Desk Step 1: Customer KYC Validation &amp; Archival</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-tight mt-0.5">
                          Collect legal identification elements. All identity cards must be captured digitally, simulated encryption locks apply on-the-fly.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Aadhaar Card Number *</label>
                            <input
                              type="text"
                              placeholder="e.g. 5600-4923-0192"
                              value={aadhaarNum}
                              onChange={(e) => setAadhaarNum(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono text-slate-800 font-semibold"
                            />
                            
                            <div className="mt-2.5">
                              {aadhaarFile ? (
                                <div className="text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg font-mono text-[10.5px] flex items-center justify-between">
                                  <span>aadhaar_raw.jpg (Verified)</span>
                                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSimulatedDocumentScan("aadhaar")}
                                  className="w-full bg-slate-50 border border-dashed border-slate-300 py-2.5 rounded-lg text-slate-400 hover:text-slate-600 transition-all text-[11px]"
                                >
                                  Simulate Scanner Feed (Aadhaar Front/Back)
                                </button>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">PAN Card Number *</label>
                            <input
                              type="text"
                              maxLength={10}
                              placeholder="e.g. CHIPS4829K"
                              value={panNum}
                              onChange={(e) => setPanNum(e.target.value.toUpperCase())}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono text-slate-800 font-semibold"
                            />

                            <div className="mt-2.5">
                              {panFile ? (
                                <div className="text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg font-mono text-[10.5px] flex items-center justify-between">
                                  <span>pan_raw.jpg (Verified)</span>
                                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSimulatedDocumentScan("pan")}
                                  className="w-full bg-slate-50 border border-dashed border-slate-300 py-2.5 rounded-lg text-slate-400 hover:text-slate-600 transition-all text-[11px]"
                                >
                                  Simulate Scanner Feed (PAN Card)
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-700 block">Live Desktop Identity Snapshot *</span>
                            <span className="text-[10px] text-slate-400 block">Verify live target matches Aadhaar/PAN photo.</span>
                          </div>

                          {photoFile ? (
                            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg font-mono text-[10.5px] font-bold flex items-center gap-1.5 shrink-0">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Photo Logged at Desk
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSimulatedDocumentScan("photo")}
                              className="bg-slate-950 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg hover:bg-slate-800 shrink-0 select-none"
                            >
                              Simulate Live Webcam Frame Capture
                            </button>
                          )}
                        </div>

                        <div className="pt-2 text-right">
                          <button
                            type="button"
                            onClick={() => submitKYCStep(selectedTicket.id)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 w-full sm:w-auto shadow"
                          >
                            <span>Save &amp; Proceed to Gold Assaying</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* STEP 2: TEST GOLD & PURITY */}
                    {selectedTicket.status === "testing_pending" ? (
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-4">
                        <div className="flex items-center gap-2 font-black text-slate-900 uppercase">
                          <Scale className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Desk Step 2: Gold Spectrometry Meter &amp; Deductions</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-tight">
                          Perform physical chemical density tests. Report net gold content and solder/stone weight deductions to compute rate calculation.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Purity selector */}
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Tested Gold Purity Standard *</label>
                            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                              {["24K", "22K", "18K"].map((k) => (
                                <button
                                  key={k}
                                  type="button"
                                  onClick={() => setPurity(k as any)}
                                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                                    purity === k
                                      ? "bg-amber-500 text-slate-950 shadow-sm"
                                      : "text-slate-600 hover:text-slate-900"
                                  }`}
                                >
                                  {k}
                                </button>
                              ))}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-1.5">
                              Live showroom buyout quote: <span className="font-extrabold text-emerald-600">₹{purity === "24K" ? goldRates.buy24K : purity === "22K" ? goldRates.buy22K : goldRates.buy18K}/g</span>
                            </div>
                          </div>

                          {/* net weight logic */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Gross Weight (g) *</label>
                              <input
                                type="number"
                                step="any"
                                placeholder="0.00"
                                value={netWeight}
                                onChange={(e) => setNetWeight(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-800 font-bold font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Deductions (g)</label>
                              <input
                                type="number"
                                step="any"
                                placeholder="0.00"
                                value={deductions}
                                onChange={(e) => setDeductions(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-800 font-bold font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Deductions breakdown notes */}
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Spectrograph &amp; Deductions Logic Notes</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Deducted 0.5g for solder metal content. Verified pure under spectrum analysis with density spectrometry meter."
                            value={deductionNotes}
                            onChange={(e) => setDeductionNotes(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-700"
                          ></textarea>
                        </div>

                        {/* Interactive dynamic buyout total math calculation preview */}
                        {netWeight && parseFloat(netWeight) > 0 && (
                          <div className="bg-slate-900 text-amber-400 p-4 rounded-xl border border-amber-500/10 flex justify-between items-center">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-mono">DYNAMIC PAYOUT PREVIEW (Math Trace):</span>
                              <span className="text-[10.5px] text-slate-300 font-mono block">
                                ({parseFloat(netWeight).toFixed(2)}g - {(parseFloat(deductions) || 0).toFixed(2)}g) &times; ₹{purity === "24K" ? goldRates.buy24K : purity === "22K" ? goldRates.buy22K : goldRates.buy18K}
                              </span>
                            </div>
                            <span className="text-xl font-mono font-black">
                              {formatCurrency(
                                Math.max(
                                  0,
                                  Math.round(
                                    (parseFloat(netWeight) - (parseFloat(deductions) || 0)) *
                                      (purity === "24K" ? goldRates.buy24K : purity === "22K" ? goldRates.buy22K : goldRates.buy18K)
                                  )
                                )
                              )}
                            </span>
                          </div>
                        )}

                        <div className="pt-2 text-right">
                          <button
                            type="button"
                            onClick={() => submitGoldAssayStep(selectedTicket.id)}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 w-full sm:w-auto shadow"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                            <span>Confirm Calculations &amp; Lock Ticket</span>
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* WAITING FOR APPROVAL OVERLAY PANEL */}
                    {selectedTicket.status === "approval_pending" ? (
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-2xl flex flex-col items-center text-center">
                        <Clock className="w-10 h-10 text-purple-600 animate-spin mb-3" />
                        <span className="bg-purple-200 text-purple-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-1">
                          PENDING BRANCH MANAGER AUTHORIZATION
                        </span>
                        <h4 className="font-extrabold text-slate-900">Non-bypassable Security Block Active</h4>
                        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-normal">
                          LOCKED: Counter Executive rahul.mumbai cannot print receipt, modify details, or select bill generation until Priyah Patel (Branch Chief) reviews this ticket from her portal.
                        </p>
                        
                        {/* Summary of what is lock-waiting */}
                        <div className="bg-white p-3 rounded-xl border border-purple-100 text-left text-[11px] text-slate-600 w-full max-w-xs font-mono space-y-1">
                          <div className="font-bold text-slate-800 font-sans border-b border-slate-100 pb-1 flex justify-between items-center text-[10px] uppercase">
                            <span>Evaluated Specs</span>
                            <span className="text-purple-600 font-black">{selectedTicket.goldPurity} Gold</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pure weight:</span>
                            <span>{selectedTicket.netWeight}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rate Applied:</span>
                            <span>INR {selectedTicket.liveBuybackRateApplied}/g</span>
                          </div>
                          <div className="flex justify-between font-black text-slate-900 border-t border-dashed border-slate-200 pt-1">
                            <span>Draft payout:</span>
                            <span className="text-emerald-600">{formatCurrency(selectedTicket.payoutAmount)}</span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* POST MANAGER APPROVAL EXECUTION COMPLETED PANEL */}
                    {selectedTicket.status === "approved" || selectedTicket.status === "completed" ? (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-6 rounded-2xl shadow-sm text-center">
                        <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                        <span className="bg-emerald-200 text-emerald-800 text-[9.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-1">
                          TICKET AUTHORIZED FOR DISBURSEMENT
                        </span>
                        <h4 className="font-black text-slate-900">Branch Chief Approved Ticket!</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5 leading-snug">
                          The bill has been unlocked. Please download/print the official Invoice and trigger payment settlement of <span className="font-bold font-mono text-slate-800">{formatCurrency(selectedTicket.payoutAmount)}</span> to customer.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2.5 justify-center">
                          {/* Invoice trigger printer modal */}
                          <button
                            type="button"
                            onClick={() => setShowInvoiceTicket(selectedTicket)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow select-none"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            <span>Preview Tax Invoice Bill</span>
                          </button>
                          
                          {selectedTicket.status === "approved" && (
                            <button
                              type="button"
                              onClick={() => {
                                completeBuybackTransaction(selectedTicket.id);
                                logAction("TRANSACTION_SETTLED", `Marked buyback transaction ${selectedTicket.id} as completely paid.`);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm Payment and Complete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {/* RED REJECTED TICKET BLOCK */}
                    {selectedTicket.status === "rejected" ? (
                      <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl text-center">
                        <XCircle className="w-10 h-10 text-rose-600 mx-auto mb-2" />
                        <span className="bg-rose-100 text-rose-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded mb-1">
                          TICKET OFFICIALLY REJECTED BY MANAGER
                        </span>
                        <h4 className="font-black text-slate-900">Buyback Blocked / Cancelled</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-normal text-rose-950">
                          This transaction has been disqualified by management review. Reason: <span className="italic font-bold">"{selectedTicket.rejectionReason || "Identity / purity standards unmet"}"</span>
                        </p>
                      </div>
                    ) : null}

                  </div>
                )}

                {/* 2. Branch Manager Authorization workflow layout */}
                {currentRole === "manager" && (
                  <div className="space-y-6">
                    
                    {/* MANAGER TICKET DETAIL GRID */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 text-xs">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-3 flex-wrap gap-2">
                        <div>
                          <div className="text-[10px] text-slate-400 font-mono">Customer Information</div>
                          <div className="font-black text-slate-800 text-sm">{selectedTicket.customerName}</div>
                          <div className="font-mono text-[10.5px] mt-0.5 text-slate-500">Contact No: {selectedTicket.customerPhone}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-mono">Assay Expert Logged</div>
                          <div className="font-bold text-slate-700">{selectedTicket.executiveName || "Mumbai CE রাহুল"}</div>
                          <div className="font-mono text-[10.5px] text-slate-400">Assigned ID: {selectedTicket.executiveId || "st-exec-1"}</div>
                        </div>
                      </div>

                      {/* Decrypt KYC Documents secure block with hover or toggle button */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-black text-xs text-slate-700 uppercase flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Customer Verified KYC (Rest Crypto-Restored)</span>
                          </h4>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const isDecrypted = decryptedAttachments[selectedTicket.id];
                              setDecryptedAttachments({
                                ...decryptedAttachments,
                                [selectedTicket.id]: !isDecrypted
                              });
                              logAction(
                                "STAFF_DECRYPT_KYC",
                                `${isDecrypted ? "Masked" : "DECRYPTED & REQUESTED"} private KYC profile attachments of Customer ${selectedTicket.customerName} on Ticket ${selectedTicket.id}`
                              );
                            }}
                            className={`px-3 py-1 rounded text-[10px] font-extrabold flex items-center gap-1 transition-all uppercase border font-mono ${
                              decryptedAttachments[selectedTicket.id]
                                ? "bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100"
                                : "bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600"
                            }`}
                          >
                            {decryptedAttachments[selectedTicket.id] ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Mask Private Data</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>Decrypt Decipher Docs</span>
                              </>
                            )}
                          </button>
                        </div>

                        {selectedTicket.kycDocs?.aadhaarNumber ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {/* Aadhaar Details Card */}
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                              <span className="text-[10px] text-slate-400 block font-bold">UIDAI Aadhaar Verification</span>
                              <div className="font-extrabold text-[12px] font-mono mt-0.5 text-slate-700">
                                {decryptedAttachments[selectedTicket.id]
                                  ? selectedTicket.kycDocs.aadhaarNumber
                                  : maskSensitiveValue(selectedTicket.kycDocs.aadhaarNumber, 4)}
                              </div>
                              <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center gap-1 bg-white p-1 rounded border border-slate-100">
                                <Database className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">
                                  {decryptedAttachments[selectedTicket.id]
                                    ? decryptKYCData(selectedTicket.kycDocs.aadhaarUrl || "")
                                    : "[CIPHER_BLOB_AES256] Hover decryption required"}
                                </span>
                              </div>
                            </div>

                            {/* PAN Details Card */}
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                              <span className="text-[10px] text-slate-400 block font-bold">Income Tax Dept PAN</span>
                              <div className="font-extrabold text-[12px] font-mono mt-0.5 text-slate-700">
                                {decryptedAttachments[selectedTicket.id]
                                  ? selectedTicket.kycDocs.panNumber
                                  : maskSensitiveValue(selectedTicket.kycDocs.panNumber || "", 3)}
                              </div>
                              <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center gap-1 bg-white p-1 rounded border border-slate-100">
                                <Database className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">
                                  {decryptedAttachments[selectedTicket.id]
                                    ? decryptKYCData(selectedTicket.kycDocs.panUrl || "")
                                    : "[CIPHER_BLOB_AES256] Hover decryption required"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center bg-amber-50 text-amber-700 border border-amber-200/50 rounded-xl leading-tight">
                            <AlertCircleIcon />
                            No digital KYC files pre-attached on Booking. Executive must perform live document scanning at desk before payout.
                          </div>
                        )}

                        {selectedTicket.kycDocs?.customerPhotoUrl && (
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center text-[10.5px] font-mono text-slate-500">
                            <span>Live verification profile capture photo:</span>
                            <span className="text-emerald-600 font-bold">
                              {decryptedAttachments[selectedTicket.id] 
                                ? decryptKYCData(selectedTicket.kycDocs.customerPhotoUrl) 
                                : "[LIVE_DECIPHER_LOCKED] Photo Encrypted!"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-100 my-4"></div>

                      {/* GOLD DETAIL BLOCK FOR MANAGER */}
                      <div>
                        <h4 className="font-black text-xs text-slate-700 uppercase mb-3 flex items-center gap-1">
                          <Scale className="w-4 h-4 text-emerald-600" />
                          <span>Showroom Gold Assayed Report Details</span>
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-200">
                          <div>
                            <span className="text-slate-400 block tracking-wide">Purity Spectrum:</span>
                            <span className="text-slate-800 font-black text-sm">{selectedTicket.goldPurity || "unassayed"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block tracking-wide">Net Weight:</span>
                            <span className="text-slate-800 font-black text-sm font-mono">{selectedTicket.netWeight?.toFixed(2)}g</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block tracking-wide">Trash Deductions:</span>
                            <span className="text-rose-600 font-black text-sm font-mono">{selectedTicket.deductions?.toFixed(2)}g</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block tracking-wide">Today's buyback:</span>
                            <span className="text-slate-800 font-extrabold text-[12px] font-mono">INR {selectedTicket.liveBuybackRateApplied}/g</span>
                          </div>
                        </div>

                        {selectedTicket.deductionNotes && (
                          <p className="text-[11px] text-slate-500 font-serif italic mt-3 bg-slate-100/50 p-2.5 rounded-lg border">
                            <span className="font-semibold font-sans text-[10px] not-italic text-slate-400 uppercase">Assay details:</span> "{selectedTicket.deductionNotes}"
                          </p>
                        )}
                      </div>

                      {/* PAYOUT VALUATION PANEL */}
                      {selectedTicket.payoutAmount > 0 && (
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center text-white">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">OFFICIAL CONSOLIDATED PAYOUT:</span>
                            <span className="text-[11px] text-amber-400 font-mono">({selectedTicket.netWeight - selectedTicket.deductions}g pure gold standard)</span>
                          </div>
                          <span className="text-emerald-400 text-xl font-mono font-black">
                            {formatCurrency(selectedTicket.payoutAmount)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* MANAGER ACTIONS SEGMENT */}
                    {selectedTicket.status === "approval_pending" ? (
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow flex flex-col md:flex-row gap-2.5 justify-between">
                        <div className="self-center">
                          <span className="text-slate-700 font-extrabold text-xs block">Select Verification Verdict</span>
                          <span className="text-[10.5px] text-slate-400 block">All decisions are written permanently to the immutable audit log.</span>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {/* Send back for corrections */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowCorrectionModal(true);
                              setCorrectionReason("");
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4.5 py-3 rounded-xl transition-all"
                          >
                            Send for correction
                          </button>

                          {/* Reject ticket */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowRejectionModal(true);
                              setRejectionReason("");
                            }}
                            className="bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 font-bold text-xs px-4.5 py-3 rounded-xl transition-all"
                          >
                            Reject Buyback
                          </button>

                          {/* Approve ticket */}
                          <button
                            type="button"
                            onClick={() => {
                              approveTicket(selectedTicket.id, activeStaff?.id || "st-mgr-1", activeStaff?.name || "Priyah Patel");
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-3 rounded-xl shadow transition-all"
                          >
                            Approve Payout Payout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-100 p-4.5 rounded-xl border border-slate-200 text-slate-500 text-xs text-center font-bold">
                        {selectedTicket.status === "approved" || selectedTicket.status === "completed" ? (
                          <span className="text-emerald-700 flex items-center justify-center gap-1.5 font-extrabold">
                            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                            Authorized by {selectedTicket.managerName || "You"} (Payout Available)
                          </span>
                        ) : (
                          <span>Current status represents non-actionable review point for Manager level.</span>
                        )}
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-400">
              <FileText className="w-16 h-16 text-slate-200 mb-2.5 animate-pulse" />
              <p className="font-extrabold text-slate-600 text-md">No Live Ticket Selected</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Select an active gold ticket from the Branch queue on the left sidebar to display documentation, perform KYC checks, verify gold assays, or execute approval decisions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===================== REGISTRATION WALK-IN DESK TICKET MODAL ===================== */}
      {showWalkinModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateWalkin}
            className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 text-xs text-slate-705 relative animate-in zoom-in duration-200"
          >
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <h3 className="font-black text-md text-slate-900">Desk Walk-in Live Registration</h3>
              <button
                type="button"
                onClick={() => setShowWalkinModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full legal name"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Contact Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98200 98200"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-3 flex gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setShowWalkinModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold px-5 py-2.5 rounded-xl shadow"
              >
                Create Showroom Walk-in Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================== MANAGER REQUEST CORRECTION MODAL ===================== */}
      {showCorrectionModal && selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border text-xs space-y-4 animate-in zoom-in duration-150">
            <h3 className="font-extrabold text-slate-900 border-b pb-2">Send Back for Revision</h3>
            <div>
              <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Feedback Correction Request Notes *</label>
              <textarea
                rows={3}
                required
                placeholder="Detail what is mismatching (purity, alloy, weight or blurry scans)..."
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
              ></textarea>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!correctionReason}
                onClick={() => {
                  requestTicketCorrection(selectedTicket.id, correctionReason);
                  setShowCorrectionModal(false);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 px-4 rounded-lg shadow disabled:opacity-50"
              >
                Request Correction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MANAGER REJECTION REASON MODAL ===================== */}
      {showRejectionModal && selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border text-xs space-y-4 animate-in zoom-in duration-150">
            <h3 className="font-extrabold text-slate-900 text-rose-600 border-b pb-2">Disqualify/Reject Buyback Ticket</h3>
            <div>
              <label className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1">Permanent Rejection Reason Notes *</label>
              <textarea
                rows={3}
                required
                placeholder="Log why the buyback purchase is being rejected (Fake stamp, customer documentation failure, stolen risk audit)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-rose-50/50 border border-rose-100 rounded-lg p-2.5 focus:outline-none focus:border-rose-500"
              ></textarea>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowRejectionModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!rejectionReason}
                onClick={() => {
                  rejectTicket(selectedTicket.id, activeStaff?.id || "st-mgr-1", activeStaff?.name || "Priyah Patel", rejectionReason);
                  setShowRejectionModal(false);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-black py-2 px-4 rounded-lg shadow disabled:opacity-50"
              >
                Disqualify Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== COMPLETED TAX INVOICE DOWNLOADER/PRINT PREVIEW MODAL ===================== */}
      {showInvoiceTicket && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 text-xs text-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0">
            
            {/* Invoice Print frame */}
            <div className="space-y-6">
              
              {/* Header Invoice banner */}
              <div className="flex justify-between items-start border-b pb-5 border-slate-200">
                <div>
                  <div className="text-[13px] font-black tracking-tight bg-slate-900 text-amber-400 px-3 py-1.5 rounded inline-block">
                    SENDRA GOLD SHOWROOM
                  </div>
                  <h4 className="text-[11px] text-slate-400 mt-2 font-mono">
                    Official Gold Acquisition &amp; Buyback Invoice
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    GSTIN Ref No: 27AASCS3940P2Z8 &bull; Licensed Bullion Dealer
                  </p>
                </div>
                <div className="text-right font-mono text-[10.5px]">
                  <div className="font-black text-slate-900 text-md">TAX INVOICE</div>
                  <div>Invoice: <span className="font-extrabold text-slate-800">{showInvoiceTicket.invoiceUrl || `INV-${showInvoiceTicket.id}`}</span></div>
                  <div>Date: {new Date(showInvoiceTicket.updatedAt).toLocaleDateString()}</div>
                  <div className="text-emerald-600 font-extrabold">STATUS: PAID &amp; SETTLED</div>
                </div>
              </div>

              {/* Branch/Customer details block */}
              <div className="grid grid-cols-2 gap-6 text-[10.5px] border-b pb-5 border-slate-100">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">DEALER FROM SHOWROOM:</span>
                  <div className="font-bold text-slate-800">{showInvoiceTicket.branchName}</div>
                  <div className="text-slate-500 leading-tight">
                    {branches.find((b) => b.id === showInvoiceTicket.branchId)?.address || "Turner Road, Mumbai"}
                  </div>
                  <div className="text-slate-400">Counter Desk assigned: {showInvoiceTicket.executiveName}</div>
                </div>

                <div className="space-y-1 text-right">
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">ACQUISITION CUSTOMER (SELLER):</span>
                  <div className="font-bold text-slate-800">{showInvoiceTicket.customerName}</div>
                  <div className="text-slate-500">Contact: {showInvoiceTicket.customerPhone}</div>
                  <div className="text-slate-400">
                    Aadhaar Record: {showInvoiceTicket.kycDocs?.aadhaarNumber ? maskSensitiveValue(showInvoiceTicket.kycDocs.aadhaarNumber, 4) : "VERIFIED DESK_SCAN"}
                  </div>
                </div>
              </div>

              {/* Invoice math items ledger */}
              <div className="space-y-3">
                <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">ASSAY EVALUATION REPORT LEDGER</span>
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 font-bold font-sans">
                      <th className="py-2 px-3 rounded-l">SPECTROSCOPY PURITY</th>
                      <th className="py-2 px-3 text-right">GROSS WEIGHT</th>
                      <th className="py-2 px-3 text-right">WASTE DEDUCT</th>
                      <th className="py-2 px-3 text-right">NET WT (g)</th>
                      <th className="py-2 px-3 text-right">LIVE BUYBACK (1g)</th>
                      <th className="py-2 px-3 text-right rounded-r">LINE TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 font-bold text-slate-800 text-[11.5px]">
                      <td className="py-3.5 px-3">
                        {showInvoiceTicket.goldPurity} Fine Gold Standard
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {showInvoiceTicket.netWeight.toFixed(2)}g
                      </td>
                      <td className="py-3.5 px-3 text-right text-rose-500">
                        -{showInvoiceTicket.deductions.toFixed(2)}g
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {(showInvoiceTicket.netWeight - showInvoiceTicket.deductions).toFixed(2)}g
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        ₹{showInvoiceTicket.liveBuybackRateApplied}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-slate-900 text-[12px]">
                        {formatCurrency(showInvoiceTicket.payoutAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Assay checklist tags */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5">
                <div className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider">DECENTRALIZED ASSAY NOTES &amp; COMPLIANCE LOGS:</div>
                <p className="text-[10.5px] font-serif italic text-slate-600 leading-relaxed mt-1">
                  "{showInvoiceTicket.deductionNotes || "Gold purity spectrum tested and verified via computerized density spectrograph. Aadhaar and PAN documents verified against live desk photograph. Authorization signed digitally."}"
                </p>
                <div className="text-[9px] text-slate-400 font-mono mt-3 uppercase font-semibold flex flex-wrap gap-x-4 gap-y-1 border-t pt-2.5">
                  <span>Manager Approved: {showInvoiceTicket.managerName || "System Chief"}</span>
                  <span>IP/Terminal: Mumbai-ST-402</span>
                  <span>Encrypted Crypt: SHA256/AES_REST</span>
                </div>
              </div>

              {/* Total payout */}
              <div className="flex justify-between items-center bg-slate-900 text-white p-4.5 rounded-2xl">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">TOTAL PAID OUT SUM TO CUSTOMER:</div>
                  <div className="text-[10.5px] text-amber-400 font-serif font-semibold italic mt-0.5">Rupees {showInvoiceTicket.payoutAmount.toLocaleString("en-IN")} Only.</div>
                </div>
                <span className="text-xl font-mono font-black text-emerald-400">
                  {formatCurrency(showInvoiceTicket.payoutAmount)}
                </span>
              </div>
            </div>

            {/* Print trigger tools */}
            <div className="pt-4 flex gap-2.5 justify-end border-t border-slate-100 print:hidden">
              <button
                type="button"
                onClick={() => setShowInvoiceTicket(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-xl transition-all"
              >
                Close Receipt
              </button>
              
              <button
                type="button"
                onClick={() => handlePrintDocument(showInvoiceTicket.id)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold py-2.5 px-5 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4 text-amber-500" />
                <span>Print Official Tax Invoice Bill</span>
              </button>
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
