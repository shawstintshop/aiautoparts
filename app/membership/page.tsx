'use client';

import { motion } from 'framer-motion';
import { Zap, CheckCircle, Bluetooth } from 'lucide-react';
import Header from '@/components/layout/Header';
import VehicleIdentificationModal from '@/components/vehicle/VehicleIdentificationModal';
import { useState } from 'react';
import Link from 'next/link';

const FREE_FEATURES = [
  'Vehicle identification (manual)',
  '5 parts searches/month',
  'Basic OBD code lookup',
  'Community repair guides',
  'Mechanic directory',
];

const PRO_FEATURES = [
  'FREE Bluetooth OBD-II Scanner ($89 value)',
  'Unlimited AI parts search',
  'Real-time OBD diagnostics',
  'AI-generated repair guides',
  'Priority parts delivery',
  'Tool rental network access',
  'Vehicle health monitoring',
  'Multi-vehicle garage (up to 5)',
  'Exclusive member pricing on parts',
  '24/7 AI mechanic chat',
];

export default function MembershipPage() {
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const price = billingPeriod === 'monthly' ? 14.99 : 9.99;

  return (
    <>
      <VehicleIdentificationModal isOpen={showVehicleModal} onClose={() => setShowVehicleModal(false)} />
      <Header
        onVehicleClick={() => setShowVehicleModal(true)}
        onSearchSubmit={(q) => window.location.href = `/parts?q=${encodeURIComponent(q)}`}
        isPro={false}
      />

      <div className="min-h-screen bg-[#060608]">
        {/* Hero */}
        <div className="py-16 px-4 text-center" style={{ background: 'linear-gradient(180deg, #12121a 0%, #060608 100%)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-[#C45000]/10 border border-[#C45000]/30 text-[#C45000] text-sm px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" /> Limited Time: Free OBD-II Scanner with Pro
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Get Your
              <span className="block" style={{ backgroundImage: 'linear-gradient(135deg, #C45000, #FF6A00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                FREE OBD Scanner
              </span>
            </h1>

            <p className="text-[#6b7280] text-lg mb-8 max-w-xl mx-auto">
              Join AutoGenius Pro and receive a Bluetooth OBD-II scanner ($89 value) — absolutely free. 
              Diagnose your car in real-time, find parts, and save money on repairs.
            </p>

            {/* OBD Device Image Placeholder */}
            <div className="inline-flex items-center justify-center w-48 h-32 bg-[#12121a] border border-[#1e1e2e] rounded-2xl mb-8">
              <Bluetooth className="w-16 h-16 text-[#C45000]" />
            </div>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-16">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-white' : 'text-[#6b7280]'}`}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'annual' : 'monthly')}
              className={`w-12 h-6 rounded-full relative transition-colors ${billingPeriod === 'annual' ? 'bg-[#C45000]' : 'bg-[#1e1e2e]'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm ${billingPeriod === 'annual' ? 'text-white' : 'text-[#6b7280]'}`}>
              Annual <span className="text-green-400 text-xs">Save 33%</span>
            </span>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Free Plan */}
            <div className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl p-6">
              <div className="mb-6">
                <h2 className="text-white font-bold text-2xl">Free</h2>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-white">$0</span>
                </div>
                <p className="text-[#6b7280] text-sm mt-2">Basic access forever</p>
              </div>

              <ul className="space-y-3 mb-6">
                {FREE_FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#6b7280] shrink-0" />
                    <span className="text-[#6b7280]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth"
                className="block text-center py-3 rounded-xl border border-[#1e1e2e] text-[#6b7280] hover:border-white hover:text-white transition-colors font-medium"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              className="rounded-2xl p-[1px] relative"
              style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
            >
              <div className="bg-[#0d0d10] rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-white font-bold text-2xl">Pro</h2>
                  <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}>
                    MOST POPULAR
                  </span>
                </div>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-bold text-white">${price}</span>
                  <span className="text-[#6b7280] text-sm pb-1">/{billingPeriod === 'monthly' ? 'mo' : 'mo, billed annually'}</span>
                </div>
                <p className="text-[#C45000] text-sm mt-1 font-medium">30-day free trial · No credit card required</p>

                <ul className="space-y-3 mt-6 mb-6">
                  {PRO_FEATURES.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#C45000] shrink-0" />
                      <span className={`${i === 0 ? 'text-[#C45000] font-medium' : 'text-white'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth?plan=pro"
                  className="block text-center py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                >
                  Start Free Trial — Get Free OBD Scanner
                </Link>

                <p className="text-[#6b7280] text-xs text-center mt-2">Cancel anytime · OBD scanner ships in 3-5 days</p>
              </div>
            </motion.div>
          </div>

          {/* Feature Comparison */}
          <div className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl overflow-hidden mb-12">
            <div className="p-5 border-b border-[#1e1e2e]">
              <h3 className="text-white font-bold text-lg">Feature Comparison</h3>
            </div>
            <div className="divide-y divide-[#1e1e2e]">
              {[
                ['Vehicle Storage', '1', '5'],
                ['AI Parts Search', '5/month', 'Unlimited'],
                ['OBD Diagnostics', 'Basic', 'Real-time AI'],
                ['Repair Guides', 'Community', 'AI-Generated'],
                ['Parts Savings', 'Standard', 'Member Pricing'],
                ['Tool Rental', '✗', '✓'],
                ['OBD-II Scanner', '✗', 'FREE ($89 value)'],
                ['AI Mechanic Chat', '✗', '24/7 Access'],
              ].map(([feature, free, pro]) => (
                <div key={feature} className="grid grid-cols-3 px-5 py-3 text-sm">
                  <span className="text-white">{feature}</span>
                  <span className="text-[#6b7280] text-center">{free}</span>
                  <span className="text-[#C45000] font-medium text-center">{pro}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="text-white font-bold text-2xl text-center mb-8">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {[
                {
                  q: 'When do I receive the OBD scanner?',
                  a: 'Your free Bluetooth OBD-II scanner ships within 1-2 business days of starting your Pro trial. It will arrive in 3-5 business days.'
                },
                {
                  q: 'Can I cancel during the free trial?',
                  a: 'Yes! Cancel anytime during the 30-day trial and you won\'t be charged. The OBD scanner is yours to keep regardless.'
                },
                {
                  q: 'What vehicles does the OBD scanner work with?',
                  a: 'The scanner works with all US vehicles from 1996 and newer that have an OBD-II port (virtually all gasoline and diesel vehicles).'
                },
                {
                  q: 'Is there a family or fleet plan?',
                  a: 'Yes! Contact us for fleet pricing for 5+ vehicles. We offer significant discounts for commercial and fleet customers.'
                },
              ].map((faq, i) => (
                <div key={i} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
                  <h4 className="text-white font-medium mb-2">{faq.q}</h4>
                  <p className="text-[#6b7280] text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
