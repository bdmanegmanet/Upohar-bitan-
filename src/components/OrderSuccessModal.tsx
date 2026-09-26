import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, X, Printer, Package, MessageSquare, Copy } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, setIsTrackingOpen, setTrackingOrderId, settings, showToast } =
    useStore();

  if (!lastPlacedOrder) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(lastPlacedOrder.id);
    showToast(`Copied Order ID: ${lastPlacedOrder.id}`);
  };

  const handleTrack = () => {
    setTrackingOrderId(lastPlacedOrder.id);
    setLastPlacedOrder(null);
    setIsTrackingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-6 sm:p-8 text-center relative">
          <button
            onClick={() => setLastPlacedOrder(null)}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1.5 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-emerald-800/80 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-emerald-200">
            Order Confirmed & Synchronized
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1 text-white">
            Thank You, {lastPlacedOrder.customerName}!
          </h2>
          <p className="text-xs text-emerald-200 max-w-md mx-auto mt-2">
            Your crockery order has been received, logged in our Google Sheets backend, and queued for 5-layer shockproof packing.
          </p>

          {/* Order ID Pill */}
          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-950/60 px-4 py-2 rounded-lg border border-emerald-700/50">
            <span className="text-xs text-emerald-300">Order ID:</span>
            <span className="font-mono font-bold text-sm tracking-wide text-white">
              {lastPlacedOrder.id}
            </span>
            <button
              onClick={handleCopyId}
              className="text-emerald-300 hover:text-white ml-1 cursor-pointer"
              title="Copy Order ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Order Meta Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 block text-[11px]">Order Date</span>
              <span className="font-medium text-stone-900">
                {new Date(lastPlacedOrder.orderDate).toLocaleDateString()}
              </span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 block text-[11px]">Payment</span>
              <span className="font-medium text-stone-900">{lastPlacedOrder.paymentMethod}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 block text-[11px]">Status</span>
              <span className="font-semibold text-amber-700">{lastPlacedOrder.orderStatus}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-stone-400 block text-[11px]">Estimated Delivery</span>
              <span className="font-medium text-stone-900">24-48 Hours</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
            <div className="text-stone-500 font-semibold mb-1 uppercase tracking-wider text-[11px]">
              Shipping Destination
            </div>
            <div className="font-medium text-stone-900">{lastPlacedOrder.customerName}</div>
            <div className="text-stone-600">{lastPlacedOrder.fullAddress}</div>
            <div className="text-stone-600">
              {lastPlacedOrder.district}, {lastPlacedOrder.division} · Phone: {lastPlacedOrder.phone}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Purchased Items
            </div>
            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200 text-xs">
              {lastPlacedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div>
                      <div className="font-medium text-stone-900">{item.productName}</div>
                      <div className="text-[11px] text-stone-500">
                        Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-stone-900 tabular-nums">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}

              <div className="p-3 bg-stone-50 space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums">৳{lastPlacedOrder.subtotal.toLocaleString()}</span>
                </div>
                {lastPlacedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>
                      Coupon Discount {lastPlacedOrder.notes ? `(${lastPlacedOrder.notes})` : ''}
                    </span>
                    <span className="tabular-nums">-৳{lastPlacedOrder.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="tabular-nums">
                    {lastPlacedOrder.deliveryCharge === 0 ? 'Free' : `৳${lastPlacedOrder.deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="font-display text-base tabular-nums">
                    ৳{lastPlacedOrder.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#FAF8F5] border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>Print Invoice</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello Aura Tableware Concierge, I just placed Order #${lastPlacedOrder.id}. Please confirm my shipment!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Concierge</span>
            </a>

            <button
              onClick={handleTrack}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#EDE0C2]" />
              <span>Track Live Status</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
