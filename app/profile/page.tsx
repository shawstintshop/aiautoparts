'use client';

import { useState } from 'react';
import { Car, User, CreditCard, Package, Plus, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import VehicleIdentificationModal from '@/components/vehicle/VehicleIdentificationModal';
import VehicleCard from '@/components/vehicle/VehicleCard';
import { useVehicle } from '@/lib/context/VehicleContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { vehicles, activeVehicle, setActiveVehicle, removeVehicle } = useVehicle();
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'orders' | 'subscription'>('vehicles');

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
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}>
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Garage</h1>
              <p className="text-[#6b7280] text-sm">Manage your vehicles, orders, and subscription</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#1e1e2e] mb-6">
            {[
              { id: 'vehicles', label: 'My Vehicles', icon: Car },
              { id: 'orders', label: 'Orders', icon: Package },
              { id: 'subscription', label: 'Subscription', icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'vehicles' | 'orders' | 'subscription')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? 'text-[#C45000] border-[#C45000]'
                    : 'text-[#6b7280] border-transparent hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Vehicles Tab */}
          {activeTab === 'vehicles' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Your Vehicles ({vehicles.length}/5)</h2>
                <button
                  onClick={() => setShowVehicleModal(true)}
                  className="flex items-center gap-2 text-sm text-white px-3 py-2 rounded-lg"
                  style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                >
                  <Plus className="w-4 h-4" /> Add Vehicle
                </button>
              </div>

              {vehicles.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#1e1e2e] rounded-2xl">
                  <Car className="w-12 h-12 text-[#6b7280] mx-auto mb-4" />
                  <p className="text-white font-semibold mb-2">No vehicles added</p>
                  <p className="text-[#6b7280] text-sm mb-4">Add your first vehicle to get started</p>
                  <button
                    onClick={() => setShowVehicleModal(true)}
                    className="px-4 py-2 rounded-lg text-white text-sm"
                    style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                  >
                    Add Vehicle
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehicles.map(vehicle => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      isActive={activeVehicle?.id === vehicle.id}
                      onSelect={() => setActiveVehicle(vehicle)}
                      onRemove={() => removeVehicle(vehicle.id!)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="text-center py-16 border border-dashed border-[#1e1e2e] rounded-2xl">
                <Package className="w-12 h-12 text-[#6b7280] mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">No orders yet</p>
                <p className="text-[#6b7280] text-sm mb-4">Your order history will appear here</p>
                <Link
                  href="/parts"
                  className="px-4 py-2 rounded-lg text-white text-sm inline-block"
                  style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                >
                  Search Parts
                </Link>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div>
              <div className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">Free Plan</h3>
                    <p className="text-[#6b7280] text-sm">Basic access · No credit card</p>
                  </div>
                  <span className="bg-[#1e1e2e] text-[#6b7280] text-sm px-3 py-1 rounded-full">Active</span>
                </div>
                <Link
                  href="/membership"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold"
                  style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                >
                  Upgrade to Pro — Get Free OBD Scanner <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
