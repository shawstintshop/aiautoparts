'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle, Star, Shield, Truck, Package, Zap, ExternalLink } from 'lucide-react';
import { PartResult, DeliveryOption } from '@/types';
import { useCart } from '@/lib/context/CartContext';

interface PartCardProps {
  part: PartResult;
}

const SOURCE_COLORS: Record<string, string> = {
  AutoZone: '#FF6600',
  RockAuto: '#CC0000',
  NAPA: '#003087',
  OReilly: '#CC0000',
  Amazon: '#FF9900',
};

const DELIVERY_ICONS = [Zap, Truck, Package, Package];

export default function PartCard({ part }: PartCardProps) {
  const { addItem, items } = useCart();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(part.shippingOptions[1]);
  const [showDelivery, setShowDelivery] = useState(false);
  const [added, setAdded] = useState(false);

  const isInCart = items.some(i => i.part.partNumber === part.partNumber);

  const handleAddToCart = () => {
    addItem(part, selectedDelivery);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const savings = part.msrpPrice - part.price;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden hover:border-[#C45000]/50 transition-colors"
    >
      {/* Source Badge */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded text-white"
          style={{ backgroundColor: SOURCE_COLORS[part.source] || '#666' }}
        >
          {part.source}
        </span>
        {part.aiVerified && (
          <span className="flex items-center gap-1 text-xs text-[#C45000]">
            <Shield className="w-3 h-3" />
            AI Verified
          </span>
        )}
      </div>

      <div className="p-4 pt-2">
        {/* Part Info */}
        <h3 className="text-white font-semibold text-sm leading-tight">{part.partName}</h3>
        <p className="text-[#6b7280] text-xs mt-0.5">{part.brand} · {part.partNumber}</p>

        {part.description && (
          <p className="text-[#6b7280] text-xs mt-2 line-clamp-2">{part.description}</p>
        )}

        {/* Fit Confidence */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 bg-[#1e1e2e] rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-green-500"
              style={{ width: `${part.fitConfidence}%` }}
            />
          </div>
          <span className="text-green-400 text-xs font-semibold">{part.fitConfidence}% fit</span>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          {[1,2,3,4,5].map(star => (
            <Star
              key={star}
              className={`w-3 h-3 ${star <= Math.round(part.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-[#6b7280]'}`}
            />
          ))}
          <span className="text-[#6b7280] text-xs ml-1">({part.reviewCount.toLocaleString()})</span>
          <span className={`ml-auto text-xs ${part.inStock ? 'text-green-400' : 'text-red-400'}`}>
            {part.inStock ? '✓ In Stock' : '✗ Out of Stock'}
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-white">${part.price.toFixed(2)}</span>
            {savings > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[#6b7280] text-xs line-through">${part.msrpPrice.toFixed(2)}</span>
                <span className="text-green-400 text-xs">Save ${savings.toFixed(2)}</span>
              </div>
            )}
          </div>
          <a
            href={part.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6b7280] hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Delivery Selection */}
        <div className="mt-3">
          <button
            onClick={() => setShowDelivery(!showDelivery)}
            className="text-xs text-[#C45000] hover:underline"
          >
            {selectedDelivery.name} · {selectedDelivery.price === 0 ? 'Free' : `$${selectedDelivery.price}`} →
          </button>

          {showDelivery && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 space-y-1"
            >
              {part.shippingOptions.map((option) => {
                const Icon = DELIVERY_ICONS[option.tier - 1] || Package;
                return (
                  <button
                    key={option.tier}
                    onClick={() => { setSelectedDelivery(option); setShowDelivery(false); }}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                      selectedDelivery.tier === option.tier
                        ? 'bg-[#C45000]/20 border border-[#C45000]/50 text-white'
                        : 'bg-[#1e1e2e] text-[#6b7280] hover:bg-[#C45000]/10'
                    }`}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    <div className="flex-1 text-left">
                      <span className="font-medium">{option.name}</span>
                      <span className="text-[#6b7280] ml-1">· {option.eta}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {option.badge && (
                        <span className="bg-[#C45000] text-white text-[10px] px-1 rounded">{option.badge}</span>
                      )}
                      <span className="font-semibold">
                        {option.price === 0 ? 'Free' : `$${option.price}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!part.inStock || isInCart}
          className="mt-3 w-full py-2 rounded-lg font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          style={{ background: added || isInCart ? '#22c55e' : 'linear-gradient(135deg, #C45000, #FF6A00)' }}
        >
          {added || isInCart ? (
            <>
              <CheckCircle className="w-4 h-4" />
              {isInCart ? 'In Cart' : 'Added!'}
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
