// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo,
} from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  Users,
  Package,
  Settings,
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Target,
  Download,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
  head: () => ({
    meta: [
      { title: "Nexus — Analytics Dashboard" },
      { name: "description", content: "Premium analytics dashboard with live data, charts and insights." },
    ],
  }),
});

/* ──────────────────────────────────────────────────────────
   MOCK DATA
   ────────────────────────────────────────────────────────── */
const NAMES = [
  "Ava Chen","Liam Park","Noah Kim","Mia Rossi","Ethan Wu","Sofia Reyes","Lucas Patel","Zoe Nakamura",
  "Aiden Smirnov","Maya Singh","Leo Tanaka","Nora Ali","Owen Becker","Ivy Khan","Jonas Weiss","Ruby Cohen",
  "Kai Mueller","Eden Brooks","Theo Laurent","Luna Garcia","Felix Dubois","Hazel Lopez","Milo Andersen","Aria Iqbal",
  "Caleb Novak","Stella Romano","Jude Fischer","Iris Petrov","Asher Klein","Cleo Marin","Rhys Vargas","Nina Holm",
  "Beck Rivera","Vera Holt","Sage Bauer","Wren Ortiz","Emil Sato","Juno Park","Cyrus Mehta","Lila Bennett",
  "Otto Reinhardt","Mira Quinn","Silas Frost","Tess Avery","Knox Carter","Elia Vance","Bram Hayes","Pia Solis",
  "Reed Walsh","Yuki Mori",
];

const STATUSES = ["pending", "shipped", "delivered", "cancelled"];
const STATUS_WEIGHTS = [0.15, 0.30, 0.45, 0.10];
const CATEGORIES = ["Electronics", "Fashion", "Home", "Sports", "Beauty"];

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rand = seededRand(42);

function generateRevenueData() {
  const out = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const day = d.getDay();
    const dayIndex = 89 - i;
    const base = 8000 * (1 + dayIndex * 0.003) + (15000 - 8000) * (dayIndex / 89);
    const weekdayMult = day === 0 ? 0.5 : day === 6 ? 0.7 : 1.0;
    let revenue = base * weekdayMult * (0.85 + rand() * 0.3);
    if (dayIndex === 45) revenue = 28000;
    const orders = Math.round(revenue / (60 + rand() * 40));
    out.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: Math.round(revenue),
      orders,
    });
  }
  return out;
}

function pickStatus() {
  const r = rand();
  let acc = 0;
  for (let i = 0; i < STATUSES.length; i++) {
    acc += STATUS_WEIGHTS[i];
    if (r <= acc) return STATUSES[i];
  }
  return "delivered";
}

function pickAmount() {
  const r = rand();
  if (r < 0.7) return Math.round(40 + rand() * 160);
  if (r < 0.95) return Math.round(200 + rand() * 300);
  return Math.round(500 + rand() * 300);
}

function generateOrders() {
  const today = new Date();
  const out = [];
  for (let i = 0; i < 50; i++) {
    const dense = rand() < 0.7;
    const daysAgo = dense ? Math.floor(rand() * 30) : Math.floor(rand() * 90);
    const d = new Date(today);
    d.setDate(today.getDate() - daysAgo);
    out.push({
      id: `#NX-${(10243 + i).toString()}`,
      customer: NAMES[i % NAMES.length],
      status: pickStatus(),
      amount: pickAmount(),
      date: d.toISOString().slice(0, 10),
      daysAgo,
    });
  }
  return out;
}

const REVENUE_DATA = generateRevenueData();
const ORDERS_DATA = generateOrders();

function filterByDays(data, days) {
  return data.slice(-days);
}
function filterOrdersByDays(orders, days) {
  return orders.filter((o) => o.daysAgo < days);
}

const FAKE_NOTIFICATIONS = [
  { id: 1, title: "New order received", body: "Order #NX-10428 from Ava Chen", time: "2m ago" },
  { id: 2, title: "Payout processed", body: "$12,480 sent to your bank", time: "1h ago" },
  { id: 3, title: "Inventory alert", body: "Sneakers Pro low stock", time: "3h ago" },
  { id: 4, title: "Weekly report ready", body: "Last week summary available", time: "1d ago" },
];

/* ──────────────────────────────────────────────────────────
   CONTEXT
   ────────────────────────────────────────────────────────── */
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

/* ──────────────────────────────────────────────────────────
   HOOKS
   ────────────────────────────────────────────────────────── */
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const fromRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      const eased = easeOutExpo(p);
      setValue(fromRef.current + (target - fromRef.current) * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

/* ──────────────────────────────────────────────────────────
   STYLES INJECTION
   ────────────────────────────────────────────────────────── */
const STYLE_ID = "nexus-dashboard-styles";
const INJECTED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

.font-display { font-family: 'Syne', system-ui, sans-serif; letter-spacing: -0.02em; }
.font-body { font-family: 'DM Sans', system-ui, sans-serif; }
.nexus-root, .nexus-root * { font-family: 'DM Sans', system-ui, sans-serif; }

@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.shimmer {
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 100%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;
}

@keyframes meshMove {
  0%   { transform: translate(0,0) scale(1); }
  50%  { transform: translate(4%, -3%) scale(1.05); }
  100% { transform: translate(0,0) scale(1); }
}
.mesh-bg::before {
  content: '';
  position: absolute; inset: -20%;
  background:
    radial-gradient(circle at 20% 30%, rgba(99,102,241,0.25), transparent 45%),
    radial-gradient(circle at 80% 20%, rgba(139,92,246,0.22), transparent 50%),
    radial-gradient(circle at 60% 80%, rgba(99,102,241,0.18), transparent 50%);
  filter: blur(60px);
  animation: meshMove 18s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes livePulse {
  0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
  70%  { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
  100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
}
.live-dot { animation: livePulse 1.6s infinite; }

.nexus-root ::selection { background: rgba(99,102,241,0.45); color: #fff; }

.nexus-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.nexus-scroll::-webkit-scrollbar-track { background: transparent; }
.nexus-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(#6366f1,#8b5cf6); border-radius: 8px;
}

.glass {
  background: rgba(17,17,24,0.6);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.06);
}
.glass-strong {
  background: rgba(17,17,24,0.78);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,0.06);
}

.gradient-text {
  background: linear-gradient(135deg,#818cf8,#c4b5fd);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.noise {
  position: absolute; inset: 0;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

.flash-update {
  animation: flashBorder 1s ease-out;
}
@keyframes flashBorder {
  0% { box-shadow: 0 0 0 1px rgba(99,102,241,0.9), 0 0 24px rgba(99,102,241,0.5); }
  100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 rgba(99,102,241,0); }
}
`;

function useInjectedStyles() {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.innerHTML = INJECTED_CSS;
    document.head.appendChild(el);
    return () => {
      const node = document.getElementById(STYLE_ID);
      if (node) node.remove();
    };
  }, []);
}

/* ──────────────────────────────────────────────────────────
   PROVIDER
   ────────────────────────────────────────────────────────── */
function AppProvider({ children }) {
  const [dateRange, setDateRange] = useState(30);
  const [revenueData, setRevenueData] = useState(REVENUE_DATA);
  const [orders] = useState(ORDERS_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(FAKE_NOTIFICATIONS.length);
  const [activeUsers, setActiveUsers] = useState(1284);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const id = setInterval(() => {
      setRevenueData((prev) => {
        const next = [...prev];
        for (let i = next.length - 7; i < next.length; i++) {
          const delta = Math.random() * 500 - 250;
          next[i] = { ...next[i], revenue: Math.max(1000, Math.round(next[i].revenue + delta)) };
        }
        return next;
      });
      setActiveUsers((u) => Math.max(800, u + Math.round((Math.random() - 0.5) * 40)));
      setTick((t) => t + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [isLoading]);

  const value = useMemo(
    () => ({
      dateRange,
      setDateRange,
      revenueData,
      orders,
      isLoading,
      sidebarOpen,
      setSidebarOpen,
      notifications,
      setNotifications,
      activeUsers,
      tick,
    }),
    [dateRange, revenueData, orders, isLoading, sidebarOpen, notifications, activeUsers, tick]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* ──────────────────────────────────────────────────────────
   SIDEBAR
   ────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: 0 },
  { key: "analytics", label: "Analytics", icon: BarChart3, badge: 0 },
  { key: "orders", label: "Orders", icon: ShoppingCart, badge: 4 },
  { key: "customers", label: "Customers", icon: Users, badge: 0 },
  { key: "products", label: "Products", icon: Package, badge: 0 },
  { key: "settings", label: "Settings", icon: Settings, badge: 0 },
];

const Sidebar = memo(function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const [active, setActive] = useState("dashboard");

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative z-20 shrink-0 h-screen sticky top-0 border-r"
      style={{
        background: "#1a1a2e",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center h-16 px-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center font-display text-white text-lg shrink-0"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 6px 20px rgba(99,102,241,0.45)" }}
          >
            N
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-display text-2xl font-extrabold gradient-text whitespace-nowrap"
              >
                NEXUS
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="p-3 flex flex-col gap-1">
        {NAV_ITEMS.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => setActive(it.key)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group"
              style={{
                color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                background: isActive ? "linear-gradient(90deg, rgba(99,102,241,0.18), rgba(139,92,246,0.05))" : "transparent",
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r"
                  style={{ background: "linear-gradient(180deg,#6366f1,#8b5cf6)" }}
                />
              )}
              <span className="relative shrink-0">
                <Icon size={18} />
                {it.badge > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500" />
                    <motion.span
                      className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500"
                      animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                    />
                  </>
                )}
              </span>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="whitespace-nowrap"
                  >
                    {it.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {sidebarOpen && it.badge > 0 && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {it.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 h-9 w-9 rounded-full flex items-center justify-center glass hover:bg-white/10 transition"
      >
        <motion.span animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronLeft size={16} className="text-white/70" />
        </motion.span>
      </button>
    </motion.aside>
  );
});

/* ──────────────────────────────────────────────────────────
   NAVBAR
   ────────────────────────────────────────────────────────── */
const Navbar = memo(function Navbar({ theme, setTheme }) {
  const { sidebarOpen, setSidebarOpen, notifications, setNotifications } = useApp();
  const [open, setOpen] = useState(false);

  const onBell = useCallback(() => {
    setOpen((v) => {
      const next = !v;
      if (next) setNotifications(0);
      return next;
    });
  }, [setNotifications]);

  return (
    <header
      className="sticky top-0 z-30 h-16 px-4 md:px-6 flex items-center gap-3 glass-strong"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-white/5 text-white/70"
      >
        <Menu size={18} />
      </button>
      <div className="hidden md:flex items-center gap-2 text-sm text-white/50">
        <span>Dashboard</span>
        <ChevronRight size={14} />
        <span className="text-white">Overview</span>
      </div>

      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-md relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            placeholder="Search orders, customers, products…"
            className="w-full h-10 pl-9 pr-3 rounded-lg glass text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-white/5 text-white/70"
        title="Toggle theme"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="relative">
        <button
          onClick={onBell}
          className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-white/5 text-white/70 relative"
        >
          <Bell size={16} />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] font-semibold rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-80 rounded-xl glass-strong p-2 shadow-2xl"
            >
              <div className="px-3 py-2 text-xs uppercase tracking-wider text-white/50">Notifications</div>
              {FAKE_NOTIFICATIONS.map((n) => (
                <div key={n.id} className="p-3 rounded-lg hover:bg-white/5 cursor-pointer">
                  <div className="text-sm text-white font-medium">{n.title}</div>
                  <div className="text-xs text-white/60 mt-0.5">{n.body}</div>
                  <div className="text-[10px] text-white/40 mt-1">{n.time}</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold text-white"
        style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
      >
        AK
      </div>
    </header>
  );
});

/* ──────────────────────────────────────────────────────────
   DATE FILTER
   ────────────────────────────────────────────────────────── */
function DateFilter() {
  const { dateRange, setDateRange } = useApp();
  const opts = [7, 30, 90];
  return (
    <div className="inline-flex glass rounded-xl p-1 gap-1 relative">
      {opts.map((d) => {
        const active = dateRange === d;
        return (
          <button
            key={d}
            onClick={() => setDateRange(d)}
            className="relative px-4 py-1.5 text-xs font-semibold rounded-lg z-10"
            style={{ color: active ? "#fff" : "rgba(255,255,255,0.55)" }}
          >
            {active && (
              <motion.span
                layoutId="date-pill"
                className="absolute inset-0 rounded-lg -z-10"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  boxShadow: "0 6px 20px rgba(99,102,241,0.45)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {d}D
          </button>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   SPARKLINE
   ────────────────────────────────────────────────────────── */
function Sparkline({ values, color = "#a78bfa" }) {
  const w = 80, h = 28, p = 2;
  if (!values || values.length === 0) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = p + (i * (w - 2 * p)) / (values.length - 1);
    const y = h - p - ((v - min) / span) * (h - 2 * p);
    return [x, y];
  });
  const d = pts.map((pt, i) => (i === 0 ? `M${pt[0]},${pt[1]}` : `L${pt[0]},${pt[1]}`)).join(" ");
  return (
    <svg width={w} height={h}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────
   KPI CARD
   ────────────────────────────────────────────────────────── */
const KPICard = memo(function KPICard({ icon: Icon, label, value, prefix = "", suffix = "", delta, sparkValues, index, live, format }) {
  const animated = useCountUp(value, 1200);
  const display = format ? format(animated) : Math.round(animated).toLocaleString();
  const up = delta >= 0;
  const [flash, setFlash] = useState(false);
  const firstRef = useRef(true);

  useEffect(() => {
    if (firstRef.current) { firstRef.current = false; return; }
    if (!live) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 900);
    return () => clearTimeout(t);
  }, [value, live]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(99,102,241,0.3)" }}
      className={`glass rounded-2xl p-5 relative overflow-hidden ${flash ? "flash-update" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/50 font-medium flex items-center gap-2">
            {label}
            {live && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 live-dot" />}
          </div>
          <div className="font-display text-3xl font-bold text-white mt-2">
            {prefix}{display}{suffix}
          </div>
        </div>
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))", border: "1px solid rgba(139,92,246,0.3)" }}
        >
          <Icon size={18} className="text-violet-200" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className={`flex items-center gap-1 text-xs font-semibold ${up ? "text-emerald-400" : "text-rose-400"}`}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {up ? "+" : ""}{delta.toFixed(1)}%
          <span className="text-white/40 font-normal ml-1">vs prev</span>
        </div>
        <Sparkline values={sparkValues} color={up ? "#a78bfa" : "#fb7185"} />
      </div>
    </motion.div>
  );
});

/* ──────────────────────────────────────────────────────────
   CHART TOOLTIP
   ────────────────────────────────────────────────────────── */
function GlassTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <div className="text-white/60 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-white">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="font-semibold">
            {typeof p.value === "number" ? `$${p.value.toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   CHARTS
   ────────────────────────────────────────────────────────── */
const ChartSection = memo(function ChartSection() {
  const { revenueData, orders, dateRange } = useApp();
  const filteredRev = useMemo(() => filterByDays(revenueData, dateRange), [revenueData, dateRange]);
  const filteredOrders = useMemo(() => filterOrdersByDays(orders, dateRange), [orders, dateRange]);

  const categoryData = useMemo(() => {
    return CATEGORIES.map((cat, i) => {
      const total = filteredOrders.reduce((acc, o, idx) => acc + ((idx % 5 === i) ? o.amount : 0), 0);
      return { category: cat, value: total };
    });
  }, [filteredOrders]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-2xl p-5 lg:col-span-2"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Revenue Over Time</h3>
            <p className="text-xs text-white/50">Last {dateRange} days</p>
          </div>
          <div className="flex items-center gap-2 text-xs px-2 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 live-dot" />
            LIVE
          </div>
        </div>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart key={dateRange} data={filteredRev} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<GlassTooltip />} cursor={{ stroke: "rgba(139,92,246,0.3)" }} />
              <Area type="monotone" dataKey="revenue" stroke="url(#revStroke)" strokeWidth={2.5} fill="url(#revFill)" animationDuration={800} dot={false} activeDot={{ r: 5, fill: "#a78bfa", stroke: "#fff", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-2xl p-5"
      >
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-white">Orders by Category</h3>
          <p className="text-xs text-white/50">Revenue split</p>
        </div>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart key={dateRange} data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="category" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(139,92,246,0.06)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={800}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill="url(#barG)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
});

/* ──────────────────────────────────────────────────────────
   TABLE
   ────────────────────────────────────────────────────────── */
const STATUS_STYLES = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  shipped: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  delivered: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

function DataTable() {
  const { orders, dateRange } = useApp();
  const [sortCol, setSortCol] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const base = filterOrdersByDays(orders, dateRange);
    return filterStatus === "all" ? base : base.filter((o) => o.status === filterStatus);
  }, [orders, dateRange, filterStatus]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const A = a[sortCol], B = b[sortCol];
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const slice = sorted.slice(start, start + pageSize);

  useEffect(() => { setPage(1); }, [filterStatus, dateRange]);

  const toggleSort = useCallback((col) => {
    setSortCol((prev) => {
      if (prev === col) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("asc");
      return col;
    });
  }, []);

  const exportCSV = useCallback(() => {
    const header = ["id", "customer", "status", "amount", "date"];
    const rows = sorted.map((o) => header.map((h) => o[h]).join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "orders.csv";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }, [sorted]);

  const cols = [
    { key: "id", label: "Order" },
    { key: "customer", label: "Customer" },
    { key: "status", label: "Status" },
    { key: "amount", label: "Amount" },
    { key: "date", label: "Date" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-5">
        <div>
          <h3 className="font-display text-lg font-bold text-white">Recent Orders</h3>
          <p className="text-xs text-white/50">Sortable, filterable, exportable</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="glass text-sm text-white rounded-lg px-3 py-2 outline-none border-0 cursor-pointer"
            style={{ colorScheme: "dark" }}
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 text-sm text-white px-3 py-2 rounded-lg"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 6px 20px rgba(99,102,241,0.4)" }}
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto nexus-scroll">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 glass-strong">
            <tr>
              {cols.map((c) => (
                <th
                  key={c.key}
                  onClick={() => toggleSort(c.key)}
                  className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-white/55 font-semibold cursor-pointer select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    {sortCol === c.key && (
                      <motion.span animate={{ rotate: sortDir === "asc" ? 0 : 180 }} transition={{ duration: 0.2 }}>
                        <ChevronUp size={12} />
                      </motion.span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {slice.map((row, i) => (
                <motion.tr
                  key={row.id + filterStatus + sortCol + sortDir + safePage}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="group border-t hover:bg-white/[0.03] cursor-pointer"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <td className="px-5 py-3 text-white/80 font-mono text-xs relative">
                    <span className="absolute left-0 top-0 bottom-0 w-[2px] scale-y-0 group-hover:scale-y-100 transition-transform"
                          style={{ background: "linear-gradient(180deg,#6366f1,#8b5cf6)" }} />
                    {row.id}
                  </td>
                  <td className="px-5 py-3 text-white/90">{row.customer}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold uppercase tracking-wider ${STATUS_STYLES[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-white font-semibold">${row.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-white/60">{row.date}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="text-xs text-white/50">
          Showing <span className="text-white">{sorted.length === 0 ? 0 : start + 1}</span>–<span className="text-white">{Math.min(start + pageSize, sorted.length)}</span> of <span className="text-white">{sorted.length}</span> results
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(Math.max(1, safePage - 1))} className="px-2 py-1 rounded-md glass text-white/70 hover:text-white disabled:opacity-40" disabled={safePage === 1}>
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
            const n = i + 1;
            const active = n === safePage;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="px-3 py-1 rounded-md text-xs font-semibold"
                style={{
                  background: active ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.6)",
                  boxShadow: active ? "0 4px 14px rgba(99,102,241,0.4)" : "none",
                }}
              >
                {n}
              </button>
            );
          })}
          <button onClick={() => setPage(Math.min(totalPages, safePage + 1))} className="px-2 py-1 rounded-md glass text-white/70 hover:text-white disabled:opacity-40" disabled={safePage === totalPages}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   SKELETONS
   ────────────────────────────────────────────────────────── */
function SkeletonCard({ height = 120 }) {
  return (
    <div className="glass rounded-2xl p-5 overflow-hidden">
      <div className="shimmer h-4 w-24 rounded" />
      <div className="shimmer h-8 w-32 rounded mt-3" />
      <div className="shimmer h-3 w-full rounded mt-4" style={{ height: height - 80 }} />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><SkeletonCard height={300} /></div>
        <SkeletonCard height={300} />
      </div>
      <SkeletonCard height={400} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   DASHBOARD
   ────────────────────────────────────────────────────────── */
function Dashboard() {
  const { revenueData, orders, dateRange, activeUsers, isLoading } = useApp();

  const filteredRev = useMemo(() => filterByDays(revenueData, dateRange), [revenueData, dateRange]);
  const filteredOrders = useMemo(() => filterOrdersByDays(orders, dateRange), [orders, dateRange]);

  const totalRevenue = useMemo(() => filteredRev.reduce((s, d) => s + d.revenue, 0), [filteredRev]);
  const prevRevenue = useMemo(() => {
    const prev = revenueData.slice(-dateRange * 2, -dateRange);
    return prev.reduce((s, d) => s + d.revenue, 0) || 1;
  }, [revenueData, dateRange]);
  const revDelta = ((totalRevenue - prevRevenue) / prevRevenue) * 100;

  const orderCount = filteredOrders.length;
  const prevOrderCount = orders.filter((o) => o.daysAgo >= dateRange && o.daysAgo < dateRange * 2).length || 1;
  const orderDelta = ((orderCount - prevOrderCount) / prevOrderCount) * 100;

  const sessions = orderCount * 5;
  const conv = sessions ? (orderCount / sessions) * 100 : 0;
  const convDelta = 2.4;

  const sparkRev = useMemo(() => filteredRev.slice(-7).map((d) => d.revenue), [filteredRev]);
  const sparkOrders = useMemo(() => filteredRev.slice(-7).map((d) => d.orders), [filteredRev]);
  const sparkConv = useMemo(() => filteredRev.slice(-7).map((d, i) => 15 + (i % 3) * 4 + (d.orders % 7)), [filteredRev]);
  const sparkUsers = useMemo(() => Array.from({ length: 7 }, (_, i) => activeUsers - 100 + i * 30 + (i % 2 ? -20 : 20)), [activeUsers]);

  return (
    <div className="flex flex-col gap-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Welcome back, Alex</h1>
          <p className="text-sm text-white/50 mt-1">Here's what's happening with your store today.</p>
        </div>
        <DateFilter />
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingState />
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <KPICard index={0} icon={DollarSign} label="Revenue" value={totalRevenue} prefix="$" delta={revDelta} sparkValues={sparkRev} live format={(v) => Math.round(v).toLocaleString()} />
              <KPICard index={1} icon={ShoppingCart} label="Orders" value={orderCount} delta={orderDelta} sparkValues={sparkOrders} />
              <KPICard index={2} icon={Target} label="Conversion" value={conv} suffix="%" delta={convDelta} sparkValues={sparkConv} format={(v) => v.toFixed(1)} />
              <KPICard index={3} icon={Activity} label="Active Users" value={activeUsers} delta={4.2} sparkValues={sparkUsers} live />
            </div>

            <ChartSection />
            <DataTable />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   ROOT APP
   ────────────────────────────────────────────────────────── */
function App() {
  useInjectedStyles();
  const [theme, setTheme] = useState("dark");

  return (
    <AppProvider>
      <div
        className="nexus-root min-h-screen relative overflow-hidden font-body"
        style={{ background: theme === "dark" ? "#0a0a0f" : "#f5f5fa", color: "#fff" }}
      >
        <div className="mesh-bg absolute inset-0 pointer-events-none" />
        <div className="noise" />

        <div className="relative z-10 flex">
          <Sidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <Navbar theme={theme} setTheme={setTheme} />
            <main className="flex-1 p-4 md:p-6 nexus-scroll">
              <Dashboard />
            </main>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
