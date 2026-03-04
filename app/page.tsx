'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Search, Activity, MapPin, BookOpen, ChevronRight, AlertTriangle, TrendingUp, Clock, Shield, Star, Car } from 'lucide-react';
import Header from '@/components/layout/Header';
import VehicleIdentificationModal from '@/components/vehicle/VehicleIdentificationModal';
import { useVehicle } from '@/lib/context/VehicleContext';
import Link from 'next/link';

interface KnowledgeData {
  commonProblems: Array<{
    issue: string;
    frequency: string;
    severity: string;
    estimatedCost: string;
    diyFriendly: boolean;
    symptoms: string[];
  }>;
  popularUpgrades: Array<{
    name: string;
    category: string;
    costRange: string;
    difficulty: string;
    performanceGain: string;
  }>;
  serviceIntervals: Array<{
    service: string;
    interval: string;
    cost: string;
  }>;
}

export default function HomePage() {
  const { activeVehicle } = useVehicle();
  const [showSplash, setShowSplash] = useState(true);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [knowledge, setKnowledge] = useState<KnowledgeData | null>(null);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'problems' | 'upgrades' | 'service'>('problems');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      const saved = localStorage.getItem('autogenius_vehicles');
      if (!saved || JSON.parse(saved).length === 0) {
        setShowVehicleModal(true);
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeVehicle && !knowledge) {
      fetchKnowledge();
    }
  }, [activeVehicle]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchKnowledge = async () => {
    if (!activeVehicle) return;
    setKnowledgeLoading(true);
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: activeVehicle.year,
          make: activeVehicle.make,
          model: activeVehicle.model,
        }),
      });
      const data = await res.json();
      setKnowledge(data);
    } catch (err) {
      console.error('Failed to fetch knowledge', err);
    } finally {
      setKnowledgeLoading(false);
    }
  };

  const severityColor: Record<string, string> = {
    low: 'text-green-400 bg-green-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    high: 'text-orange-400 bg-orange-400/10',
    critical: 'text-red-400 bg-red-400/10',
  };

  const quickActions = [
    { icon: Search, label: 'Find Parts', href: '/parts', color: '#C45000', desc: 'AI-matched for your vehicle' },
    { icon: Activity, label: 'Diagnose', href: '/diagnostic', color: '#8B5CF6', desc: 'OBD codes & symptoms' },
    { icon: MapPin, label: 'Mechanics', href: '/mechanics', color: '#3B82F6', desc: 'Verified local shops' },
    { icon: BookOpen, label: 'Repair Guides', href: '/guides', color: '#10B981', desc: 'Step-by-step DIY' },
  ];

  return (
    <>
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-[#060608] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: 'linear' }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-5xl font-bold text-white tracking-widest" style={{ fontFamily: 'var(--font-bebas, sans-serif)' }}>
                AUTOGENIUS
              </h1>
              <p className="text-[#6b7280] mt-2">AI Auto Intelligence Platform</p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-0.5 bg-gradient-to-r from-[#C45000] to-[#FF6A00] mt-6 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VehicleIdentificationModal isOpen={showVehicleModal} onClose={() => setShowVehicleModal(false)} />

      <Header
        onVehicleClick={() => setShowVehicleModal(true)}
        onSearchSubmit={(q) => window.location.href = `/parts?q=${encodeURIComponent(q)}`}
        isPro={false}
      />

      <main className="min-h-screen bg-[#060608]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero / Vehicle Banner */}
          {activeVehicle ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden mb-8"
              style={{ background: 'linear-gradient(135deg, #0d0d10, #12121a)' }}
            >
              <div className="p-6 border border-[#1e1e2e] rounded-2xl">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}>
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                      </h2>
                      <p className="text-[#6b7280] mt-0.5">
                        {activeVehicle.trim} · {activeVehicle.engine} · {activeVehicle.drive}
                        {activeVehicle.mileage && ` · ${activeVehicle.mileage.toLocaleString()} mi`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                      activeVehicle.activeDTCs.length > 0
                        ? 'bg-orange-400/10 text-orange-400'
                        : 'bg-green-400/10 text-green-400'
                    }`}>
                      {activeVehicle.activeDTCs.length > 0 ? (
                        <><AlertTriangle className="w-4 h-4" /> {activeVehicle.activeDTCs.length} Issues</>
                      ) : (
                        <><Shield className="w-4 h-4" /> All Clear</>
                      )}
                    </div>
                    <button
                      onClick={() => setShowVehicleModal(true)}
                      className="text-[#6b7280] hover:text-white text-sm transition-colors"
                    >
                      Change Vehicle
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 mb-8"
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}>
                <Car className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome to AutoGenius</h1>
              <p className="text-[#6b7280] mb-6 max-w-md mx-auto">
                Add your vehicle to get AI-powered parts search, diagnostics, repair guides, and more.
              </p>
              <button
                onClick={() => setShowVehicleModal(true)}
                className="px-6 py-3 rounded-xl font-semibold text-white inline-flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
              >
                Add Your Vehicle <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={action.href}
                  className="block bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 hover:border-[#C45000]/50 transition-all group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <p className="text-white font-semibold text-sm">{action.label}</p>
                  <p className="text-[#6b7280] text-xs mt-0.5">{action.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Vehicle Knowledge Section */}
          {activeVehicle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#1e1e2e]">
                <h3 className="text-lg font-bold text-white">
                  {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} Intelligence
                </h3>
                {knowledgeLoading && (
                  <div className="flex items-center gap-2 text-[#6b7280] text-sm">
                    <div className="w-4 h-4 border-2 border-[#C45000] border-t-transparent rounded-full animate-spin" />
                    Loading AI data...
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#1e1e2e]">
                {[
                  { id: 'problems', label: 'Common Problems', icon: AlertTriangle },
                  { id: 'upgrades', label: 'Popular Upgrades', icon: TrendingUp },
                  { id: 'service', label: 'Service Intervals', icon: Clock },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as 'problems' | 'upgrades' | 'service')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === id
                        ? 'text-[#C45000] border-b-2 border-[#C45000]'
                        : 'text-[#6b7280] hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {knowledgeLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-20 bg-[#12121a] rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : knowledge ? (
                  <>
                    {activeTab === 'problems' && (
                      <div className="space-y-3">
                        {knowledge.commonProblems.map((problem, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-white font-medium text-sm">{problem.issue}</h4>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${severityColor[problem.severity] || 'text-gray-400 bg-gray-400/10'}`}>
                                    {problem.severity}
                                  </span>
                                  <span className="text-xs text-[#6b7280]">{problem.frequency}</span>
                                </div>
                                {problem.symptoms?.length > 0 && (
                                  <p className="text-[#6b7280] text-xs mt-1">{problem.symptoms.slice(0, 2).join(' · ')}</p>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-white text-sm font-semibold">{problem.estimatedCost}</p>
                                <p className={`text-xs mt-0.5 ${problem.diyFriendly ? 'text-green-400' : 'text-orange-400'}`}>
                                  {problem.diyFriendly ? 'DIY Friendly' : 'Shop Recommended'}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'upgrades' && (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {knowledge.popularUpgrades.map((upgrade, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4"
                          >
                            <div className="flex items-start gap-2">
                              <Star className="w-4 h-4 text-[#C45000] shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-white font-medium text-sm">{upgrade.name}</h4>
                                <p className="text-[#6b7280] text-xs mt-0.5">{upgrade.performanceGain}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-[#C45000] text-xs font-semibold">{upgrade.costRange}</span>
                                  <span className="text-[#6b7280] text-xs">·</span>
                                  <span className="text-[#6b7280] text-xs">{upgrade.difficulty}</span>
                                  <span className="text-xs px-1.5 py-0.5 rounded text-white text-[10px]"
                                    style={{ backgroundColor: upgrade.category === 'Performance' ? '#C45000' : upgrade.category === 'Safety' ? '#3B82F6' : '#8B5CF6' }}>
                                    {upgrade.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'service' && (
                      <div className="space-y-2">
                        {knowledge.serviceIntervals.map((interval, i) => (
                          <div key={i} className="flex items-center justify-between py-3 border-b border-[#1e1e2e] last:border-0">
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-[#6b7280]" />
                              <div>
                                <p className="text-white text-sm">{interval.service}</p>
                                <p className="text-[#6b7280] text-xs">{interval.interval}</p>
                              </div>
                            </div>
                            <span className="text-[#C45000] font-semibold text-sm">{interval.cost}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#6b7280] text-sm">Click to load AI vehicle intelligence</p>
                    <button
                      onClick={fetchKnowledge}
                      className="mt-3 px-4 py-2 rounded-lg text-sm text-white"
                      style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                    >
                      Load Intelligence
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Pro CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
          >
            <div>
              <h3 className="text-white font-bold text-xl">Get Your FREE OBD-II Scanner</h3>
              <p className="text-white/80 text-sm mt-1">
                Join AutoGenius Pro — scan your car, get AI diagnostics, save on parts
              </p>
            </div>
            <Link
              href="/membership"
              className="bg-white text-[#C45000] font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Start Free Trial
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
