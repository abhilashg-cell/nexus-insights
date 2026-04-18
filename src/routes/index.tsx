import { createFileRoute } from "@tanstack/react-router";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ZAxis,
} from "recharts";
import {
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  Users,
  Settings as SettingsIcon,
  Bell,
  Search,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Percent,
  Download,
  LogOut,
  Sparkles,
  Lock,
  Mail,
  Loader2,
  ArrowUpDown,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
});

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

:root { --mouse-x: 50%; --mouse-y: 50%; }

[data-theme="dark"] {
  --bg: #0a0a0f; --bg-2: #07070b;
  --card: rgba(17, 17, 24, 0.7); --card-solid: #111118; --sidebar: #0f0f17;
  --text: #f4f4f7; --text-dim: #8b8b9a;
  --border: rgba(255,255,255,0.08); --border-strong: rgba(255,255,255,0.14);
  --accent: #6366f1; --accent-2: #8b5cf6;
  --shadow-card: 0 4px 24px rgba(0,0,0,0.4);
  --hover-glow: 0 0 40px rgba(99,102,241,0.25);
  --blob-1: #6366f1; --blob-2: #8b5cf6; --blob-3: #ec4899; --blob-4: #06b6d4;
  --blob-opacity: 0.35; --grid-line: rgba(255,255,255,0.04);
}
[data-theme="light"] {
  --bg: #f8fafc; --bg-2: #eef2f7;
  --card: rgba(255,255,255,0.75); --card-solid: #ffffff; --sidebar: #ffffff;
  --text: #0f172a; --text-dim: #64748b;
  --border: rgba(15,23,42,0.08); --border-strong: rgba(15,23,42,0.14);
  --accent: #6366f1; --accent-2: #8b5cf6;
  --shadow-card: 0 4px 20px rgba(15,23,42,0.06);
  --hover-glow: 0 12px 30px rgba(99,102,241,0.18);
  --blob-1: #c7d2fe; --blob-2: #ddd6fe; --blob-3: #fbcfe8; --blob-4: #a5f3fc;
  --blob-opacity: 0.7; --grid-line: rgba(15,23,42,0.05);
}

* { box-sizing: border-box; }
html, body, #root { height: 100%; }
body {
  margin: 0; font-family: 'DM Sans', system-ui, sans-serif;
  background: var(--bg); color: var(--text);
  transition: background 0.4s ease, color 0.4s ease;
  -webkit-font-smoothing: antialiased;
}
.font-display { font-family: 'Syne', sans-serif; letter-spacing: -0.02em; }

.mesh-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; background: var(--bg); }
.mesh-blob { position: absolute; width: 520px; height: 520px; border-radius: 50%; filter: blur(90px); opacity: var(--blob-opacity); will-change: transform; }
.mesh-blob.b1 { background: var(--blob-1); top: -10%; left: -10%; animation: blobA 22s ease-in-out infinite; }
.mesh-blob.b2 { background: var(--blob-2); top: 20%; right: -15%; animation: blobB 26s ease-in-out infinite; }
.mesh-blob.b3 { background: var(--blob-3); bottom: -15%; left: 20%; animation: blobC 28s ease-in-out infinite; }
.mesh-blob.b4 { background: var(--blob-4); bottom: 10%; right: 10%; animation: blobD 24s ease-in-out infinite; }
@keyframes blobA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(80px,60px) scale(1.15)} }
@keyframes blobB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-100px,80px) scale(1.1)} }
@keyframes blobC { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(60px,-70px) scale(1.2)} }
@keyframes blobD { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-80px,-50px) scale(1.05)} }

.noise-overlay {
  position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.04;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
}

.glass {
  background: var(--card); border: 1px solid var(--border);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--shadow-card); position: relative; overflow: hidden;
}
.glass::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(380px circle at var(--mouse-x) var(--mouse-y), rgba(99,102,241,0.12), transparent 45%);
  opacity: 0; transition: opacity 0.3s;
}
.glass:hover::before { opacity: 1; }

.grad-text {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

@keyframes livePulse { 0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); } 50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); } }
.live-dot { animation: livePulse 3s ease-in-out infinite; }

@keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
.shimmer { background: linear-gradient(90deg, var(--card-solid) 0%, var(--border-strong) 50%, var(--card-solid) 100%); background-size: 800px 100%; animation: shimmer 1.6s linear infinite; }

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #6366f1, #8b5cf6); border-radius: 4px; }
::selection { background: rgba(99,102,241,0.35); color: var(--text); }

.float-field { position: relative; }
.float-field input {
  width: 100%; padding: 22px 14px 8px 42px; border-radius: 12px;
  background: var(--card-solid); border: 1px solid var(--border);
  color: var(--text); font: inherit; outline: none;
  transition: border 0.2s, box-shadow 0.2s;
}
.float-field input:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99,102,241,0.18); }
.float-field label { position: absolute; left: 42px; top: 14px; color: var(--text-dim); pointer-events: none; transition: all 0.2s; font-size: 14px; }
.float-field input:focus + label, .float-field input:not(:placeholder-shown) + label { top: 6px; font-size: 11px; color: #8b5cf6; }
.float-field .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-dim); }

@keyframes wiggle { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }
.wiggle-on-hover:hover svg { animation: wiggle 0.5s ease-in-out; }

.ripple-btn { position: relative; overflow: hidden; }
.ripple-btn .ripple { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.5); transform: scale(0); animation: ripple 0.6s linear; pointer-events: none; }
@keyframes ripple { to { transform: scale(4); opacity: 0; } }

.pill { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
.pill-pending { background: rgba(245,158,11,0.15); color: #f59e0b; }
.pill-shipped { background: rgba(59,130,246,0.15); color: #3b82f6; }
.pill-delivered { background: rgba(34,197,94,0.15); color: #22c55e; }
.pill-cancelled { background: rgba(239,68,68,0.15); color: #ef4444; }
`;

const NAMES = [
  "Aria Chen", "Marcus Wells", "Sofia Petrov", "Liam O'Connor", "Nia Adebayo",
  "Kenji Tanaka", "Priya Sharma", "Mateo Rossi", "Zara Khan", "Ethan Brooks",
  "Yuki Sato", "Diego Vargas", "Amara Okonkwo", "Felix Müller", "Layla Hassan",
  "Oscar Lindqvist", "Mei Wong", "Tobias Schmidt", "Isla MacLeod", "Rafael Costa",
  "Hana Park", "Noah Bergman", "Anya Volkov", "Jamal Rivers", "Saoirse Byrne",
  "Hugo Laurent", "Ines Moreau", "Caleb Foster", "Leila Najjar", "Mira Kovač",
  "Tariq Bello", "Elena Russo", "Aiden Walsh", "Sana Iqbal", "Bruno Silva",
  "Greta Holm", "Kai Andersen", "Rosa Martínez", "Idris Cole", "Theo Whitman",
  "Naomi Fischer", "Cyrus Patel", "Chiara Ferrari", "Otto Becker", "Vesna Marko",
  "Jonah Klein", "Aaliyah Reed", "Niko Dimitri", "Beatriz Lopes", "Sven Holt",
];
const CATEGORIES = ["Electronics", "Fashion", "Home", "Sports", "Beauty"];
const STATUSES = ["pending", "shipped", "delivered", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

type DayPoint = { date: string; revenue: number; orders: number; ts: number };
type Order = { id: string; customer: string; status: Status; amount: number; date: string; ts: number };

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function generateRevenueData(): DayPoint[] {
  const rng = seededRandom(42);
  const out: DayPoint[] = [];
  const now = Date.now();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const day = d.getDay();
    const weekMul = day === 0 ? 0.5 : day === 6 ? 0.7 : 1.0;
    const trend = 1 + (89 - i) * 0.003;
    let base = 8000 * trend * weekMul;
    base += (rng() - 0.5) * 1500;
    if (i === 90 - 45) base = 28000;
    const revenue = Math.max(2000, Math.round(base));
    const orders = Math.round(revenue / (90 + rng() * 40));
    out.push({ date: d.toISOString().slice(0, 10), revenue, orders, ts: d.getTime() });
  }
  return out;
}

function generateOrders(): Order[] {
  const rng = seededRandom(7);
  const out: Order[] = [];
  for (let i = 0; i < 50; i++) {
    const r = rng();
    let amount: number;
    if (r < 0.7) amount = 40 + rng() * 160;
    else if (r < 0.95) amount = 200 + rng() * 300;
    else amount = 500 + rng() * 300;
    const sr = rng();
    const status: Status = sr < 0.45 ? "delivered" : sr < 0.75 ? "shipped" : sr < 0.9 ? "pending" : "cancelled";
    const daysAgo = rng() < 0.6 ? Math.floor(rng() * 30) : Math.floor(rng() * 90);
    const d = new Date(Date.now() - daysAgo * 86400000);
    out.push({
      id: `NX-${(10234 + i).toString()}`,
      customer: NAMES[i % NAMES.length],
      status,
      amount: Math.round(amount * 100) / 100,
      date: d.toISOString().slice(0, 10),
      ts: d.getTime(),
    });
  }
  return out;
}

function filterByDays(data: DayPoint[], days: number) { return data.slice(-days); }

type Notification = { id: number; title: string; body: string; time: string; read: boolean };
type TabKey = "dashboard" | "analytics" | "orders" | "customers" | "settings";

type AppCtx = {
  isAuthenticated: boolean; setIsAuthenticated: (v: boolean) => void;
  theme: "dark" | "light"; setTheme: (t: "dark" | "light") => void;
  dateRange: 7 | 30 | 90; setDateRange: (n: 7 | 30 | 90) => void;
  revenueData: DayPoint[]; orders: Order[];
  notifications: Notification[]; markNotificationsRead: () => void;
  isLoading: boolean;
  sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void;
  currentTab: TabKey; setCurrentTab: (k: TabKey) => void;
  liveUpdates: boolean; setLiveUpdates: (v: boolean) => void;
  emailNotifs: boolean; setEmailNotifs: (v: boolean) => void;
  livePulseKey: number;
};
const Ctx = createContext<AppCtx | null>(null);
const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("ctx");
  return c;
};

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  useEffect(() => {
    fromRef.current = val;
    startRef.current = null;
    let raf = 0;
    const step = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(2, -10 * p);
      setVal(fromRef.current + (target - fromRef.current) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);
  return val;
}

function useGlobalStyles() {
  useEffect(() => {
    const id = "nexus-globals";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = GLOBAL_CSS;
    document.head.appendChild(s);
  }, []);
}

function useCursorTracking() {
  useEffect(() => {
    let raf = 0;
    let x = 0, y = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--mouse-x", `${x}px`);
          document.documentElement.style.setProperty("--mouse-y", `${y}px`);
          raf = 0;
        });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, []);
}

function App() {
  useGlobalStyles();
  useCursorTracking();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [dateRange, setDateRange] = useState<7 | 30 | 90>(30);
  const [revenueData, setRevenueData] = useState<DayPoint[]>(() => generateRevenueData());
  const [orders] = useState<Order[]>(() => generateOrders());
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabKey>("dashboard");
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [livePulseKey, setLivePulseKey] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "New order received", body: "NX-10283 from Aria Chen — $284.50", time: "2m ago", read: false },
    { id: 2, title: "Revenue milestone", body: "You crossed $1M in lifetime sales", time: "1h ago", read: false },
    { id: 3, title: "Inventory alert", body: "Wireless Earbuds Pro is low in stock", time: "3h ago", read: false },
    { id: 4, title: "Weekly report ready", body: "Your analytics report for week 14 is available", time: "1d ago", read: false },
  ]);

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!liveUpdates || !isAuthenticated) return;
    const id = setInterval(() => {
      setRevenueData((prev) => {
        const copy = [...prev];
        for (let i = Math.max(0, copy.length - 7); i < copy.length; i++) {
          const delta = (Math.random() * 500 - 250);
          copy[i] = { ...copy[i], revenue: Math.max(1500, Math.round(copy[i].revenue + delta)) };
        }
        return copy;
      });
      setLivePulseKey((k) => k + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [liveUpdates, isAuthenticated]);

  const markNotificationsRead = useCallback(() => {
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  }, []);

  const value = useMemo<AppCtx>(() => ({
    isAuthenticated, setIsAuthenticated,
    theme, setTheme,
    dateRange, setDateRange,
    revenueData, orders,
    notifications, markNotificationsRead,
    isLoading, sidebarOpen, setSidebarOpen,
    currentTab, setCurrentTab,
    liveUpdates, setLiveUpdates,
    emailNotifs, setEmailNotifs,
    livePulseKey,
  }), [isAuthenticated, theme, dateRange, revenueData, orders, notifications, markNotificationsRead, isLoading, sidebarOpen, currentTab, liveUpdates, emailNotifs, livePulseKey]);

  return (
    <Ctx.Provider value={value}>
      <div className="relative min-h-screen">
        <div className="mesh-bg">
          <div className="mesh-blob b1" />
          <div className="mesh-blob b2" />
          <div className="mesh-blob b3" />
          <div className="mesh-blob b4" />
        </div>
        <div className="noise-overlay" />
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isAuthenticated ? (
              <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Shell />
              </motion.div>
            ) : (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LoginScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Ctx.Provider>
  );
}

function LoginScreen() {
  const { setIsAuthenticated, theme, setTheme } = useApp();
  const [email, setEmail] = useState("demo@nexus.io");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => setIsAuthenticated(true), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-6 right-6 glass rounded-full p-2.5 hover:scale-105 transition"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-3xl p-10 w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <div className="font-display text-2xl font-bold grad-text">NEXUS</div>
            <div className="text-xs" style={{ color: "var(--text-dim)" }}>Analytics Suite</div>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-dim)" }}>
          Sign in to access your dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="float-field">
            <Mail size={16} className="field-icon" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " required />
            <label>Email address</label>
          </div>
          <div className="float-field">
            <Lock size={16} className="field-icon" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " required />
            <label>Password</label>
          </div>

          <RippleButton type="submit" disabled={loading} className="w-full mt-2">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Authenticating...
              </span>
            ) : "Demo Login"}
          </RippleButton>
        </form>

        <div className="text-center text-xs mt-6" style={{ color: "var(--text-dim)" }}>
          Protected demo · No real credentials needed
        </div>
      </motion.div>
    </div>
  );
}

function Shell() {
  const { sidebarOpen } = useApp();
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0" style={{ marginLeft: sidebarOpen ? 256 : 72 }}>
        <Navbar />
        <main className="flex-1 p-6 overflow-x-hidden">
          <TabSwitcher />
        </main>
      </div>
    </div>
  );
}

const NAV_ITEMS: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "customers", label: "Customers", icon: Users },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

const Sidebar = React.memo(function Sidebar() {
  const { sidebarOpen, setSidebarOpen, currentTab, setCurrentTab, notifications, setIsAuthenticated } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-screen z-30 flex flex-col"
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--border)" }}
    >
      <div className="p-4 flex items-center gap-3 h-[68px]" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <Sparkles size={20} className="text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-display text-xl font-bold grad-text whitespace-nowrap"
            >
              NEXUS
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const active = currentTab === item.key;
          const Icon = item.icon;
          const showBadge = item.key === "orders" && unread > 0;
          return (
            <button
              key={item.key}
              onClick={() => setCurrentTab(item.key)}
              className="wiggle-on-hover w-full flex items-center gap-3 px-3 py-2.5 rounded-lg relative transition-colors text-sm font-medium"
              style={{
                background: active ? "linear-gradient(90deg, rgba(99,102,241,0.18), rgba(139,92,246,0.05))" : "transparent",
                color: active ? "var(--text)" : "var(--text-dim)",
              }}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r"
                  style={{ background: "linear-gradient(180deg,#6366f1,#8b5cf6)" }}
                />
              )}
              <div className="relative shrink-0">
                <Icon size={18} />
                {showBadge && (
                  <>
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
                    <motion.span
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"
                      animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                  </>
                )}
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {sidebarOpen && showBadge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500 text-white">
                  {unread}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="wiggle-on-hover w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
          style={{ color: "var(--text-dim)" }}
        >
          <LogOut size={18} />
          {sidebarOpen && <span>Sign out</span>}
        </button>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-center mt-2 py-2 rounded-lg glass text-xs"
        >
          <motion.span animate={{ rotate: sidebarOpen ? 0 : 180 }}>
            <ChevronLeft size={16} />
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
});

const Navbar = React.memo(function Navbar() {
  const { theme, setTheme, notifications, markNotificationsRead, currentTab } = useApp();
  const [openNotif, setOpenNotif] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const handleOpenNotif = useCallback(() => {
    setOpenNotif((v) => {
      const next = !v;
      if (next) markNotificationsRead();
      return next;
    });
  }, [markNotificationsRead]);

  return (
    <header
      className="sticky top-0 z-20 h-[68px] flex items-center px-6 gap-4"
      style={{ background: "var(--card)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 text-sm">
        <span style={{ color: "var(--text-dim)" }}>Nexus</span>
        <ChevronRight size={14} style={{ color: "var(--text-dim)" }} />
        <span className="font-medium capitalize">{currentTab}</span>
      </div>

      <div className="flex-1 max-w-md mx-auto hidden md:block">
        <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
          <Search size={14} style={{ color: "var(--text-dim)" }} />
          <input
            placeholder="Search anything..."
            className="bg-transparent outline-none flex-1 text-sm"
            style={{ color: "var(--text)" }}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--border)", color: "var(--text-dim)" }}>⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="glass w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 transition"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="relative">
          <button
            onClick={handleOpenNotif}
            className="glass w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 transition relative"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 text-[10px] font-bold rounded-full bg-red-500 text-white flex items-center justify-center px-1">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {openNotif && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                className="absolute right-0 mt-2 w-80 glass rounded-2xl p-2 z-30"
              >
                <div className="px-3 py-2 text-xs font-semibold" style={{ color: "var(--text-dim)" }}>NOTIFICATIONS</div>
                {notifications.map((n) => (
                  <div key={n.id} className="px-3 py-2 rounded-lg hover:bg-white/5 transition">
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs" style={{ color: "var(--text-dim)" }}>{n.body}</div>
                    <div className="text-[10px] mt-1" style={{ color: "var(--text-dim)" }}>{n.time}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          AK
        </div>
      </div>
    </header>
  );
});

function TabSwitcher() {
  const { currentTab } = useApp();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentTab}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {currentTab === "dashboard" && <DashboardView />}
        {currentTab === "analytics" && <AnalyticsView />}
        {currentTab === "orders" && <OrdersView />}
        {currentTab === "customers" && <CustomersView />}
        {currentTab === "settings" && <SettingsView />}
      </motion.div>
    </AnimatePresence>
  );
}

function DashboardView() {
  const { isLoading, dateRange, setDateRange, revenueData, orders } = useApp();

  const filtered = useMemo(() => filterByDays(revenueData, dateRange), [revenueData, dateRange]);
  const filteredOrders = useMemo(() => {
    const cutoff = Date.now() - dateRange * 86400000;
    return orders.filter((o) => o.ts >= cutoff);
  }, [orders, dateRange]);

  const totalRevenue = useMemo(() => filtered.reduce((s, p) => s + p.revenue, 0), [filtered]);
  const prevRevenue = useMemo(() => {
    const prev = revenueData.slice(-dateRange * 2, -dateRange);
    return prev.reduce((s, p) => s + p.revenue, 0) || 1;
  }, [revenueData, dateRange]);
  const revTrend = ((totalRevenue - prevRevenue) / prevRevenue) * 100;

  const orderCount = filteredOrders.length;
  const sessions = Math.round(orderCount * 5.2);
  const conversion = sessions > 0 ? (orderCount / sessions) * 100 : 0;
  const activeUsers = 1200 + Math.round(Math.sin(Date.now() / 5000) * 100) + 200;

  const categoryData = useMemo(() => {
    return CATEGORIES.map((c, i) => ({
      name: c,
      value: Math.round(2000 + ((i + 1) * 600) + Math.sin(dateRange + i) * 400),
    }));
  }, [dateRange]);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Overview</h1>
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>Your store performance at a glance</p>
        </div>
        <DateFilter value={dateRange} onChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard idx={0} label="Revenue" value={totalRevenue} prefix="$" trend={revTrend} icon={DollarSign} sparkline={filtered.slice(-7).map(p => p.revenue)} />
        <KPICard idx={1} label="Orders" value={orderCount} trend={8.2} icon={ShoppingCart} sparkline={filtered.slice(-7).map(p => p.orders)} />
        <KPICard idx={2} label="Conversion" value={conversion} suffix="%" decimals={2} trend={-1.3} icon={Percent} sparkline={filtered.slice(-7).map(p => p.orders / 10)} />
        <KPICard idx={3} label="Active Users" value={activeUsers} trend={4.6} icon={Activity} live sparkline={filtered.slice(-7).map(p => p.revenue / 12)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart data={filtered} />
        </div>
        <CategoryChart data={categoryData} />
      </div>

      <RecentOrdersPreview orders={filteredOrders.slice(0, 5)} />
    </div>
  );
}

const DateFilter = React.memo(function DateFilter({
  value, onChange,
}: { value: 7 | 30 | 90; onChange: (v: 7 | 30 | 90) => void }) {
  const opts: (7 | 30 | 90)[] = [7, 30, 90];
  return (
    <div className="glass rounded-full p-1 inline-flex">
      {opts.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className="relative px-4 py-1.5 text-sm font-medium rounded-full"
          style={{ color: value === o ? "white" : "var(--text-dim)" }}
        >
          {value === o && (
            <motion.div
              layoutId="date-pill"
              className="absolute inset-0 rounded-full"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 0 18px rgba(99,102,241,0.5)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative">{o}D</span>
        </button>
      ))}
    </div>
  );
});

type KPIProps = {
  idx: number; label: string; value: number;
  prefix?: string; suffix?: string; decimals?: number;
  trend: number; icon: React.ComponentType<{ size?: number }>;
  sparkline: number[]; live?: boolean;
};
const KPICard = React.memo(function KPICard({ idx, label, value, prefix = "", suffix = "", decimals = 0, trend, icon: Icon, sparkline, live }: KPIProps) {
  const display = useCountUp(value, 1200);
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-50, 50], [8, -8]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left - r.width / 2);
    y.set(e.clientY - r.top - r.height / 2);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const formatted = `${prefix}${display.toLocaleString(undefined, { maximumFractionDigits: decimals })}${suffix}`;

  const max = Math.max(...sparkline, 1);
  const min = Math.min(...sparkline, 0);
  const range = max - min || 1;
  const w = 80, h = 28;
  const path = sparkline.map((v, i) => {
    const px = (i / Math.max(1, sparkline.length - 1)) * w;
    const py = h - ((v - min) / range) * h;
    return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(" ");

  const up = trend >= 0;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08 }}
      whileHover={{ boxShadow: "var(--hover-glow)" }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
            {label}
            {live && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />}
          </div>
          <div className="font-display text-3xl font-bold mt-2">{formatted}</div>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))" }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className={`text-xs font-medium flex items-center gap-1 ${up ? "text-emerald-500" : "text-rose-500"}`}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend).toFixed(1)}%
          <span style={{ color: "var(--text-dim)" }} className="ml-1 font-normal">vs prev</span>
        </div>
        <svg width={w} height={h}>
          <defs>
            <linearGradient id={`sl-${idx}`} x1="0" x2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path d={path} fill="none" stroke={`url(#sl-${idx})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  );
});

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      {label && <div className="font-semibold mb-1">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-dim)" }}>{p.name}:</span>
          <span className="font-medium">{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
}

const RevenueChart = React.memo(function RevenueChart({ data }: { data: DayPoint[] }) {
  const { livePulseKey } = useApp();
  return (
    <div className="glass rounded-2xl p-5 h-[360px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-bold">Revenue Over Time</h3>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>Daily revenue trend</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <motion.span key={livePulseKey} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-red-500 live-dot" />
          <span className="font-semibold text-red-500">LIVE</span>
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--grid-line)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--text-dim)" tickFormatter={(v) => v.slice(5)} fontSize={11} />
            <YAxis stroke="var(--text-dim)" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#rev-grad)" animationDuration={800} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

const CategoryChart = React.memo(function CategoryChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="glass rounded-2xl p-5 h-[360px] flex flex-col">
      <div className="mb-4">
        <h3 className="font-display text-lg font-bold">Orders by Category</h3>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>Top performers</p>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--grid-line)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={11} />
            <YAxis stroke="var(--text-dim)" fontSize={11} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={800}>
              {data.map((_, i) => <Cell key={i} fill="url(#bar-grad)" />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

function AnalyticsView() {
  const { orders, revenueData } = useApp();
  const scatter = useMemo(() => orders.map((o) => ({
    x: new Date(o.date).getDate(),
    y: o.amount,
    z: o.amount,
    customer: o.customer,
  })), [orders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics</h1>
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>Deep dive into your data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 h-[400px] flex flex-col">
          <h3 className="font-display text-lg font-bold mb-4">Order Distribution</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <defs>
                  <radialGradient id="scatter-grad">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                  </radialGradient>
                </defs>
                <CartesianGrid stroke="var(--grid-line)" />
                <XAxis dataKey="x" name="Day of Month" stroke="var(--text-dim)" fontSize={11} />
                <YAxis dataKey="y" name="Amount" stroke="var(--text-dim)" fontSize={11} />
                <ZAxis dataKey="z" range={[40, 300]} />
                <Tooltip content={<ChartTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={scatter} fill="url(#scatter-grad)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 h-[400px] flex flex-col">
          <h3 className="font-display text-lg font-bold mb-4">Revenue vs Orders</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData.slice(-30)}>
                <CartesianGrid stroke="var(--grid-line)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-dim)" fontSize={11} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="var(--text-dim)" fontSize={11} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Avg Order Value", val: "$184.32", trend: "+12%" },
          { label: "Customer LTV", val: "$1,284", trend: "+8.4%" },
          { label: "Refund Rate", val: "2.1%", trend: "-0.4%" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5"
          >
            <div className="text-xs uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>{s.label}</div>
            <div className="font-display text-2xl font-bold mt-2">{s.val}</div>
            <div className="text-xs text-emerald-500 mt-1">{s.trend} this month</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OrdersView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Orders</h1>
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>Manage and review all transactions</p>
      </div>
      <OrdersTable />
    </div>
  );
}

function OrdersTable() {
  const { orders } = useApp();
  const [sortCol, setSortCol] = useState<keyof Order>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    let r = orders;
    if (statusFilter !== "all") r = r.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((o) => o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
    }
    const sorted = [...r].sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [orders, statusFilter, search, sortCol, sortDir]);

  useEffect(() => { setPage(1); }, [statusFilter, search, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize);

  const toggleSort = (col: keyof Order) => {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const downloadCSV = useCallback(() => {
    const headers = ["id", "customer", "status", "amount", "date"];
    const rows = filtered.map((o) => headers.map((h) => `"${String(o[h as keyof Order])}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-orders-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [filtered]);

  const cols: { key: keyof Order; label: string }[] = [
    { key: "id", label: "Order ID" },
    { key: "customer", label: "Customer" },
    { key: "status", label: "Status" },
    { key: "amount", label: "Amount" },
    { key: "date", label: "Date" },
  ];

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-4 flex items-center gap-3 flex-wrap" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="glass rounded-lg px-3 py-2 flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={14} style={{ color: "var(--text-dim)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or order ID..."
            className="bg-transparent outline-none flex-1 text-sm"
            style={{ color: "var(--text)" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | Status)}
          className="glass rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
          style={{ color: "var(--text)" }}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <RippleButton onClick={downloadCSV} className="!py-2 !px-4 text-sm">
          <Download size={14} /> Export CSV
        </RippleButton>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0" style={{ background: "var(--card-solid)" }}>
            <tr>
              {cols.map((c) => (
                <th key={c.key} onClick={() => toggleSort(c.key)} className="text-left px-4 py-3 cursor-pointer select-none font-semibold" style={{ color: "var(--text-dim)" }}>
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    {sortCol === c.key ? (
                      <motion.span animate={{ rotate: sortDir === "asc" ? 0 : 180 }}>
                        <ChevronUp size={12} />
                      </motion.span>
                    ) : <ArrowUpDown size={12} className="opacity-40" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {slice.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/5 transition relative group"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3">
                    <span className={`pill pill-${o.status}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold">${o.amount.toFixed(2)}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-dim)" }}>{o.date}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {slice.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12" style={{ color: "var(--text-dim)" }}>No results found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="text-xs" style={{ color: "var(--text-dim)" }}>
          Showing {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, filtered.length)} of {filtered.length}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="glass w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30">
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-xs font-medium"
                style={{
                  background: page === p ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                  color: page === p ? "white" : "var(--text-dim)",
                  border: page === p ? "none" : "1px solid var(--border)",
                }}
              >
                {p}
              </button>
            );
          })}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="glass w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function RecentOrdersPreview({ orders }: { orders: Order[] }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold">Recent Orders</h3>
      </div>
      <div className="space-y-2">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                {o.customer.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-medium">{o.customer}</div>
                <div className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>{o.id}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`pill pill-${o.status}`}>{o.status}</span>
              <div className="font-semibold w-20 text-right">${o.amount.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomersView() {
  const { orders } = useApp();
  const customers = useMemo(() => {
    const map = new Map<string, { name: string; orders: number; total: number }>();
    orders.forEach((o) => {
      const e = map.get(o.customer) ?? { name: o.customer, orders: 0, total: 0 };
      e.orders++; e.total += o.amount;
      map.set(o.customer, e);
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [orders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Customers</h1>
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>{customers.length} active customers</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.slice(0, 12).map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{c.name}</div>
              <div className="text-xs" style={{ color: "var(--text-dim)" }}>{c.orders} orders</div>
            </div>
            <div className="font-display font-bold">${c.total.toFixed(0)}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SettingsView() {
  const { theme, setTheme, liveUpdates, setLiveUpdates, emailNotifs, setEmailNotifs } = useApp();

  const settings: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }[] = [
    { label: "Live Updates", desc: "Refresh dashboard data every 3 seconds", value: liveUpdates, onChange: setLiveUpdates },
    { label: "Email Notifications", desc: "Receive weekly reports via email", value: emailNotifs, onChange: setEmailNotifs },
    { label: "Dark Theme", desc: "Use dark color scheme", value: theme === "dark", onChange: (v) => setTheme(v ? "dark" : "light") },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>Customize your experience</p>
      </div>

      <div className="glass rounded-2xl">
        {settings.map((s, idx) => (
          <div key={s.label} className="flex items-center justify-between p-5" style={idx > 0 ? { borderTop: "1px solid var(--border)" } : undefined}>
            <div>
              <div className="font-semibold">{s.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>{s.desc}</div>
            </div>
            <Toggle value={s.value} onChange={s.onChange} />
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="font-semibold mb-2">Account</div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>AK</div>
          <div>
            <div className="font-medium">Alex Kim</div>
            <div className="text-xs" style={{ color: "var(--text-dim)" }}>alex@nexus.io · Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-11 h-6 rounded-full p-0.5 flex items-center transition-colors"
      style={{ background: value ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "var(--border-strong)" }}
    >
      <motion.div
        animate={{ x: value ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white shadow"
      />
    </button>
  );
}

function RippleButton({
  children, onClick, className = "", type = "button", disabled,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const span = document.createElement("span");
    span.className = "ripple";
    const size = Math.max(rect.width, rect.height);
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(span);
    setTimeout(() => span.remove(), 600);
    onClick?.(e);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`ripple-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition disabled:opacity-60 ${className}`}
      style={{
        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
        boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
      }}
    >
      {children}
    </button>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-60 rounded-lg shimmer" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl shimmer" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-[360px] rounded-2xl shimmer" />
        <div className="h-[360px] rounded-2xl shimmer" />
      </div>
    </div>
  );
}
