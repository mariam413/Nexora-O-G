import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { OrganizationDashboard } from './components/dashboard/OrganizationDashboard';
import { MaterialsView } from './components/materials/MaterialsView';
import { MaterialDetailModal } from './components/materials/MaterialDetailModal';
import { InventoryView } from './components/inventory/InventoryView';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { AIIntelligenceView } from './components/intelligence/AIIntelligenceView';
import { WhatIfSimulator } from './components/whatif/WhatIfSimulator';
import { ProcurementView } from './components/procurement/ProcurementView';
import { OrdersView } from './components/orders/OrdersView';
import { SupplierDirectory } from './components/suppliers/SupplierDirectory';
import { SupplierPortal } from './components/supplier_portal/SupplierPortal';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { AuditLogView } from './components/audit/AuditLogView';
import { CompanyKnowledgeView } from './components/knowledge/CompanyKnowledgeView';
import { SuperAdminView } from './components/admin/SuperAdminView';
import { GuidedDemoModal } from './components/demo/GuidedDemoModal';
import { FacilitiesDashboard } from './components/facilities/FacilitiesDashboard';
import { WarehouseDashboard } from './components/warehouse/WarehouseDashboard';
import { EquipmentDashboard } from './components/equipment/EquipmentDashboard';
import { Bot, Sparkles } from 'lucide-react';
import { store } from './services/store';

export const App: React.FC = () => {
  const [, setTick] = useState(0);

  // Subscribe to central store changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((t) => t + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const [activeView, setActiveView] = useState<string>('landing');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [selectedPRId, setSelectedPRId] = useState<string | undefined>(undefined);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const currentUser = store.getCurrentUser();
  const materials = store.getMaterials();

  // If user switches to Supplier role, adjust view to supplier portal if appropriate
  useEffect(() => {
    if (
      (currentUser.role === 'SUPPLIER_USER' || currentUser.role === 'SUPPLIER_ADMIN') &&
      activeView !== 'supplier_portal' &&
      activeView !== 'landing'
    ) {
      setActiveView('supplier_portal');
    }
  }, [currentUser.role]);

  const handleOpenMaterialModal = (materialId: string) => {
    setSelectedMaterialId(materialId);
  };

  const handleOpenWhatIf = (materialId?: string) => {
    if (materialId) {
      setSelectedMaterialId(materialId);
    }
    setActiveView('whatif');
  };

  const handleOpenProcure = (materialId: string) => {
    setSelectedMaterialId(materialId);
    setActiveView('procurement');
  };

  const handleOpenOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveView('orders');
  };

  const handleNavigate = (view: string, id?: string) => {
    if (view === 'materials' && id) {
      setSelectedMaterialId(id);
    }
    setActiveView(view);
  };

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId);

  // If Landing Page
  if (activeView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
        <LandingPage
          onEnterDemo={(roleUserId) => {
            if (roleUserId) {
              store.setCurrentUser(roleUserId);
            }
            setActiveView('dashboard');
          }}
          onOpenDemoGuide={() => {
            setActiveView('dashboard');
            setIsDemoModalOpen(true);
          }}
        />
        <GuidedDemoModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
          onNavigate={(view) => {
            setActiveView(view);
            setIsDemoModalOpen(false);
          }}
        />
      </div>
    );
  }

  // Active App Shell
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased font-sans selection:bg-sky-500 selection:text-white transition-colors">
      {/* Top Application Header */}
      <Header
        onOpenSearch={() => setActiveView('materials')}
        onOpenDemoGuide={() => setIsDemoModalOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Role-Specific Sidebar */}
        <Sidebar
          currentView={activeView}
          onNavigate={(v) => setActiveView(v)}
          onOpenDemoGuide={() => setIsDemoModalOpen(true)}
        />

        {/* Dynamic Center Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/40">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeView === 'dashboard' && (
              <OrganizationDashboard
                onNavigate={handleNavigate}
                onOpenMaterialModal={(mat) => handleOpenMaterialModal(mat.id)}
                onOpenRecordUsageModal={(matId) => {
                  if (matId) setSelectedMaterialId(matId);
                  setActiveView('inventory');
                }}
                onOpenProcureModal={(matId) => {
                  if (matId) setSelectedMaterialId(matId);
                  setActiveView('procurement');
                }}
                onOpenWhatIf={handleOpenWhatIf}
              />
            )}

            {activeView === 'materials' && (
              <MaterialsView
                onSelectMaterial={(mat) => handleOpenMaterialModal(mat.id)}
                onOpenRecordUsage={(matId) => {
                  if (matId) setSelectedMaterialId(matId);
                  setActiveView('inventory');
                }}
                onOpenWhatIf={handleOpenWhatIf}
                onOpenProcure={(matId) => handleOpenProcure(matId || materials[0]?.id)}
              />
            )}

            {activeView === 'inventory' && (
              <InventoryView
                initialMaterialId={selectedMaterialId || undefined}
                onOpenWhatIf={handleOpenWhatIf}
              />
            )}

            {activeView === 'maintenance' && (
              <MaintenanceView
                onOpenMaterialModal={handleOpenMaterialModal}
                onOpenWhatIf={handleOpenWhatIf}
              />
            )}

            {activeView === 'intelligence' && (
              <AIIntelligenceView
                onOpenWhatIf={handleOpenWhatIf}
                onOpenMaterialModal={handleOpenMaterialModal}
                onOpenProcure={handleOpenProcure}
              />
            )}

            {activeView === 'whatif' && (
              <WhatIfSimulator
                initialMaterialId={selectedMaterialId || undefined}
                onOpenProcure={handleOpenProcure}
              />
            )}

            {activeView === 'procurement' && (
              <ProcurementView
                initialRequestId={selectedPRId}
                onOpenOrder={handleOpenOrder}
              />
            )}

            {activeView === 'orders' && (
              <OrdersView
                initialOrderId={selectedOrderId}
                onOpenMaterialModal={handleOpenMaterialModal}
              />
            )}

            {activeView === 'facilities' && (
              <FacilitiesDashboard />
            )}

            {activeView === 'warehouses' && (
              <WarehouseDashboard />
            )}

            {activeView === 'equipment' && (
              <EquipmentDashboard />
            )}

            {activeView === 'suppliers' && (
              <SupplierDirectory />
            )}

            {activeView === 'supplier_portal' && (
              <SupplierPortal
                onNavigate={handleNavigate}
              />
            )}

            {(activeView === 'assistant' || activeView === 'ai_assistant') && (
              <AIAssistantView
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'audit' && (
              <AuditLogView />
            )}

            {activeView === 'knowledge' && (
              <CompanyKnowledgeView />
            )}

            {activeView === 'admin' && (
              <SuperAdminView
                onNavigate={handleNavigate}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Nexora AI Button (Omnipresent) */}
      {activeView !== 'assistant' && activeView !== 'ai_assistant' && (
        <button
          onClick={() => setActiveView('assistant')}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-200 border border-amber-300/40 cursor-pointer group"
          title="Open Nexora AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
          </div>
          <span className="font-extrabold tracking-wide">Nexora AI</span>
        </button>
      )}

      {/* Global Material Detail Inspection Modal */}
      {selectedMaterial && (
        <MaterialDetailModal
          material={selectedMaterial}
          onClose={() => setSelectedMaterialId(null)}
          onOpenRecordUsage={(id) => {
            setSelectedMaterialId(id);
            setActiveView('inventory');
          }}
          onOpenAddStock={(id) => {
            setSelectedMaterialId(id);
            setActiveView('inventory');
          }}
          onOpenTransferStock={(id) => {
            setSelectedMaterialId(id);
            setActiveView('inventory');
          }}
          onOpenWhatIf={(id) => {
            setSelectedMaterialId(id);
            setActiveView('whatif');
          }}
          onOpenProcure={(id) => {
            setSelectedMaterialId(id);
            setActiveView('procurement');
          }}
        />
      )}

      {/* 22-Step Interactive Walkthrough Modal */}
      <GuidedDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onNavigate={(view, id) => {
          handleNavigate(view, id);
        }}
      />
    </div>
  );
};

export default App;
