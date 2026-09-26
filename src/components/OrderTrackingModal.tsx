import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';
import { X, Search, CheckCircle2, Clock, Truck, PackageCheck, AlertCircle } from 'lucide-react';

const STATUS_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipping',
  'Delivered',
];

export const OrderTrackingModal: React.FC = () => {
  const { isTrackingOpen, setIsTrackingOpen, trackingOrderId, setTrackingOrderId } = useStore();

  const [inputOrderId, setInputOrderId] = useState(trackingOrderId || '');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (trackingOrderId) {
      setInputOrderId(trackingOrderId);
      findOrder(trackingOrderId);
    }
  }, [trackingOrderId]);

  if (!isTrackingOpen) return null;

  const findOrder = async (id: string) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const orders = await api.getOrders();
      const match = orders.find(
        (o) =>
          o.id.toLowerCase() === id.trim().toLowerCase() ||
          o.phone.replace(/[^0-9]/g, '').includes(id.trim().replace(/[^0-9]/g, ''))
      );
      setMatchedOrder(match || null);
    } catch (e) {
      console.error(e);
      setMatchedOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOrderId.trim()) {
      findOrder(inputOrderId);
    }
  };

  const currentStepIndex = matchedOrder
    ? STATUS_STEPS.indexOf(matchedOrder.orderStatus as OrderStatus)
    : -1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-stone-900">
              Track Your Tableware Order
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Enter your Order ID or registered mobile number to check real-time progress
            </p>
          </div>
          <button
            onClick={() => {
              setIsTrackingOpen(false);
              setTrackingOrderId('');
            }}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. ORD-2026-9182) or Phone"
                value={inputOrderId}
                onChange={(e) => setInputOrderId(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? 'Searching...' : 'Track'}</span>
            </button>
          </form>

          {/* Results Display */}
          {matchedOrder ? (
            <div className="space-y-6">
              {/* Order Meta Bar */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-stone-400 block text-[11px]">ORDER NUMBER</span>
                  <span className="font-bold text-sm text-stone-900">{matchedOrder.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[11px]">CURRENT STATUS</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {matchedOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-3 py-2">
                <div className="relative flex justify-between">
                  {/* Connecting Line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-stone-200 -z-0" />
                  <div
                    className="absolute top-4 left-4 h-0.5 bg-[#BE9346] -z-0 transition-all duration-500"
                    style={{
                      width: `${Math.max(0, Math.min(100, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100))}%`,
                    }}
                  />

                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div key={step} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCompleted
                              ? 'bg-stone-900 text-[#EDE0C2]'
                              : 'bg-white border-2 border-stone-300 text-stone-400'
                          } ${isCurrent ? 'ring-4 ring-[#BE9346]/20' : ''}`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] mt-2 text-center max-w-[65px] ${
                            isCurrent ? 'font-bold text-stone-900' : 'text-stone-500'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Snapshot */}
              <div className="border border-stone-200 rounded-xl p-3.5 bg-stone-50/50 space-y-2 text-xs">
                <div className="font-semibold text-stone-800">Delivery Details</div>
                <div className="text-stone-600">
                  Recipient: <strong>{matchedOrder.customerName}</strong> ({matchedOrder.phone})
                </div>
                <div className="text-stone-600">Address: {matchedOrder.fullAddress}, {matchedOrder.district}</div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-stone-800 font-medium">
                  <span>Total Amount ({matchedOrder.paymentMethod}):</span>
                  <span className="font-display font-bold tabular-nums">৳{matchedOrder.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : hasSearched && !isSearching ? (
            <div className="p-6 text-center space-y-2 bg-stone-50 rounded-xl border border-stone-200">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <div className="font-semibold text-sm text-stone-900">No order found with this ID</div>
              <div className="text-xs text-stone-500 max-w-sm mx-auto">
                Please double check the Order ID from your confirmation screen (e.g. <code>ORD-2026-9182</code>) or the mobile number entered during checkout.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
