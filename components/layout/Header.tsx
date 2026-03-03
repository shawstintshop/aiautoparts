'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useVehicle } from '@/lib/context/VehicleContext';
import { useCart } from '@/lib/context/CartContext';
import { Search, ShoppingCart, Zap, ChevronDown, Car, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onVehicleClick: () => void;
  onSearchSubmit: (query: string) => void;
  isPro: boolean;
}

export default function Header({ onVehicleClick, onSearchSubmit, isPro }: HeaderProps) {
  const { activeVehicle } = useVehicle();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d0d10] border-b border-[#1e1e2e] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl tracking-wider text-white hidden sm:block" style={{ fontFamily: 'var(--font-bebas, sans-serif)' }}>AUTOGENIUS</span>
        </Link>

        {/* Vehicle Pill */}
        <button
          onClick={onVehicleClick}
          className="flex items-center gap-2 bg-[#12121a] border border-[#1e1e2e] rounded-full px-3 py-1.5 text-sm hover:border-[#C45000] transition-colors shrink-0"
        >
          <Car className="w-4 h-4 text-[#C45000]" />
          {activeVehicle ? (
            <span className="text-white hidden md:block">
              {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
            </span>
          ) : (
            <span className="text-[#6b7280] hidden md:block">Add Vehicle</span>
          )}
          <ChevronDown className="w-3 h-3 text-[#6b7280]" />
        </button>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parts, symptoms, codes..."
            className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#C45000] transition-colors"
          />
        </form>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {isPro ? (
            <span className="text-white text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}>PRO</span>
          ) : (
            <Link href="/membership" className="hidden sm:flex items-center gap-1 text-[#C45000] text-sm font-medium hover:text-[#FF6A00] transition-colors">
              Join Pro
            </Link>
          )}

          <Link href="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 text-white hover:text-[#C45000] transition-colors" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-[#C45000] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </Link>

          <Link href="/auth">
            <LogIn className="w-5 h-5 text-white hover:text-[#C45000] transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  );
}
