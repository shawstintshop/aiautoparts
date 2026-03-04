'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Loader2, AlertTriangle, Wrench, Clock, ChevronRight, Package, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import VehicleIdentificationModal from '@/components/vehicle/VehicleIdentificationModal';
import { useVehicle } from '@/lib/context/VehicleContext';
import Link from 'next/link';

interface RepairStep {
  stepNumber: number;
  title: string;
  description: string;
  warning?: string | null;
  tip?: string | null;
}

interface GuideData {
  difficulty: string;
  estimatedTime: string;
  overview: string;
  steps: RepairStep[];
  tools: string[];
  parts: string[];
  torqueSpecs: Record<string, string>;
  warnings: string[];
  commonMistakes: string[];
  relatedJobs?: string[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'text-green-400 bg-green-400/10',
  Intermediate: 'text-yellow-400 bg-yellow-400/10',
  Advanced: 'text-orange-400 bg-orange-400/10',
  'Pro Only': 'text-red-400 bg-red-400/10',
};

const POPULAR_JOBS = [
  'Oil change', 'Brake pad replacement', 'Air filter replacement', 'Spark plug replacement',
  'Cabin air filter replacement', 'Battery replacement', 'Wiper blade replacement',
  'Tire rotation', 'Coolant flush', 'Transmission fluid change',
];

function GuidesContent() {
  const searchParams = useSearchParams();
  const { activeVehicle } = useVehicle();
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [guide, setGuide] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const handleGenerate = async (jobQuery?: string) => {
    const job = jobQuery || query;
    if (!job.trim()) return;
    if (!activeVehicle) {
      setShowVehicleModal(true);
      return;
    }

    setLoading(true);
    setError('');
    setGuide(null);
    setActiveStep(0);

    try {
      const res = await fetch('/api/guides/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: job, vehicle: activeVehicle }),
      });

      if (!res.ok) throw new Error('Guide generation failed');
      const data = await res.json();
      setGuide(data);
    } catch {
      setError('Failed to generate guide. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && activeVehicle) {
      setQuery(q);
      handleGenerate(q); // eslint-disable-line react-hooks/exhaustive-deps
    }
  }, [searchParams, activeVehicle]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <VehicleIdentificationModal isOpen={showVehicleModal} onClose={() => setShowVehicleModal(false)} />
      <Header
        onVehicleClick={() => setShowVehicleModal(true)}
        onSearchSubmit={(q) => window.location.href = `/parts?q=${encodeURIComponent(q)}`}
        isPro={false}
      />

      <div className="min-h-screen bg-[#060608]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">AI Repair Guides</h1>
            <p className="text-[#6b7280]">
              {activeVehicle
                ? `Step-by-step guides for your ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
                : 'Add your vehicle for vehicle-specific guides'}
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. oil change, brake pad replacement..."
                className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#C45000]"
              />
            </div>
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !query.trim()}
              className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
              <span className="hidden sm:inline">Generate</span>
            </button>
          </div>

          {/* Popular Jobs */}
          {!guide && !loading && (
            <div className="mb-6">
              <p className="text-[#6b7280] text-sm mb-3">Popular jobs:</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_JOBS.map(job => (
                  <button
                    key={job}
                    onClick={() => { setQuery(job); handleGenerate(job); }}
                    className="bg-[#12121a] border border-[#1e1e2e] text-[#6b7280] hover:text-white hover:border-[#C45000]/50 text-sm px-3 py-1.5 rounded-full transition-colors"
                  >
                    {job}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 text-[#C45000] animate-spin mx-auto mb-4" />
              <p className="text-white font-semibold">Generating AI Repair Guide...</p>
              <p className="text-[#6b7280] text-sm mt-1">Customizing for your {activeVehicle?.year} {activeVehicle?.make} {activeVehicle?.model}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Guide */}
          <AnimatePresence>
            {guide && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Guide Header */}
                <div className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-1">{query}</h2>
                  {activeVehicle && (
                    <p className="text-[#6b7280] text-sm mb-4">
                      {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} {activeVehicle.trim}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${DIFFICULTY_COLORS[guide.difficulty] || 'text-gray-400 bg-gray-400/10'}`}>
                      {guide.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-[#6b7280]">
                      <Clock className="w-4 h-4" /> {guide.estimatedTime}
                    </span>
                  </div>
                  {guide.overview && (
                    <p className="text-[#6b7280] text-sm mt-4">{guide.overview}</p>
                  )}
                </div>

                {/* Warnings */}
                {guide.warnings?.length > 0 && (
                  <div className="bg-orange-400/10 border border-orange-400/30 rounded-xl p-4">
                    <h3 className="text-orange-400 font-semibold flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4" /> Safety Warnings
                    </h3>
                    <ul className="space-y-2">
                      {guide.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-orange-200 flex gap-2">
                          <span className="shrink-0">⚠</span> {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tools & Parts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
                    <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
                      <Wrench className="w-4 h-4 text-[#C45000]" /> Tools Required
                    </h3>
                    <ul className="space-y-1.5">
                      {guide.tools.map((tool, i) => (
                        <li key={i} className="text-[#6b7280] text-sm flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400 shrink-0" /> {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
                    <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-[#C45000]" /> Parts Needed
                    </h3>
                    <ul className="space-y-1.5">
                      {guide.parts.map((part, i) => (
                        <li key={i} className="text-sm flex items-center justify-between">
                          <span className="text-[#6b7280] flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-[#C45000] shrink-0" /> {part}
                          </span>
                          <Link
                            href={`/parts?q=${encodeURIComponent(part)}`}
                            className="text-[#C45000] text-xs hover:underline shrink-0"
                          >
                            Find →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-[#1e1e2e]">
                    <h3 className="text-white font-bold text-lg">Step-by-Step Instructions</h3>
                    <p className="text-[#6b7280] text-sm mt-0.5">{guide.steps.length} steps total</p>
                  </div>

                  <div className="p-5 space-y-4">
                    {guide.steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`border rounded-xl overflow-hidden cursor-pointer transition-colors ${
                          activeStep === i ? 'border-[#C45000]/50' : 'border-[#1e1e2e] hover:border-[#C45000]/30'
                        }`}
                        onClick={() => setActiveStep(activeStep === i ? -1 : i)}
                      >
                        <div className="flex items-center gap-3 p-4">
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: activeStep === i ? 'linear-gradient(135deg, #C45000, #FF6A00)' : '#1e1e2e' }}
                          >
                            {step.stepNumber}
                          </span>
                          <h4 className="text-white font-medium flex-1">{step.title}</h4>
                          <ChevronRight className={`w-4 h-4 text-[#6b7280] transition-transform ${activeStep === i ? 'rotate-90' : ''}`} />
                        </div>

                        {activeStep === i && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            className="px-4 pb-4"
                          >
                            <p className="text-[#6b7280] text-sm">{step.description}</p>
                            {step.warning && (
                              <div className="mt-3 bg-orange-400/10 border border-orange-400/20 rounded-lg p-3">
                                <p className="text-orange-400 text-xs">⚠ {step.warning}</p>
                              </div>
                            )}
                            {step.tip && (
                              <div className="mt-3 bg-blue-400/10 border border-blue-400/20 rounded-lg p-3">
                                <p className="text-blue-400 text-xs">💡 {step.tip}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Torque Specs */}
                {guide.torqueSpecs && Object.keys(guide.torqueSpecs).length > 0 && (
                  <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
                    <h3 className="text-white font-semibold mb-3">Torque Specifications</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#1e1e2e]">
                            <th className="text-left text-[#6b7280] pb-2">Component</th>
                            <th className="text-right text-[#6b7280] pb-2">Torque</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(guide.torqueSpecs).map(([key, val]) => (
                            <tr key={key} className="border-b border-[#1e1e2e] last:border-0">
                              <td className="text-white py-2">{key}</td>
                              <td className="text-[#C45000] font-mono text-right py-2">{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Common Mistakes */}
                {guide.commonMistakes?.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                    <h3 className="text-red-400 font-semibold mb-3">Common Mistakes to Avoid</h3>
                    <ul className="space-y-2">
                      {guide.commonMistakes.map((mistake, i) => (
                        <li key={i} className="text-sm text-red-200 flex gap-2">
                          <span className="shrink-0 text-red-400">✗</span> {mistake}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default function GuidesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060608]" />}>
      <GuidesContent />
    </Suspense>
  );
}
