import React, { useState } from 'react';
import {
  Bell,
  Search,
  Building2,
  ChevronDown,
  Shield,
  Layers,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react';
import { store } from '../../services/store';
import { UserRole } from '../../types';
import { NexoraLogo } from '../common/NexoraLogo';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenDemoGuide: () => void;
  onNavigate: (view: string, id?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenDemoGuide,
  onNavigate,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const currentUser = store.getCurrentUser();
  const currentOrg = store.getCurrentOrganization();
  const state = store.getState();
  const unreadNotifs = state.notifications.filter((n) => !n.read);
  const currentTheme = store.getTheme();

  const handleToggleTheme = () => {
    store.toggleTheme();
  };

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    ORGANIZATION_ADMIN: { label: 'Sarah Nalwanga', badge: 'Org Admin', color: 'bg-indigo-950/60 text-indigo-400 border-indigo-700/50' },
    PROCUREMENT_OFFICER: { label: 'David Okello', badge: 'Procurement Officer', color: 'bg-emerald-950/60 text-emerald-400 border-emerald-700/50' },
    INVENTORY_OFFICER: { label: 'Robert Mugabe', badge: 'Inventory Officer', color: 'bg-blue-950/60 text-blue-400 border-blue-700/50' },
    MAINTENANCE_OFFICER: { label: 'Eng. Patrick Kato', badge: 'Maintenance Officer', color: 'bg-amber-950/60 text-amber-400 border-amber-700/50' },
    MANAGEMENT_VIEWER: { label: 'Diana Tumwine', badge: 'Executive Viewer', color: 'bg-purple-950/60 text-purple-400 border-purple-700/50' },
    SUPPLIER_ADMIN: { label: 'James Mukasa', badge: 'Supplier Admin', color: 'bg-teal-950/60 text-teal-400 border-teal-700/50' },
    SUPPLIER_USER: { label: 'Grace Kyomugisha', badge: 'Supplier Rep', color: 'bg-teal-950/60 text-teal-400 border-teal-700/50' },
    NEXORA_SUPER_ADMIN: { label: 'Marcus Vance', badge: 'Super Admin', color: 'bg-rose-950/60 text-rose-400 border-rose-700/50' },
  };

  const handleRoleSelect = (userId: string) => {
    store.setCurrentUser(userId);
    setShowRoleMenu(false);
  };

  const handleOrgSelect = (orgId: string) => {
    store.setCurrentOrganization(orgId);
    setShowOrgMenu(false);
  };

  const handleResetData = () => {
    if (confirm('Reset prototype data back to initial demonstration state?')) {
      store.resetToSeed();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex flex-col bg-slate-900 border-b border-slate-800 text-slate-100 shadow-sm transition-colors">
      {/* Top Prototype Banner - High Contrast Enterprise Theme */}
      <div className="bg-[#E0F4FA] dark:bg-slate-900 border-b border-[#65C7E5]/40 px-4 py-1.5 flex items-center justify-between text-xs text-[#082746] dark:text-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider">
            DEMO ENVIRONMENT
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-[#32B86A] animate-pulse" />
          <span className="font-black tracking-wide text-[#082746] dark:text-sky-300">
            NEXORA O&amp;G INTELLIGENCE
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-[#334155] dark:text-slate-300 font-medium hidden sm:inline">
            Predict the spare. Secure the supply. Protect production.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1 font-bold text-[#0A78B5] dark:text-sky-400 hover:text-[#00A6A6] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#32B86A]" />
            <span>Master Demo Script</span>
          </button>
          <button
            onClick={handleResetData}
            title="Reset demonstration data"
            className="flex items-center gap-1 text-[#082746] hover:text-[#0A78B5] dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer font-semibold"
          >
            <RotateCcw className="w-3 h-3 text-[#082746]" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Main App Header */}
      <div className="h-16 px-5 flex items-center justify-between">
        {/* Brand & Active Organization */}
        <div className="flex items-center gap-6">
          <div className="cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <NexoraLogo size="md" />
          </div>

          <div className="h-6 w-[1px] bg-slate-800" />

          {/* Organization Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOrgMenu(!showOrgMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <div className="text-left">
                <span className="block text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Tenant / Org</span>
                <span className="font-semibold text-slate-100 max-w-[180px] truncate block">{currentOrg.name}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showOrgMenu && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase text-slate-400 border-b border-slate-800">
                  Switch Active Tenant (Data Isolation)
                </div>
                <div className="py-1 space-y-1">
                  {state.organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => handleOrgSelect(org.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        org.id === currentOrg.id
                          ? 'bg-sky-500/10 text-sky-400 font-semibold border border-sky-400/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{org.name}</div>
                        <div className="text-[10px] text-slate-400">{org.type} • {org.region}</div>
                      </div>
                      {org.id === currentOrg.id && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-800 text-[10px] text-slate-400">
                  Data isolation ensures organizations cannot view each other's inventories or negotiations.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search, AI Assistant, Theme Toggle, Notifications & User Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search materials, equipment, POs...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-mono">⌘K</kbd>
          </button>

          {/* Direct Nexora AI Button with Brand Blue & Green gradient with white text */}
          <button
            onClick={() => onNavigate('assistant')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0A78B5] to-[#32B86A] hover:from-[#086396] hover:to-[#289e58] text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="hidden md:inline text-white font-bold">Nexora AI</span>
          </button>

          {/* Light Blue / White / Light Green Theme Mode Toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
            title={`Switch to ${currentTheme === 'dark' ? 'Light Theme (White, Light Blue & Green)' : 'Dark Theme'}`}
          >
            {currentTheme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-semibold text-emerald-400 hidden lg:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-sky-500" />
                <span className="text-[11px] font-semibold text-sky-600 hidden lg:inline">Theme</span>
              </>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-200">System Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={() => store.markAllNotificationsAsRead()}
                      className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {state.notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    state.notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          store.markNotificationAsRead(notif.id);
                          if (notif.linkView) onNavigate(notif.linkView, notif.linkId);
                          setShowNotifMenu(false);
                        }}
                        className={`p-3 hover:bg-slate-800/60 transition-colors cursor-pointer ${
                          !notif.read ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {notif.type === 'ALERT' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                          {notif.type === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                          {notif.type === 'SUCCESS' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                          {notif.type === 'INFO' && <Bell className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                          <div className="text-left flex-1">
                            <div className="text-xs font-semibold text-slate-200">{notif.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{notif.message}</div>
                            <div className="text-[9px] text-slate-400 mt-1">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-[1px] bg-slate-800" />

          {/* User & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-xs text-sky-400 border border-sky-400/30">
                {currentUser.role === 'ORGANIZATION_ADMIN' ? (
                  <img
                    src="/src/assets/images/avatar_operations_director_1790284601470.jpg"
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-100 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span className={`px-1 py-0.2 rounded border text-[9px] font-medium ${roleLabels[currentUser.role]?.color || 'bg-slate-800 text-slate-300'}`}>
                    {roleLabels[currentUser.role]?.badge || currentUser.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="text-xs font-semibold text-slate-200">Switch Role (Evaluation Mode)</div>
                  <div className="text-[10px] text-slate-400">Dashboards and actions dynamically adapt per role permissions.</div>
                </div>
                <div className="py-1 space-y-1">
                  {state.users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    const rInfo = roleLabels[u.role];
                    return (
                      <button
                        key={u.id}
                        onClick={() => handleRoleSelect(u.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-sky-500/10 text-sky-400 font-semibold border border-sky-400/30' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-200">{u.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`px-1 rounded border text-[9px] ${rInfo?.color || ''}`}>
                              {rInfo?.badge || u.role}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{u.organizationName}</span>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
                <div className="p-2 border-t border-slate-800">
                  <button
                    onClick={onOpenDemoGuide}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold text-xs transition-colors cursor-pointer shadow-md shadow-sky-500/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>View 22-Step Master Demo Guide</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
