'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Loader2, Package } from 'lucide-react';
import Header from '@/components/layout/Header';
import PartCard from '@/components/parts/PartCard';
import VehicleIdentificationModal from '@/components/vehicle/VehicleIdentificationModal';
import { useVehicle } from '@/lib/context/VehicleContext';
import { PartResult } from '@/types';

const COMMON_SEARCHES = [
  'Oil filter', 'Brake pads', 'Air filter', 'Spark plugs', 'Cabin filter',
  'Wiper blades', 'Battery', 'Alternator', 'Starter motor', 'Oxygen sensor',
];

function PartsContent() {
  const searchParams = useSearchParams();
  const { activeVehicle } = useVehicle();
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [parts, setParts] = useState<PartResult[]>([]);
  const [companionParts, setCompanionParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Filters
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('fitConfidence');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && activeVehicle) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams, activeVehicle]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    if (!activeVehicle) {
      setShowVehicleModal(true);
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch('/api/parts/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, vehicle: activeVehicle }),
      });

      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setParts(data.parts || []);
      setCompanionParts(data.companionParts || []);
    } catch {
      setError('Failed to search parts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = parts
    .filter(p => {
      if (inStockOnly && !p.inStock) return false;
      if (minPrice && p.price < parseFloat(minPrice)) return false;
      if (maxPrice && p.price > parseFloat(maxPrice)) return false;
      if (selectedSources.length > 0 && !selectedSources.includes(p.source)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'fitConfidence') return b.fitConfidence - a.fitConfidence;
      return 0;
    });

  const SOURCES = ['AutoZone', 'RockAuto', 'NAPA', 'OReilly', 'Amazon'];

  return (
    <>
      <VehicleIdentificationModal isOpen={showVehicleModal} onClose={() => setShowVehicleModal(false)} />
      <Header
        onVehicleClick={() => setShowVehicleModal(true)}
        onSearchSubmit={(q) => { setQuery(q); handleSearch(q); }}
        isPro={false}
      />

      <div className="min-h-screen bg-[#060608]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Parts Search</h1>
            {activeVehicle && (
              <p className="text-[#6b7280] text-sm">
                AI-matched for: {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} {activeVehicle.trim}
              </p>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search for parts, e.g. 'oil filter', 'brake pads'..."
                className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#C45000] transition-colors"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="hidden sm:inline">Search</span>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border transition-colors ${showFilters ? 'border-[#C45000] text-[#C45000]' : 'border-[#1e1e2e] text-[#6b7280]'} bg-[#12121a]`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Common Searches */}
          {!searched && (
            <div className="mb-6">
              <p className="text-[#6b7280] text-sm mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_SEARCHES.map(term => (
                  <button
                    key={term}
                    onClick={() => { setQuery(term); handleSearch(term); }}
                    className="bg-[#12121a] border border-[#1e1e2e] text-[#6b7280] hover:text-white hover:border-[#C45000]/50 text-sm px-3 py-1.5 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-[#6b7280] mb-1 block">Min Price</label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      placeholder="$0"
                      className="w-full bg-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C45000] border border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#6b7280] mb-1 block">Max Price</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      placeholder="$999"
                      className="w-full bg-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C45000] border border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#6b7280] mb-1 block">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="w-full bg-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                    >
                      <option value="fitConfidence">Best Fit</option>
                      <option value="price">Price: Low to High</option>
                      <option value="priceDesc">Price: High to Low</option>
                      <option value="rating">Best Rating</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={e => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 accent-[#C45000]"
                      />
                      <span className="text-sm text-white">In Stock Only</span>
                    </label>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-[#6b7280] mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {SOURCES.map(source => (
                      <button
                        key={source}
                        onClick={() => setSelectedSources(prev =>
                          prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
                        )}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          selectedSources.includes(source)
                            ? 'border-[#C45000] text-[#C45000] bg-[#C45000]/10'
                            : 'border-[#1e1e2e] text-[#6b7280]'
                        }`}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No Vehicle Warning */}
          {!activeVehicle && (
            <div className="bg-[#C45000]/10 border border-[#C45000]/30 rounded-xl p-4 mb-6 flex items-center gap-3">
              <Package className="w-5 h-5 text-[#C45000] shrink-0" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Add your vehicle for AI-matched results</p>
                <p className="text-[#6b7280] text-xs">Parts will be verified to fit your specific vehicle</p>
              </div>
              <button
                onClick={() => setShowVehicleModal(true)}
                className="text-[#C45000] text-sm font-medium hover:underline whitespace-nowrap"
              >
                Add Vehicle
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
              <button onClick={() => handleSearch()} className="mt-3 text-[#C45000] hover:underline">Try Again</button>
            </div>
          )}

          {/* Results */}
          {!loading && filteredParts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#6b7280] text-sm">{filteredParts.length} results for &quot;{query}&quot;</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredParts.map((part, i) => (
                  <motion.div
                    key={part.partNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <PartCard part={part} />
                  </motion.div>
                ))}
              </div>

              {/* Companion Parts */}
              {companionParts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5"
                >
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#C45000]" />
                    Commonly Replaced Together
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {companionParts.map((part, i) => (
                      <button
                        key={i}
                        onClick={() => { setQuery(part); handleSearch(part); }}
                        className="bg-[#1e1e2e] hover:bg-[#C45000]/20 hover:border-[#C45000]/50 border border-[#1e1e2e] text-white text-sm px-3 py-1.5 rounded-full transition-colors"
                      >
                        {part}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!loading && searched && filteredParts.length === 0 && !error && (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-[#6b7280] mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No parts found</h3>
              <p className="text-[#6b7280] text-sm">Try a different search term or adjust your filters</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function PartsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060608]" />}>
      <PartsContent />
    </Suspense>
  );
}
