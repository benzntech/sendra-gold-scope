/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { usePlatform } from "../context/PlatformContext";
import { 
  Coins,
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  RefreshCw, 
  Users, 
  MapPin, 
  Sparkles,
  ShoppingBag,
  History,
  TrendingUp
} from "lucide-react";
import { UserRole } from "../types";

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentStaffId,
    setCurrentStaffId,
    assignedBranchId,
    setAssignedBranchId,
    goldRates,
    rateTickerSeconds,
    isOnline,
    setIsOnline,
    branches,
    staffUsers,
    cart,
    logAction
  } = usePlatform();

  // Get active staff details
  const activeStaff = staffUsers.find((s) => s.id === currentStaffId);
  const currentBranchName = branches.find((b) => b.id === (currentRole === "admin" ? "" : assignedBranchId))?.name || "All Branches";

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white shadow-xl border-b border-white/10">
      {/* 1. Global Simulation Testing Banner */}
      <div className="bg-[#1E293B] border-b border-slate-800 py-1.5 px-4 text-white font-medium text-xs flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span className="font-semibold text-[11px] tracking-wide uppercase">V1.0 PROVING GROUND &bull; ACTIVE SIMULATED ROLES</span>
        </div>
        
        {/* Role Quick Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-[10px] tracking-wider uppercase font-bold flex items-center gap-1">
            <Users className="w-3 h-3 text-gold" /> Simulate Role:
          </span>
          <div className="flex bg-slate-950/40 rounded p-0.5 border border-white/10">
            {[
              { id: "customer", label: "Public Customer" },
              { id: "executive", label: "Counter Executive" },
              { id: "manager", label: "Branch Manager" },
              { id: "admin", label: "Super Admin" }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setCurrentRole(r.id as UserRole);
                  if (r.id === "executive") {
                    setCurrentStaffId("st-exec-1");
                    setAssignedBranchId("br-mumbai");
                  } else if (r.id === "manager") {
                    setCurrentStaffId("st-mgr-1");
                    setAssignedBranchId("br-mumbai");
                  } else if (r.id === "admin") {
                    setCurrentStaffId("st-admin");
                  }
                }}
                className={`px-2 py-0.5 rounded text-[10.5px] font-semibold transition-all ${
                  currentRole === r.id
                    ? "bg-gold text-[#0F172A] shadow-sm font-bold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* If staff, show branch/staff switcher to simulate multiple agents */}
          {(currentRole === "executive" || currentRole === "manager") && (
            <div className="flex items-center gap-1.5 bg-slate-950/20 px-2 py-0.5 rounded border border-white/15 text-[10.5px]">
              <span className="text-white/80 font-medium">Identity:</span>
              <select
                value={currentStaffId}
                onChange={(e) => {
                  const sId = e.target.value;
                  setCurrentStaffId(sId);
                  const selected = staffUsers.find((su) => su.id === sId);
                  if (selected?.branchId) {
                    setAssignedBranchId(selected.branchId);
                  }
                }}
                className="bg-slate-900 text-gold font-bold border-none outline-none cursor-pointer py-0 rounded"
              >
                {staffUsers
                  .filter((su) => su.role === currentRole && su.status === "active")
                  .map((su) => (
                    <option key={su.id} value={su.id}>
                      {su.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>
 
      {/* 2. Main Brand Navbar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#C5A059] flex items-center justify-center border border-white/10 shadow-md">
            <span className="font-extrabold text-[#0F172A] text-xl tracking-tighter">S</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-lg leading-tight tracking-tight text-white">
                SENDRA GOLD
              </span>
              <span className="text-[10px] text-gold font-extrabold uppercase bg-gold/10 border border-gold/30 px-1.5 py-0.5 rounded font-mono">
                V1.0 HYBRID
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold leading-tight">Hybrid Ecommerce &amp; Buyback Platform</p>
          </div>
        </div>

        {/* 3. Real-Time Price Ticker */}
        <div className="flex items-center gap-4 bg-slate-950/60 rounded px-3.5 py-1.5 border border-slate-800/80 text-xs w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 text-gold pr-3 border-r border-slate-800">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-bold tracking-wider uppercase text-[10px]">GOLD PRICES (1g):</span>
          </div>
          
          <div className="flex gap-4 font-mono select-none">
            <div className="flex flex-col">
              <div className="text-[9px] text-slate-500 uppercase font-semibold">24K Sell/Buy</div>
              <div className="font-bold text-emerald-400 flex items-center gap-1">
                {formatCurrency(goldRates.sell24K)} <span className="text-slate-400">/</span> {formatCurrency(goldRates.buy24K)}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-[9px] text-slate-500 uppercase font-semibold">22K Sell/Buy</div>
              <div className="font-bold text-gold-light">
                {formatCurrency(goldRates.sell22K)} <span className="text-slate-400">/</span> {formatCurrency(goldRates.buy22K)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 py-1 px-2 rounded font-mono text-[10.5px] text-slate-400 ml-1">
            <RefreshCw className={`w-2.5 h-2.5 ${goldRates.isOverride ? "" : "animate-spin"}`} />
            <span>
              {goldRates.isOverride ? (
                <span className="text-red-400 text-[9px] font-bold uppercase">Manual Override</span>
              ) : (
                `Sync: ${rateTickerSeconds}s`
              )}
            </span>
          </div>
        </div>

        {/* 4. Connectivity and Context Details */}
        <div className="flex items-center gap-3.5">
          {/* Network Connection Toggle Simulator */}
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              logAction(
                "CONNECTIVITY_TOGGLE",
                `Showroom Terminal connection switched to ${!isOnline ? "CENTRAL CLOUD ONLINE" : "LOCAL CACHE OFFLINE mode"}`
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold text-xs transition-all ${
              isOnline
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 animate-bounce" />
                <span>Showroom Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 animate-pulse" />
                <span>Offline Form Cache</span>
              </>
            )}
          </button>

          {/* Active Context Label */}
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              {currentRole === "customer" ? "Active App View" : "Authenticated CRM Workspace"}
            </span>
            <span className="text-xs font-semibold text-white">
              {currentRole === "customer" && "Public Ecomm Store"}
              {currentRole === "admin" && "Rajesh Sendra (Master)"}
              {currentRole === "executive" && `${activeStaff?.name || "Counter"}`}
              {currentRole === "manager" && `${activeStaff?.name || "Manager"}`}
            </span>
            {currentRole !== "customer" && currentRole !== "admin" && (
              <span className="text-[9px] font-mono text-gold flex items-center justify-end gap-1 font-bold">
                <MapPin className="w-2 h-2" /> {currentBranchName}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
