'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Truck, Package, ChevronRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import VehicleIdentificationModal from '@/components/vehicle/VehicleIdentificationModal';
import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setCheckingOut(true);
    await new Promise(r => setTimeout(r, 1500));
    alert('Checkout coming soon! This would integrate with Stripe.');
    setCheckingOut(false);
  };

  const subtotal = items.reduce((sum, item) => sum + item.part.price, 0);
  const shipping = items.reduce((sum, item) => sum + item.selectedDelivery.price, 0);
  const tax = subtotal * 0.08;

  return (
    <>
      <VehicleIdentificationModal isOpen={showVehicleModal} onClose={() => setShowVehicleModal(false)} />
      <Header
        onVehicleClick={() => setShowVehicleModal(true)}
        onSearchSubmit={(q) => window.location.href = `/parts?q=${encodeURIComponent(q)}`}
        isPro={false}
      />

      <div className="min-h-screen bg-[#060608]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/parts" className="text-[#6b7280] hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Cart</h1>
            {items.length > 0 && (
              <span className="bg-[#C45000] text-white text-sm px-2 py-0.5 rounded-full">{items.length}</span>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 text-[#6b7280] mx-auto mb-4" />
              <h3 className="text-white font-semibold text-xl mb-2">Your cart is empty</h3>
              <p className="text-[#6b7280] mb-6">Find parts for your vehicle to get started</p>
              <Link
                href="/parts"
                className="px-6 py-3 rounded-xl text-white font-semibold inline-flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
              >
                Search Parts <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, i) => (
                  <motion.div
                    key={item.part.partNumber}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[#0d0d10] border border-[#1e1e2e] rounded-xl p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-[#12121a] rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-8 h-8 text-[#6b7280]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm">{item.part.partName}</h3>
                        <p className="text-[#6b7280] text-xs mt-0.5">{item.part.brand} · {item.part.partNumber}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Truck className="w-3 h-3 text-[#C45000]" />
                          <span className="text-[#6b7280] text-xs">{item.selectedDelivery.name} · {item.selectedDelivery.eta}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white font-bold">${item.part.price.toFixed(2)}</p>
                        {item.selectedDelivery.price > 0 && (
                          <p className="text-[#6b7280] text-xs">+${item.selectedDelivery.price.toFixed(2)} shipping</p>
                        )}
                        {item.selectedDelivery.price === 0 && (
                          <p className="text-green-400 text-xs">Free shipping</p>
                        )}
                        <button
                          onClick={() => removeItem(item.part.partNumber)}
                          className="text-red-400 hover:text-red-300 mt-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-[#6b7280] hover:text-red-400 text-sm transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl p-5 sticky top-24">
                  <h3 className="text-white font-bold text-lg mb-4">Order Summary</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Subtotal</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Shipping</span>
                      <span className="text-white">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Tax (est.)</span>
                      <span className="text-white">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-[#1e1e2e] pt-3 flex justify-between font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-white text-xl">${(subtotal + shipping + tax).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full mt-6 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                  >
                    {checkingOut ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Checkout · ${(subtotal + shipping + tax).toFixed(2)}</>
                    )}
                  </button>

                  <p className="text-[#6b7280] text-xs text-center mt-3">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
