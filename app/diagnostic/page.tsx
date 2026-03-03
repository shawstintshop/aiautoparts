'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Loader2, Wrench, DollarSign, BookOpen, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import VehicleIdentificationModal from '@/components/vehicle/VehicleIdentificationModal';
import { useVehicle } from '@/lib/context/VehicleContext';
import Link from 'next/link';

interface DiagnosticResult {
  code?: string;
  probableCodes?: string[];
  meaning: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedCost: string;
  diyFriendly: boolean;
  diyReasoning: string;
  partsNeeded: string[];
  diagnosticSteps: string[];
  urgency?: string;
  rootCauses?: string[];
}

const SEVERITY_CONFIG = {
  Low: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  High: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  Critical: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
};

const COMMON_CODES = ['P0300', 'P0171', 'P0420', 'P0401', 'P0442', 'P0128'];
const COMMON_SYMPTOMS = [
  'Engine light on', 'Rough idle', 'Hard to start', 'Poor fuel economy',
  'Engine shaking', 'Brake squealing', 'AC not cooling', 'Check engine light',
];

export default function DiagnosticPage() {
  const { activeVehicle } = useVehicle();
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [inputType, setInputType] = useState<'code' | 'symptom'>('code');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDiagnose = async () => {
    if (!input.trim()) return;
    if (!activeVehicle) {
      setShowVehicleModal(true);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, vehicle: activeVehicle, inputType }),
      });

      if (!res.ok) throw new Error('Diagnostic failed');
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Diagnostic failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sevConfig = result ? SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.Low : null;

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
            <h1 className="text-3xl font-bold text-white mb-2">AI Diagnostics</h1>
            <p className="text-[#6b7280]">Enter an OBD-II code or describe your symptoms</p>
          </div>

          {/* Input Type Toggle */}
          <div className="flex bg-[#12121a] border border-[#1e1e2e] rounded-xl p-1 mb-6 w-fit">
            {[
              { id: 'code', label: 'OBD Code', icon: Activity },
              { id: 'symptom', label: 'Describe Symptom', icon: AlertTriangle },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setInputType(id as 'code' | 'symptom'); setInput(''); setResult(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  inputType === id
                    ? 'text-white'
                    : 'text-[#6b7280] hover:text-white'
                }`}
                style={inputType === id ? { background: 'linear-gradient(135deg, #C45000, #FF6A00)' } : {}}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl p-6 mb-6">
            {inputType === 'code' ? (
              <div>
                <label className="text-white font-medium mb-3 block">Enter OBD-II Code</label>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value.toUpperCase())}
                  placeholder="e.g. P0300, P0171, C0035..."
                  className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-[#C45000] placeholder:text-[#6b7280] uppercase"
                  maxLength={6}
                />
                <div className="mt-4">
                  <p className="text-xs text-[#6b7280] mb-2">Common codes:</p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_CODES.map(code => (
                      <button
                        key={code}
                        onClick={() => setInput(code)}
                        className="bg-[#12121a] border border-[#1e1e2e] text-[#6b7280] hover:text-white hover:border-[#C45000]/50 text-xs px-3 py-1.5 rounded-full font-mono transition-colors"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-white font-medium mb-3 block">Describe the Problem</label>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="e.g. My car makes a grinding noise when braking, especially at low speeds..."
                  rows={4}
                  className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C45000] placeholder:text-[#6b7280] resize-none"
                />
                <div className="mt-4">
                  <p className="text-xs text-[#6b7280] mb-2">Common symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_SYMPTOMS.map(symptom => (
                      <button
                        key={symptom}
                        onClick={() => setInput(symptom)}
                        className="bg-[#12121a] border border-[#1e1e2e] text-[#6b7280] hover:text-white hover:border-[#C45000]/50 text-xs px-3 py-1.5 rounded-full transition-colors"
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!activeVehicle && (
              <div className="mt-4 bg-[#C45000]/10 border border-[#C45000]/30 rounded-lg p-3 flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-[#C45000] shrink-0" />
                <p className="text-sm text-white flex-1">Add your vehicle for more accurate diagnostics</p>
                <button onClick={() => setShowVehicleModal(true)} className="text-[#C45000] text-sm hover:underline">Add Now</button>
              </div>
            )}

            <button
              onClick={handleDiagnose}
              disabled={loading || !input.trim()}
              className="mt-4 w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Activity className="w-4 h-4" /> Diagnose with AI</>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {result && sevConfig && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Severity Card */}
                <div className={`border rounded-2xl p-6 ${sevConfig.bg} ${sevConfig.border}`}>
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      {result.code && (
                        <span className="font-mono font-bold text-2xl text-white">{result.code}</span>
                      )}
                      {result.probableCodes && (
                        <div className="flex gap-2 mb-2">
                          {result.probableCodes.map(c => (
                            <span key={c} className="font-mono font-bold text-lg text-white bg-[#1e1e2e] px-2 py-0.5 rounded">{c}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-white text-lg font-semibold mt-1">{result.meaning}</p>
                      {result.urgency && (
                        <p className={`text-sm mt-1 ${sevConfig.color}`}>{result.urgency}</p>
                      )}
                    </div>
                    <div className={`px-4 py-2 rounded-full border text-sm font-bold ${sevConfig.color} ${sevConfig.border} ${sevConfig.bg}`}>
                      {result.severity} Severity
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 text-center">
                    <DollarSign className="w-6 h-6 text-[#C45000] mx-auto mb-2" />
                    <p className="text-white font-bold text-lg">{result.estimatedCost}</p>
                    <p className="text-[#6b7280] text-xs mt-0.5">Estimated Cost</p>
                  </div>
                  <div className={`border rounded-xl p-4 text-center ${result.diyFriendly ? 'bg-green-400/10 border-green-400/30' : 'bg-orange-400/10 border-orange-400/30'}`}>
                    <Wrench className={`w-6 h-6 mx-auto mb-2 ${result.diyFriendly ? 'text-green-400' : 'text-orange-400'}`} />
                    <p className={`font-bold text-lg ${result.diyFriendly ? 'text-green-400' : 'text-orange-400'}`}>
                      {result.diyFriendly ? 'DIY Friendly' : 'Shop Recommended'}
                    </p>
                    <p className="text-[#6b7280] text-xs mt-0.5 line-clamp-2">{result.diyReasoning}</p>
                  </div>
                  <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
                    <p className="text-white font-semibold text-sm mb-2">Parts Needed</p>
                    <ul className="space-y-1">
                      {result.partsNeeded.slice(0, 3).map((part, i) => (
                        <li key={i} className="text-[#6b7280] text-xs flex items-center gap-1">
                          <ChevronRight className="w-3 h-3 text-[#C45000] shrink-0" />
                          {part}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Diagnostic Steps */}
                <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4">Diagnostic Steps</h3>
                  <ol className="space-y-3">
                    {result.diagnosticSteps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                          style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}>
                          {i + 1}
                        </span>
                        <p className="text-[#6b7280] text-sm">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href={`/parts?q=${encodeURIComponent(result.partsNeeded[0] || 'repair parts')}`}
                    className="flex items-center justify-center gap-2 bg-[#12121a] border border-[#1e1e2e] hover:border-[#C45000]/50 text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors"
                  >
                    Find Parts <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/guides?q=${encodeURIComponent(result.meaning)}`}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                  >
                    <BookOpen className="w-4 h-4" /> Get Repair Guide
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
