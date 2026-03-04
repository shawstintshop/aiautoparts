'use client';

import { motion } from 'framer-motion';
import { Car, Trash2, Activity, AlertTriangle } from 'lucide-react';
import { Vehicle } from '@/types';

interface VehicleCardProps {
  vehicle: Vehicle;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export default function VehicleCard({ vehicle, isActive, onSelect, onRemove }: VehicleCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-xl border p-4 transition-colors ${
        isActive
          ? 'border-[#C45000] bg-[#C45000]/10'
          : 'border-[#1e1e2e] bg-[#12121a] hover:border-[#C45000]/50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isActive ? 'bg-[#C45000]' : 'bg-[#1e1e2e]'
          }`}>
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-[#6b7280] text-xs mt-0.5">
              {vehicle.trim} · {vehicle.engine} · {vehicle.drive}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="text-xs bg-[#C45000] text-white px-2 py-0.5 rounded-full">Active</span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-[#6b7280] hover:text-red-400 transition-colors p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs">
        {vehicle.mileage && (
          <span className="text-[#6b7280]">
            <Activity className="w-3 h-3 inline mr-1" />
            {vehicle.mileage.toLocaleString()} mi
          </span>
        )}
        {vehicle.activeDTCs.length > 0 && (
          <span className="text-orange-400">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            {vehicle.activeDTCs.length} fault code{vehicle.activeDTCs.length > 1 ? 's' : ''}
          </span>
        )}
        {vehicle.activeDTCs.length === 0 && (
          <span className="text-green-400">✓ No fault codes</span>
        )}
        <span className="text-[#6b7280] ml-auto capitalize">via {vehicle.identifiedVia}</span>
      </div>
    </motion.div>
  );
}
