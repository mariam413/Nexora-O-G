import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Warehouse,
  Cog,
  Boxes,
  PackageSearch,
  Wrench,
  BrainCircuit,
  Sliders,
  ShoppingBag,
  Truck,
  FileText,
  Bot,
  BookOpen,
  ClipboardList,
  Settings,
  Users,
  BarChart3,
  Cpu,
  Activity,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { store } from '../../services/store';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDemoGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenDemoGuide,
}) => {
  const currentUser = store.getCurrentUser();
  const isSuperAdmin = currentUser.role === 'NEXORA_SUPER_ADMIN';
  const isSupplier = currentUser.role === 'SUPPLIER_ADMIN' || currentUser.role === 'SUPPLIER_USER';

  // Organization Menu Items
  const orgNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'facilities', label: 'Facilities', icon: Building2 },
    { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
    { id: 'equipment', label: 'Equipment', icon: Cog },
    { id: 'materials', label: 'Materials Registry', icon: Boxes },
    { id: 'inventory', label: 'Inventory Engine', icon: PackageSearch },
    { id: 'maintenance', label: 'Maintenance & Readiness', icon: Wrench },
    { id: 'intelligence', label: 'AI Intelligence', icon: BrainCircuit, badge: 'Insights' },
    { id: 'whatif', label: 'What-If Simulator', icon: Sliders, badge: 'Signature' },
    { id: 'procurement', label: 'Procurement & Matching', icon: ShoppingBag },
    { id: 'suppliers', label: 'Supplier Directory', icon: Truck },
    { id: 'orders', label: 'Orders & Deliveries', icon: FileText },
    { id: 'assistant', label: 'NEXORA AI Assistant', icon: Bot, badge: 'AI' },
    { id: 'knowledge', label: 'Company Knowledge', icon: BookOpen },
    { id: 'audit', label: 'Audit Log', icon: ClipboardList },
    { id: 'settings', label: 'Settings & Risk Rules', icon: Settings },
  ];

  // Supplier Portal Items
  const supplierNavItems = [
    { id: 'supplier_dashboard', label: 'Supplier Dashboard', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Tender Opportunities', icon: ShoppingBag, badge: 'RFQs' },
    { id: 'supplier_inventory', label: 'My Spares Inventory', icon: Boxes },
    { id: 'supplier_offers', label: 'Submitted Offers', icon: FileText },
    { id: 'supplier_orders', label: 'Active Orders & Dispatch', icon: Truck },
    { id: 'supplier_profile', label: 'Company Profile & NSD', icon: Award },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Super Admin Items
  const adminNavItems = [
    { id: 'admin_dashboard', label: 'Platform Overview', icon: LayoutDashboard },
    { id: 'admin_organizations', label: 'Customer Organizations', icon: Building2 },
    { id: 'admin_users', label: 'Platform Users', icon: Users },
    { id: 'admin_suppliers', label: 'Supplier Network', icon: Truck },
    { id: 'admin_analytics', label: 'Cross-Tenant Analytics', icon: BarChart3 },
    { id: 'admin_ai_config', label: 'AI Models & Providers', icon: Cpu, badge: 'Gemini' },
    { id: 'admin_health', label: 'System Health & Engine', icon: Activity },
    { id: 'audit', label: 'Master Platform Audit', icon: ClipboardList },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  let items = orgNavItems;
  let sectionLabel = 'OPERATIONAL TENANT';

  if (isSuperAdmin) {
    items = adminNavItems;
    sectionLabel = 'PLATFORM ADMIN';
  } else if (isSupplier) {
    items = supplierNavItems;
    sectionLabel = 'SUPPLIER PORTAL';
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Scope Identifier */}
      <div className="px-5 py-3 border-b border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {sectionLabel}
        </span>
        <span className="text-[10px] font-mono text-emerald-500 dark:text-emerald-400 font-bold">
          v1.4.0
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0A78B5] text-white font-bold shadow-sm'
                  : 'text-[#082746] dark:text-slate-200 hover:text-[#082746] dark:hover:text-white hover:bg-[#E0F4FA]/70 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#123B63] dark:text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badge === 'Signature'
                      ? 'bg-[#32B86A] text-white font-bold'
                      : item.badge === 'AI' || item.badge === 'Gemini' || item.badge === 'RFQs' || item.badge === 'Insights'
                      ? 'bg-[#0A78B5] text-white font-bold'
                      : 'bg-slate-200 dark:bg-slate-800 text-[#082746] dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Master Demo Banner */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <button
          onClick={onOpenDemoGuide}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#0A78B5] to-[#32B86A] hover:from-[#086396] hover:to-[#289e58] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-white shrink-0" />
          <div className="text-left">
            <div className="text-[11px] leading-tight font-bold text-white">Interactive Tour</div>
            <div className="text-[9px] text-white/90 font-normal">22-Step Scripted Flow</div>
          </div>
        </button>
      </div>
    </aside>
  );
};
