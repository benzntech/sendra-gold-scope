/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  Branch,
  StaffUser,
  GoldRates,
  BuybackTicket,
  Order,
  AuditLogEntry,
  CartItem,
  UserRole
} from "../types";
import {
  INITIAL_GOLD_RATES,
  INITIAL_BRANCHES,
  INITIAL_STAFF,
  INITIAL_PRODUCTS,
  INITIAL_TICKETS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS
} from "../data/initialData";
import { encryptKYCData } from "../lib/encryption";

interface PlatformContextProps {
  // Authentication & Session Simulator
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentStaffId: string;
  setCurrentStaffId: (id: string) => void;
  assignedBranchId: string;
  setAssignedBranchId: (id: string) => void;
  staffUsers: StaffUser[];
  addStaffUser: (user: StaffUser) => void;
  updateStaffStatus: (id: string, status: "active" | "inactive") => void;

  // Internet connectivity state
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  offlineQueue: BuybackTicket[];
  syncOfflineData: () => void;

  // Branch Master data
  branches: Branch[];
  addBranch: (branch: Branch) => void;
  updateBranchStatus: (id: string, status: "active" | "inactive") => void;

  // Gold rate management
  goldRates: GoldRates;
  updateGoldRates: (newRates: Partial<GoldRates>) => void;
  rateTickerSeconds: number; // 2 minutes countdown
  setRateTickerSeconds: React.Dispatch<React.SetStateAction<number>>;

  // Ecommerce state
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void; // soft delete / inactive
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  wishlist: string[]; // array of product IDs
  toggleWishlist: (productId: string) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus" | "trackingNumber" | "goldRateAtPurchase">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"], paymentStatus: Order["paymentStatus"]) => void;

  // Buyback Ticket operations
  tickets: BuybackTicket[];
  bookAppointment: (ticket: Omit<BuybackTicket, "id" | "status" | "createdAt" | "updatedAt" | "invoiceGenerated">) => BuybackTicket;
  updateTicketKYC: (ticketId: string, kycFields: Partial<BuybackTicket["kycDocs"]> & { aadhaarNumber?: string; panNumber?: string }) => void;
  updateTicketGoldDetails: (ticketId: string, purity: "24K" | "22K" | "18K", weight: number, deductions: number, notes: string) => void;
  submitTicketForApproval: (ticketId: string) => void;
  approveTicket: (ticketId: string, managerId: string, managerName: string) => void;
  rejectTicket: (ticketId: string, managerId: string, managerName: string, reason: string) => void;
  requestTicketCorrection: (ticketId: string, reason: string) => void;
  completeBuybackTransaction: (ticketId: string) => void;
  addWalkInTicket: (ticket: Omit<BuybackTicket, "id" | "status" | "createdAt" | "updatedAt" | "invoiceGenerated">) => BuybackTicket;

  // Immutability audit logging
  auditLogs: AuditLogEntry[];
  logAction: (action: string, details: string) => void;
  clearAllLocalData: () => void;
}

const PlatformContext = createContext<PlatformContextProps | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live State populated from localStorage or Seed Defaults
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem("sg_role") as UserRole) || "customer";
  });
  const [currentStaffId, setCurrentStaffId] = useState<string>(() => {
    return localStorage.getItem("sg_staff_id") || "st-exec-1";
  });
  const [assignedBranchId, setAssignedBranchId] = useState<string>(() => {
    return localStorage.getItem("sg_branch_id") || "br-mumbai";
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem("sg_branches");
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => {
    const saved = localStorage.getItem("sg_staff");
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [goldRates, setGoldRates] = useState<GoldRates>(() => {
    const saved = localStorage.getItem("sg_rates");
    return saved ? JSON.parse(saved) : INITIAL_GOLD_RATES;
  });

  const [rateTickerSeconds, setRateTickerSeconds] = useState(120);

  const [isOnline, setIsOnline] = useState(true);

  const [offlineQueue, setOfflineQueue] = useState<BuybackTicket[]>(() => {
    const saved = localStorage.getItem("sg_offline_queue");
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("sg_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("sg_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("sg_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("sg_orders");
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [tickets, setTickets] = useState<BuybackTicket[]>(() => {
    const saved = localStorage.getItem("sg_tickets");
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem("sg_audit_logs");
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Sync state with localStorage on any changes
  useEffect(() => {
    localStorage.setItem("sg_role", currentRole);
    localStorage.setItem("sg_staff_id", currentStaffId);
    localStorage.setItem("sg_branch_id", assignedBranchId);
  }, [currentRole, currentStaffId, assignedBranchId]);

  useEffect(() => {
    localStorage.setItem("sg_branches", JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem("sg_staff", JSON.stringify(staffUsers));
  }, [staffUsers]);

  useEffect(() => {
    localStorage.setItem("sg_rates", JSON.stringify(goldRates));
  }, [goldRates]);

  useEffect(() => {
    localStorage.setItem("sg_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("sg_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("sg_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("sg_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("sg_tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem("sg_offline_queue", JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  useEffect(() => {
    localStorage.setItem("sg_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Simulated live gold price updates every 2 minutes (120 seconds)
  useEffect(() => {
    if (goldRates.isOverride) return;

    const timer = setInterval(() => {
      setRateTickerSeconds((prev) => {
        if (prev <= 1) {
          // Trigger fluctuation
          setGoldRates((oldRates) => {
            const shiftPercent = (Math.random() - 0.5) * 0.008; // Fluctuate max 0.8%
            const d24K_sell = Math.round(oldRates.sell24K * (1 + shiftPercent));
            const d24K_buy = Math.round(oldRates.buy24K * (1 + shiftPercent * 0.95));

            const rates: GoldRates = {
              sell24K: d24K_sell,
              buy24K: d24K_buy,
              sell22K: Math.round(d24K_sell * 0.916),
              buy22K: Math.round(d24K_buy * 0.916),
              sell18K: Math.round(d24K_sell * 0.75),
              buy18K: Math.round(d24K_buy * 0.75),
              lastUpdated: new Date().toISOString(),
              isOverride: false,
            };
            
            // Add system log entry silently or visibly
            logActionSystem("SYSTEM_RATE_TICK", `Live Gold rates ticked. New 24K Sell: ${d24K_sell}/g, Buy: ${d24K_buy}/g`);
            return rates;
          });
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [goldRates.isOverride]);

  // Auto synchronise offline transactions when connection returns
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      syncOfflineData();
    }
  }, [isOnline]);

  // Private audit logging helper for internal ticks
  const logActionSystem = (action: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: "LOG-" + Math.floor(100000 + Math.random() * 900000),
      userId: "system",
      userName: "Automated Price Engine",
      userRole: "admin",
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Public/Staff audit logging function
  const logAction = (action: string, details: string) => {
    let uId = "cust-public";
    let uName = "Public Customer";
    let uRole: UserRole = "customer";

    if (currentRole !== "customer") {
      const activeStaff = staffUsers.find((s) => s.id === currentStaffId);
      if (activeStaff) {
        uId = activeStaff.id;
        uName = activeStaff.name;
        uRole = activeStaff.role;
      } else if (currentRole === "admin") {
        uId = "st-admin";
        uName = "Rajesh Sendra (Master Admin)";
        uRole = "admin";
      }
    }

    const newEntry: AuditLogEntry = {
      id: "LOG-" + Math.floor(100000 + Math.random() * 900000),
      userId: uId,
      userName: uName,
      userRole: uRole,
      action,
      details,
      timestamp: new Date().toISOString(),
    };

    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Sync the Offline Queue
  const syncOfflineData = () => {
    if (offlineQueue.length === 0) return;

    setTickets((prev) => {
      // Find matches or append
      const updated = [...prev];
      offlineQueue.forEach((offTicket) => {
        const idx = updated.findIndex((t) => t.id === offTicket.id);
        const syncedTicket = {
          ...offTicket,
          notes: (offTicket.notes || "") + " [Synced online at " + new Date().toLocaleTimeString() + "]",
        };
        if (idx > -1) {
          updated[idx] = syncedTicket;
        } else {
          updated.push(syncedTicket);
        }
      });
      return updated;
    });

    logAction("OFFLINE_SYNC", `Synchronised ${offlineQueue.length} offline buyback records with central secure cloud rest database.`);
    setOfflineQueue([]);
  };

  const updateGoldRates = (newRates: Partial<GoldRates>) => {
    setGoldRates((prev) => {
      const updated = {
        ...prev,
        ...newRates,
        lastUpdated: new Date().toISOString(),
        isOverride: newRates.isOverride !== undefined ? newRates.isOverride : true,
      };
      
      // Calculate smaller Karats based on 24K if not manually provided
      if (newRates.sell24K || newRates.buy24K) {
        const s24 = newRates.sell24K || prev.sell24K;
        const b24 = newRates.buy24K || prev.buy24K;
        updated.sell22K = Math.round(s24 * 0.916);
        updated.buy22K = Math.round(b24 * 0.916);
        updated.sell18K = Math.round(s24 * 0.75);
        updated.buy18K = Math.round(b24 * 0.75);
      }

      return updated;
    });

    logAction("RATES_UPDATE", `Gold prices updated manually. 24K Sell: ${newRates.sell24K || goldRates.sell24K}, 24K Buy: ${newRates.buy24K || goldRates.buy24K}`);
  };

  // Manage Branches
  const addBranch = (branch: Branch) => {
    setBranches((prev) => [...prev, branch]);
    logAction("BRANCH_CREATED", `Created new branch "${branch.name}" in ${branch.city}`);
  };

  const updateBranchStatus = (id: string, status: "active" | "inactive") => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    const branch = branches.find((b) => b.id === id);
    logAction("BRANCH_STATUS_CHANGE", `Branch "${branch?.name}" set to ${status}`);
  };

  // Manage Staff Users
  const addStaffUser = (user: StaffUser) => {
    setStaffUsers((prev) => [...prev, user]);
    logAction("STAFF_CREATED", `Added staff account "${user.name}" with role "${user.role}"`);
  };

  const updateStaffStatus = (id: string, status: "active" | "inactive") => {
    setStaffUsers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    const staff = staffUsers.find((s) => s.id === id);
    logAction("STAFF_STATUS_CHANGE", `Staff username "${staff?.name}" set to ${status}`);
  };

  // Product Catalogue management
  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
    logAction("PRODUCT_CREATED", `Product "${product.name}" created at ${product.weight}g base styling weight.`);
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    logAction("PRODUCT_UPDATED", `Product ${product.id} ("${product.name}") updated in administrative records.`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "inactive" as const } : p))
    );
    const prod = products.find((p) => p.id === id);
    logAction("PRODUCT_DEACTIVATED", `Product ${id} ("${prod?.name}") marked as disabled / inactive.`);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Cart
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Create order
  const createOrder = (orderData: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus" | "trackingNumber" | "goldRateAtPurchase">) => {
    const orderId = "SG-ORD-" + Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = "FEDEX-SG-" + Math.floor(1000000 + Math.random() * 9000000);

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      goldRateAtPurchase: goldRates.sell24K,
      status: "pending",
      paymentStatus: "paid", // Web simulation processes payment on confirmation
      createdAt: new Date().toISOString(),
      trackingNumber,
    };

    setOrders((prev) => [newOrder, ...prev]);
    logAction("ECOMMERCE_CHECKOUT", `Order ${orderId} created successfully for customer ${orderData.customerName}. Sum order: INR ${orderData.totalAmount}`);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"], paymentStatus: Order["paymentStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, paymentStatus } : o))
    );
    logAction("ORDER_STATUS_MODIFIED", `Order ${orderId} administrative change: Status to "${status}", Payment to "${paymentStatus}"`);
  };

  // Buyback Ticket operations
  const bookAppointment = (ticket: Omit<BuybackTicket, "id" | "status" | "createdAt" | "updatedAt" | "invoiceGenerated">) => {
    const tId = "SG-BB-" + Math.floor(3000 + Math.random() * 6999);
    const newTicket: BuybackTicket = {
      ...ticket,
      id: tId,
      status: "appointment_booked",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      invoiceGenerated: false,
    };

    setTickets((prev) => [newTicket, ...prev]);
    logAction("APPOINTMENT_BOOKED", `Appointment ${tId} scheduled for Customer ${ticket.customerName} on ${ticket.appointmentDate} at branch "${ticket.branchName}"`);
    return newTicket;
  };

  // Add instant Walk-in booking from counter executive console
  const addWalkInTicket = (ticket: Omit<BuybackTicket, "id" | "status" | "createdAt" | "updatedAt" | "invoiceGenerated">) => {
    const tId = "SG-BB-WI-" + Math.floor(1000 + Math.random() * 8999);
    const newTicket: BuybackTicket = {
      ...ticket,
      id: tId,
      status: "kyc_pending", // Instantly ready for KYC
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      invoiceGenerated: false,
    };

    if (isOnline) {
      setTickets((prev) => [newTicket, ...prev]);
    } else {
      setOfflineQueue((prev) => [newTicket, ...prev]);
    }

    logAction("WALK_IN_CREATED", `Walk-in customer ticket "${tId}" generated by Counter Staff.`);
    return newTicket;
  };

  const updateTicketKYC = (ticketId: string, kycFields: Partial<BuybackTicket["kycDocs"]> & { aadhaarNumber?: string; panNumber?: string }) => {
    const updater = (prevTickets: BuybackTicket[]) =>
      prevTickets.map((t) => {
        if (t.id === ticketId) {
          const currentDocs = t.kycDocs || { encrypted: false };
          // Encrypt uploaded documents visually
          const encryptedAadhaar = kycFields.aadhaarUrl ? encryptKYCData(kycFields.aadhaarUrl) : currentDocs.aadhaarUrl;
          const encryptedPan = kycFields.panUrl ? encryptKYCData(kycFields.panUrl) : currentDocs.panUrl;
          const encryptedPhoto = kycFields.customerPhotoUrl ? encryptKYCData(kycFields.customerPhotoUrl) : currentDocs.customerPhotoUrl;

          return {
            ...t,
            status: "testing_pending" as const, // move to golden purity testing step
            kycDocs: {
              aadhaarNumber: kycFields.aadhaarNumber || currentDocs.aadhaarNumber,
              panNumber: kycFields.panNumber || currentDocs.panNumber,
              aadhaarUrl: encryptedAadhaar,
              panUrl: encryptedPan,
              customerPhotoUrl: encryptedPhoto,
              encrypted: true,
              encryptedAt: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });

    if (isOnline) {
      setTickets((prev) => updater(prev));
    } else {
      // Offline queue update
      setOfflineQueue((prev) => {
        const exists = prev.some((o) => o.id === ticketId);
        if (exists) {
          return prev.map((t) => (t.id === ticketId ? updater([t])[0] : t));
        } else {
          // If not in offline queue yet (pre-booked online), search in central tickets, clone & edit offline
          const found = tickets.find((t) => t.id === ticketId);
          if (found) {
            return [...prev, updater([found])[0]];
          }
        }
        return prev;
      });
      // also update state so display is correct
      setTickets((prev) => updater(prev));
    }

    logAction("KYC_COMPLETED", `KYC documents verified and securely encrypted at rest for ticket ${ticketId}.`);
  };

  const updateTicketGoldDetails = (ticketId: string, purity: "24K" | "22K" | "18K", weight: number, deductions: number, notes: string) => {
    // Determine the payout buyback price based on selected purity
    let rate = goldRates.buy24K;
    if (purity === "22K") rate = goldRates.buy22K;
    if (purity === "18K") rate = goldRates.buy18K;

    // final value: (nett weight - deductions) * rate
    const finalPayout = Math.max(0, Math.round((weight - deductions) * rate));

    const updater = (prevTickets: BuybackTicket[]) =>
      prevTickets.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            goldPurity: purity,
            netWeight: weight,
            deductions,
            deductionNotes: notes,
            liveBuybackRateApplied: rate,
            payoutAmount: finalPayout,
            status: "approval_pending" as const, // now locked and submitted for approval
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });

    if (isOnline) {
      setTickets((prev) => updater(prev));
    } else {
      setOfflineQueue((prev) => {
        const exists = prev.some((o) => o.id === ticketId);
        if (exists) {
          return prev.map((t) => (t.id === ticketId ? updater([t])[0] : t));
        } else {
          const found = tickets.find((t) => t.id === ticketId);
          if (found) {
            return [...prev, updater([found])[0]];
          }
        }
        return prev;
      });
      setTickets((prev) => updater(prev));
    }

    logAction("BUYBACK_TESTED", `Gold purity spectrum analyzed (${purity}), Net weight: ${weight}g. Submitted for manager authorization.`);
  };

  const submitTicketForApproval = (ticketId: string) => {
    const updater = (prev: BuybackTicket[]) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "approval_pending" as const, updatedAt: new Date().toISOString() } : t));
    
    if (isOnline) {
      setTickets(updater);
    } else {
      setOfflineQueue((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status: "approval_pending" as const, updatedAt: new Date().toISOString() } : t)));
      setTickets(updater);
    }
  };

  const approveTicket = (ticketId: string, managerId: string, managerName: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: "approved",
              managerId,
              managerName,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    logAction("TICKET_APPROVED", `Manager ${managerName} approved buyback ticket ${ticketId}. Invoice is ready for printing.`);
  };

  const rejectTicket = (ticketId: string, managerId: string, managerName: string, reason: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: "rejected",
              managerId,
              managerName,
              rejectionReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    logAction("TICKET_REJECTED", `Manager ${managerName} REJECTED ticket ${ticketId}. Reason: "${reason}"`);
  };

  const requestTicketCorrection = (ticketId: string, reason: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: "testing_pending", // send back to testing step
              notes: (t.notes || "") + ` \n[CORRECTION REQUIRED by Manager: ${reason}]`,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    logAction("REVISION_REQUESTED", `Manager requested revision/re-testing on buyback ticket ${ticketId}. Feedback: "${reason}"`);
  };

  const completeBuybackTransaction = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: "completed",
              invoiceGenerated: true,
              invoiceUrl: `INV-SG-${t.id}-${Math.floor(100 + Math.random() * 899)}`,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    logAction("TRANSACTION_COMPLETED", `Payment disbursed to customer for ticket ${ticketId}. Transaction officially closed.`);
  };

  const clearAllLocalData = () => {
    localStorage.clear();
    setBranches(INITIAL_BRANCHES);
    setStaffUsers(INITIAL_STAFF);
    setProducts(INITIAL_PRODUCTS);
    setTickets(INITIAL_TICKETS);
    setOrders(INITIAL_ORDERS);
    setGoldRates(INITIAL_GOLD_RATES);
    setAuditLogs([
      {
        id: "LOG-RST",
        userId: "admin",
        userName: "System Engine",
        userRole: "admin",
        action: "DATABASE_RESET",
        details: "Clean wipe. Restored default enterprise seeded database context.",
        timestamp: new Date().toISOString(),
      },
    ]);
    setCart([]);
    setWishlist([]);
    setOfflineQueue([]);
  };

  return (
    <PlatformContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentStaffId,
        setCurrentStaffId,
        assignedBranchId,
        setAssignedBranchId,
        staffUsers,
        addStaffUser,
        updateStaffStatus,

        isOnline,
        setIsOnline,
        offlineQueue,
        syncOfflineData,

        branches,
        addBranch,
        updateBranchStatus,

        goldRates,
        updateGoldRates,
        rateTickerSeconds,
        setRateTickerSeconds,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        orders,
        createOrder,
        updateOrderStatus,

        tickets,
        bookAppointment,
        updateTicketKYC,
        updateTicketGoldDetails,
        submitTicketForApproval,
        approveTicket,
        rejectTicket,
        requestTicketCorrection,
        completeBuybackTransaction,
        addWalkInTicket,

        auditLogs,
        logAction,
        clearAllLocalData,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used within PlatformProvider");
  }
  return context;
};
