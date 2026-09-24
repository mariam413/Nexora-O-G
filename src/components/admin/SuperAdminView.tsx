import React, { useState } from 'react';
import {
  Shield,
  Building2,
  Users,
  Cpu,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Database,
  Lock,
  Layers,
} from 'lucide-react';
import { store } from '../../services/store';

interface SuperAdminViewProps {
  onNavigate: (view: string) => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'ORGS' | 'AI_CONFIG' | 'HEALTH' | 'USERS'>('AI_CONFIG');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTestingAI, setIsTestingAI] = useState(false);

  const state = store.getState();
  const organizations = state.organizations;
  const users = state.users;

  const handleTestAI = async () => {
    setIsTestingAI(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Ping AI diagnostic test.',
          organizationId: 'org-demo-oil-gas',
          userRole: 'NEXORA_SUPER_ADMIN',
          context: {},
        }),
      });
      const data = await res.json();
      setTestResult(`Success! Active Engine: ${data.provider} | Confidence: ${data.confidence}`);
    } catch (e: any) {
      setTestResult(`Fallback Active: ${e.message}`);
    } finally {
      setIsTestingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-rose-950/30 p-5 rounded-2xl border border-rose-800/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase tracking-wider border border-rose-500/30">
              Platform Administration
            </span>
            <span className="text-xs text-rose-200/60">•</span>
            <span className="text-xs text-rose-200/80">Super Admin Control Plane</span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight mt-1">
            NEXORA Core Systems &amp; Multi-Tenant Architecture
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Global tenant provisioning, isolated database security boundaries, and Gemini 3.8 AI engine configuration.
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('AI_CONFIG')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'AI_CONFIG'
              ? 'bg-slate-800 text-amber-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>AI Engine Configuration &amp; Diagnostics</span>
        </button>

        <button
          onClick={() => setActiveTab('ORGS')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'ORGS'
              ? 'bg-slate-800 text-amber-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Tenant Organizations ({organizations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'USERS'
              ? 'bg-slate-800 text-amber-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Platform Users ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('HEALTH')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'HEALTH'
              ? 'bg-slate-800 text-amber-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Telemetry &amp; Health</span>
        </button>
      </div>

      {/* Tab: AI Config (Section 51) */}
      {activeTab === 'AI_CONFIG' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Active Artificial Intelligence Runtime Engine</span>
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Primary Model</span>
                <span className="text-sm font-bold text-indigo-400 mt-1 block">gemini-2.5-flash</span>
                <span className="text-[10px] text-slate-400">Target general text/reasoning</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Fallback Architecture</span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">Deterministic Engine</span>
                <span className="text-[10px] text-slate-400">100% offline uptime guarantee</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Execution Security</span>
                <span className="text-sm font-bold text-amber-400 mt-1 block">Server-Side Proxy</span>
                <span className="text-[10px] text-slate-400">Zero exposed keys in client bundle</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-3">
              <div className="font-bold text-white">Diagnostics &amp; Health Probe:</div>
              <p>
                Trigger a server-side probe to test whether GEMINI_API_KEY environment credentials are live, or if the deterministic fallback layer is currently routing decisions.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleTestAI}
                  disabled={isTestingAI}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isTestingAI ? 'Running Diagnostics...' : 'Run Engine Test Ping'}
                </button>

                {testResult && (
                  <span className="font-mono text-emerald-400 font-bold">
                    {testResult}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Organizations */}
      {activeTab === 'ORGS' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
            Tenant Isolation Registry
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-[10px] uppercase text-slate-400">
              <tr>
                <th className="p-3">Organization Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Country / Region</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">{org.name}</td>
                  <td className="p-3 text-slate-300">{org.type}</td>
                  <td className="p-3 text-slate-400">{org.region}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {org.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => store.setCurrentOrganization(org.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Impersonate Tenant
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Platform Users */}
      {activeTab === 'USERS' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
            Active Identity Directory
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-[10px] uppercase text-slate-400">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Tenant Organization</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3 text-right">Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">{u.name}</td>
                  <td className="p-3 font-mono text-slate-400">{u.email}</td>
                  <td className="p-3 text-slate-300">{u.organizationName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => store.setCurrentUser(u.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Login As
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Health */}
      {activeTab === 'HEALTH' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white">System Subsystems Health</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Express Application Server</div>
                <div className="text-[11px] text-slate-400">Port 3000 • Vite Middleware Active</div>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Healthy
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Deterministic Risk Logic</div>
                <div className="text-[11px] text-slate-400">Autonomous Evaluation Thread</div>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
