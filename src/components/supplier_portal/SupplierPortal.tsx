import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  Boxes,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  Plus,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { store } from '../../services/store';
import { ProcurementRequest, Order, Offer } from '../../types';

interface SupplierPortalProps {
  initialTab?: string;
  onNavigate: (view: string) => void;
}

export const SupplierPortal: React.FC<SupplierPortalProps> = ({
  initialTab = 'opportunities',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'inventory' | 'offers' | 'orders'>(
    initialTab as any || 'opportunities'
  );

  const currentUser = store.getCurrentUser();
  const currentOrg = store.getCurrentOrganization();
  const suppliers = store.getSuppliers();
  const currentSupplier = suppliers.find((s) => s.id === currentUser.organizationId) || suppliers[0];

  const state = store.getState();
  const openRequests = state.procurementRequests.filter((pr) => pr.status === 'OPEN' || pr.status === 'OFFERS_RECEIVED');
  const myOffers = state.offers.filter((o) => o.supplierId === currentSupplier.id);
  const myOrders = state.orders.filter((o) => o.supplierId === currentSupplier.id);
  const myInventory = state.supplierInventory.filter((si) => si.supplierId === currentSupplier.id);

  // Submit Offer Modal
  const [selectedPR, setSelectedPR] = useState<ProcurementRequest | null>(null);
  const [offerForm, setOfferForm] = useState({
    quantity: 2,
    unitPrice: 4800,
    deliveryTimeDays: 7,
    availableDate: 'Immediate Ex-Stock Kampala',
    certificationOffered: 'API 682, ISO 9001:2015, Mill Test Cert 3.1',
    validityDate: '30 Days from submission',
    notes: 'Seal faces inspected and nitrogen pressure tested prior to field dispatch.',
  });

  // Delay reporting modal
  const [delayOrder, setDelayOrder] = useState<Order | null>(null);
  const [delayReason, setDelayReason] = useState('Customs clearance inspection delay at border post');
  const [newArrivalDate, setNewArrivalDate] = useState('2026-10-24');

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPR) return;

    store.submitOffer({
      procurementRequestId: selectedPR.id,
      supplierId: currentSupplier.id,
      supplierName: currentSupplier.name,
      quantity: Number(offerForm.quantity),
      unitPrice: Number(offerForm.unitPrice),
      deliveryTimeDays: Number(offerForm.deliveryTimeDays),
      availableDate: offerForm.availableDate,
      certificationOffered: offerForm.certificationOffered,
      validityDate: offerForm.validityDate,
      notes: offerForm.notes,
    });

    setSelectedPR(null);
    setActiveTab('offers');
    alert(`Proposal submitted to ${selectedPR.facilityName} for tender ${selectedPR.requestNumber}!`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    store.updateOrderStatus(orderId, status);
  };

  const handleReportDelay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delayOrder) return;
    store.updateOrderStatus(delayOrder.id, delayOrder.status, {
      delayedReason: delayReason,
      newArrivalDate,
    });
    setDelayOrder(null);
    alert('Shipment delay notification broadcasted to buyer operations.');
  };

  const handleRespondCancellation = (orderId: string, decision: 'ACCEPTED' | 'DECLINED') => {
    store.respondToCancellation(orderId, decision, decision === 'ACCEPTED' ? 'Cancellation accepted; restocking fee waived.' : 'Items already packaged and in dispatch transit.');
  };

  return (
    <div className="space-y-6">
      {/* Supplier Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-teal-950/40 p-5 rounded-2xl border border-teal-700/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold uppercase tracking-wider border border-teal-500/30">
              Supplier Partner Portal
            </span>
            <span className="text-xs text-teal-200/60">•</span>
            <span className="text-xs text-teal-200/80">{currentSupplier.name} ({currentSupplier.city}, {currentSupplier.country})</span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight mt-1">
            Vendor Operations &amp; Dispatch Console
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Respond to tender opportunities, manage regional spares, and broadcast real-time delivery milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-right">
            <div className="text-[10px] uppercase text-slate-400 font-semibold">On-Time Performance</div>
            <div className="text-base font-black text-emerald-400">{currentSupplier.onTimeDeliveryRate}%</div>
          </div>
        </div>
      </div>

      {/* Supplier Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'opportunities'
              ? 'bg-slate-800 text-teal-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Tender Opportunities ({openRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-slate-800 text-teal-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>My Spares Catalog ({myInventory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'offers'
              ? 'bg-slate-800 text-teal-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Submitted Offers ({myOffers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-slate-800 text-teal-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Active Purchase Orders ({myOrders.length})</span>
        </button>
      </div>

      {/* Tab: Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Active RFQs &amp; Critical Spare Inquiries issued by client operating companies.
            </span>
          </div>

          <div className="grid gap-4">
            {openRequests.map((pr) => {
              const myExistingOffer = myOffers.find((o) => o.procurementRequestId === pr.id);

              return (
                <div key={pr.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">{pr.requestNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
                          {pr.priority} Priority
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-base mt-1">{pr.materialName} ({pr.materialCode})</h3>
                      <p className="text-xs text-slate-400">Buyer Facility: {pr.facilityName} • Need by: {new Date(pr.requiredDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase text-slate-400">Required Quantity</div>
                      <div className="text-xl font-black text-white">{pr.quantity} Units</div>
                    </div>
                  </div>

                  <div className="py-3 text-xs text-slate-300 space-y-2">
                    <div>
                      <span className="font-semibold text-slate-400 block text-[10px] uppercase">Specification:</span>
                      <p className="mt-0.5">{pr.specification}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400 block text-[10px] uppercase">Mandatory Certifications:</span>
                      <p className="mt-0.5">{pr.certificationRequirement}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Destination: {pr.deliveryLocation}
                    </span>

                    {myExistingOffer ? (
                      <span className="px-3 py-1 rounded bg-teal-500/20 text-teal-300 text-xs font-bold">
                        Offer Submitted (${myExistingOffer.totalPrice.toLocaleString()})
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedPR(pr);
                          setOfferForm({ ...offerForm, quantity: pr.quantity });
                        }}
                        className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Priced Offer</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Spares Catalog */}
      {activeTab === 'inventory' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider">Stocked Spares Registry</span>
            <span className="text-slate-400">Ex-Stock Regional Depots</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-[10px] uppercase text-slate-400">
              <tr>
                <th className="p-3">Material Name &amp; Code</th>
                <th className="p-3 text-center">Available Stock</th>
                <th className="p-3 text-center">Standard Unit Price</th>
                <th className="p-3">Turnaround Lead Time</th>
                <th className="p-3">Warehouse Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {myInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-bold text-slate-100">{item.materialName}</div>
                    <div className="font-mono text-[10px] text-slate-400">{item.category}</div>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-400">
                    {item.quantityAvailable} units
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-slate-200">
                    ${item.price.toLocaleString()} {item.currency}
                  </td>
                  <td className="p-3 font-mono text-amber-300">
                    {item.leadTimeDays} Calendar Days
                  </td>
                  <td className="p-3 text-slate-400">
                    {item.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Submitted Offers */}
      {activeTab === 'offers' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 text-xs font-bold text-white uppercase tracking-wider">
            Commercial Offers History
          </div>
          <div className="divide-y divide-slate-800/60">
            {myOffers.map((o) => (
              <div key={o.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-100 text-sm">Offer for Tender {o.procurementRequestId}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Qty: {o.quantity} units • Delivery: {o.deliveryTimeDays} days • Cert: {o.certificationOffered}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-white font-mono">${o.totalPrice.toLocaleString()} {o.currency}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 inline-block ${
                    o.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Orders & Dispatch */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {myOrders.map((ord) => {
            const hasCancellationRequest = ord.status === 'CANCELLATION REQUESTED';

            return (
              <div key={ord.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <span className="font-mono text-xs font-bold text-teal-400">{ord.orderNumber}</span>
                    <h3 className="font-bold text-white text-base mt-0.5">{ord.materialName}</h3>
                    <p className="text-xs text-slate-400">Buyer: {ord.organizationName} • Qty: {ord.quantity} units</p>
                  </div>

                  <div className="text-right">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                      ord.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {ord.status}
                    </span>
                    <div className="font-mono font-bold text-white text-sm mt-1">${ord.totalPrice.toLocaleString()} {ord.currency}</div>
                  </div>
                </div>

                {/* Cancellation Request Alert (Section 80) */}
                {hasCancellationRequest && (
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/50 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Buyer Requested Order Cancellation</span>
                    </div>
                    <p className="text-slate-300">
                      Reason given: "{ord.cancellationDetails?.reason || 'Schedule adjustment'}"
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleRespondCancellation(ord.id, 'ACCEPTED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                      >
                        Accept Cancellation
                      </button>
                      <button
                        onClick={() => handleRespondCancellation(ord.id, 'DECLINED')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
                      >
                        Decline (Already Dispatched)
                      </button>
                    </div>
                  </div>
                )}

                {/* Dispatch Controls */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400">
                    Tracking Ref: <span className="font-mono text-slate-200 font-bold">{ord.deliveryDetails.trackingRef}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDelayOrder(ord)}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-semibold cursor-pointer"
                    >
                      Report Shipment Delay
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'PREPARING')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
                    >
                      Staging / Prep
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'IN DELIVERY')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                    >
                      Dispatch Transit
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'DELIVERED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                    >
                      Delivered at Gate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Offer Modal */}
      {selectedPR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-teal-400" />
                <span>Submit Supplier Proposal</span>
              </h3>
              <button onClick={() => setSelectedPR(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-4 pt-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="font-bold text-white">{selectedPR.materialName}</div>
                <div className="text-[11px] text-slate-400">Tender: {selectedPR.requestNumber} • Req Date: {selectedPR.requiredDate}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit Price (USD) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={offerForm.unitPrice}
                    onChange={(e) => setOfferForm({ ...offerForm, unitPrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Delivery Lead Time (Days) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={offerForm.deliveryTimeDays}
                    onChange={(e) => setOfferForm({ ...offerForm, deliveryTimeDays: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold text-teal-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Stock Availability</label>
                <input
                  type="text"
                  value={offerForm.availableDate}
                  onChange={(e) => setOfferForm({ ...offerForm, availableDate: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Quality Certifications Included</label>
                <input
                  type="text"
                  value={offerForm.certificationOffered}
                  onChange={(e) => setOfferForm({ ...offerForm, certificationOffered: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes &amp; Commercial Terms</label>
                <textarea
                  rows={2}
                  value={offerForm.notes}
                  onChange={(e) => setOfferForm({ ...offerForm, notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedPR(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold cursor-pointer"
                >
                  Submit Official Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Delay Modal */}
      {delayOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Report Shipment Transit Delay</span>
              </h3>
              <button onClick={() => setDelayOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleReportDelay} className="space-y-4 pt-4 text-xs">
              <p className="text-slate-300">
                Reporting a delay on <strong>{delayOrder.orderNumber}</strong> ({delayOrder.materialName}).
              </p>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cause of Delay *</label>
                <textarea
                  rows={2}
                  required
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Revised Estimated Arrival Date *</label>
                <input
                  type="date"
                  required
                  value={newArrivalDate}
                  onChange={(e) => setNewArrivalDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDelayOrder(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                >
                  Transmit Delay Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
