'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Phone, Globe, Shield, Wrench, Clock, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import VehicleIdentificationModal from '@/components/vehicle/VehicleIdentificationModal';
import { Mechanic } from '@/types';

export default function MechanicsPage() {
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    fetchMechanics();
  }, [specialty]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMechanics = async () => {
    setLoading(true);
    try {
      const url = specialty ? `/api/mechanics?specialty=${encodeURIComponent(specialty)}` : '/api/mechanics';
      const res = await fetch(url);
      const data = await res.json();
      setMechanics(data);
    } catch (err) {
      console.error('Failed to fetch mechanics', err);
    } finally {
      setLoading(false);
    }
  };

  const SPECIALTIES = ['Engine', 'Transmission', 'Brakes', 'Electrical', 'AC/Heat', 'Hybrid', 'Tires'];

  const priceColor: Record<string, string> = {
    '$': 'text-green-400',
    '$$': 'text-yellow-400',
    '$$$': 'text-red-400',
  };

  const formatSlot = (slot: Date | string) => {
    const date = new Date(slot);
    const now = new Date();
    const diffH = Math.round((date.getTime() - now.getTime()) / 1000 / 60 / 60);
    if (diffH < 2) return 'Available now';
    if (diffH < 24) return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <>
      <VehicleIdentificationModal isOpen={showVehicleModal} onClose={() => setShowVehicleModal(false)} />
      <Header
        onVehicleClick={() => setShowVehicleModal(true)}
        onSearchSubmit={(q) => window.location.href = `/parts?q=${encodeURIComponent(q)}`}
        isPro={false}
      />

      <div className="min-h-screen bg-[#060608]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Find Mechanics</h1>
            <p className="text-[#6b7280]">Verified local shops with tool rental and AI scheduling</p>
          </div>

          {/* Specialty Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSpecialty('')}
              className={`text-sm px-4 py-2 rounded-full border transition-colors ${!specialty ? 'border-[#C45000] text-[#C45000] bg-[#C45000]/10' : 'border-[#1e1e2e] text-[#6b7280] hover:text-white'}`}
            >
              All
            </button>
            {SPECIALTIES.map(s => (
              <button
                key={s}
                onClick={() => setSpecialty(s === specialty ? '' : s)}
                className={`text-sm px-4 py-2 rounded-full border transition-colors ${specialty === s ? 'border-[#C45000] text-[#C45000] bg-[#C45000]/10' : 'border-[#1e1e2e] text-[#6b7280] hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-40 bg-[#12121a] border border-[#1e1e2e] rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Mechanic List */}
          {!loading && (
            <div className="space-y-4">
              {mechanics.map((mechanic, i) => (
                <motion.div
                  key={mechanic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl p-5 hover:border-[#C45000]/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-white font-bold text-lg">{mechanic.businessName}</h3>
                            {mechanic.verifiedPartner && (
                              <span className="flex items-center gap-1 text-xs bg-[#C45000]/10 text-[#C45000] border border-[#C45000]/30 px-2 py-0.5 rounded-full">
                                <Shield className="w-3 h-3" /> Verified Partner
                              </span>
                            )}
                            {mechanic.hasToolRental && (
                              <span className="flex items-center gap-1 text-xs bg-blue-400/10 text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded-full">
                                <Wrench className="w-3 h-3" /> Tool Rental
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-1 text-sm text-[#6b7280]">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {mechanic.distance ? `${mechanic.distance} mi` : ''} · {mechanic.address.split(',')[1]?.trim()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rating & Price */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= Math.round(mechanic.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-[#6b7280]'}`} />
                          ))}
                          <span className="text-white text-sm ml-1">{mechanic.rating}</span>
                          <span className="text-[#6b7280] text-sm">({mechanic.reviewCount})</span>
                        </div>
                        <span className={`font-bold ${priceColor[mechanic.priceRange] || 'text-white'}`}>
                          {mechanic.priceRange}
                        </span>
                        <span className="text-[#6b7280] text-xs">{mechanic.yearsInBusiness} yrs in business</span>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {mechanic.specialties.map(s => (
                          <span key={s} className="bg-[#1e1e2e] text-[#6b7280] text-xs px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Certifications */}
                      <div className="flex items-center gap-2 mt-2">
                        {mechanic.certifications.map(cert => (
                          <span key={cert} className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 sm:w-48 shrink-0">
                      <div className="bg-[#12121a] rounded-lg p-3 text-center">
                        <Clock className="w-4 h-4 text-green-400 mx-auto mb-1" />
                        <p className="text-green-400 text-xs font-medium">Next Available</p>
                        <p className="text-white text-sm font-semibold">{formatSlot(mechanic.nextAvailableSlot)}</p>
                      </div>

                      <button
                        onClick={() => { setSelectedMechanic(mechanic); setShowBooking(true); }}
                        className="py-2 rounded-lg text-white text-sm font-semibold"
                        style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                      >
                        Book Appointment
                      </button>

                      {mechanic.phone && (
                        <a
                          href={`tel:${mechanic.phone}`}
                          className="py-2 rounded-lg text-[#6b7280] text-sm text-center border border-[#1e1e2e] hover:border-[#C45000]/50 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" /> {mechanic.phone}
                        </a>
                      )}

                      {mechanic.website && (
                        <a
                          href={mechanic.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 rounded-lg text-[#6b7280] text-sm text-center border border-[#1e1e2e] hover:border-[#C45000]/50 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5" /> Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Tool Inventory */}
                  {mechanic.hasToolRental && mechanic.toolInventory.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#1e1e2e]">
                      <p className="text-xs text-[#6b7280] mb-2">Available Tool Rentals:</p>
                      <div className="flex flex-wrap gap-2">
                        {mechanic.toolInventory.map(tool => (
                          <span key={tool} className="bg-blue-400/10 text-blue-400 text-xs px-2 py-0.5 rounded">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && selectedMechanic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Book Appointment</h3>
              <button onClick={() => setShowBooking(false)} className="text-[#6b7280] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[#6b7280] text-sm mb-4">{selectedMechanic.businessName}</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Service Type</label>
                <select className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                  <option>Oil Change</option>
                  <option>Brake Service</option>
                  <option>Engine Diagnostic</option>
                  <option>Tire Rotation</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Preferred Date</label>
                <input type="date" className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C45000]" />
              </div>
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Notes (Optional)</label>
                <textarea rows={3} placeholder="Describe the issue..." className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none resize-none placeholder:text-[#6b7280]" />
              </div>
            </div>

            <button
              onClick={() => {
                alert('Booking request sent! The shop will contact you to confirm.');
                setShowBooking(false);
              }}
              className="w-full mt-4 py-3 rounded-xl text-white font-semibold"
              style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
            >
              Request Appointment
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
