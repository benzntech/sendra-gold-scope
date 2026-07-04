/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PlatformProvider, usePlatform } from "./context/PlatformContext";
import { Header } from "./components/Header";
import { CustomerPortal } from "./components/CustomerPortal";
import { StaffPortal } from "./components/StaffPortal";
import { AdminPortal } from "./components/AdminPortal";
import { ShieldCheck, Database, RefreshCw } from "lucide-react";

function AppContent() {
  const { currentRole, clearAllLocalData } = usePlatform();

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col justify-between">
      {/* 1. Common Brand Navigation Header */}
      <Header />

      {/* 2. Main Portal Routing Workspace */}
      <main className="flex-1 animate-in fade-in duration-200">
        {currentRole === "customer" && <CustomerPortal />}
        {(currentRole === "executive" || currentRole === "manager") && <StaffPortal />}
        {currentRole === "admin" && <AdminPortal />}
      </main>

      {/* 3. High-Fidelity Security Compliance Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 md:px-6 text-xs mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="space-y-1">
            <span className="font-extrabold text-white tracking-widest text-[10px] bg-slate-950 p-1 border border-slate-800 rounded flex items-center gap-1.5 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>V1.0 CRYPTOGRAPHIC SECURITY REGISTERED</span>
            </span>
            <p className="text-[10.5px]">
              &copy; 2026 Sendra Gold Securities. All private customer KYC records (UIDAI &amp; Income Tax) encrypted 256-bit at rest.
            </p>
            <p className="text-[10px] text-slate-500">
              Approved and verified compliance guidelines. Automatic showroom offline sync queuing logs active.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action to purge demo testing changes and restore clean presets */}
            <button
              onClick={() => {
                const conf = window.confirm(
                  "Warning: This will clear all customer check-ins, custom ecommerce orders, and rate changes, restoring the initial default showroom staff database. Proceed?"
                );
                if (conf) {
                  clearAllLocalData();
                  alert("Local Platform states successfully reset to enterprise seeded configuration.");
                }
              }}
              className="flex items-center gap-1 bg-slate-950 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-all text-[11px] font-bold font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Showrooms DB</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
}

