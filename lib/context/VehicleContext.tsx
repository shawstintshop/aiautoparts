'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle } from '@/types';

interface VehicleContextType {
  activeVehicle: Vehicle | null;
  setActiveVehicle: (vehicle: Vehicle | null) => void;
  vehicles: Vehicle[];
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
}

const VehicleContext = createContext<VehicleContextType | null>(null);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('autogenius_vehicles');
    if (saved) {
      const parsed = JSON.parse(saved);
      setVehicles(parsed);
      if (parsed.length > 0) setActiveVehicle(parsed[0]);
    }
  }, []);

  const addVehicle = (vehicle: Vehicle) => {
    const newVehicles = [...vehicles, { ...vehicle, id: Date.now().toString() }];
    setVehicles(newVehicles);
    setActiveVehicle(newVehicles[newVehicles.length - 1]);
    localStorage.setItem('autogenius_vehicles', JSON.stringify(newVehicles));
  };

  const removeVehicle = (id: string) => {
    const newVehicles = vehicles.filter(v => v.id !== id);
    setVehicles(newVehicles);
    if (activeVehicle?.id === id) {
      setActiveVehicle(newVehicles[0] || null);
    }
    localStorage.setItem('autogenius_vehicles', JSON.stringify(newVehicles));
  };

  return (
    <VehicleContext.Provider value={{ activeVehicle, setActiveVehicle, vehicles, addVehicle, removeVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  const context = useContext(VehicleContext);
  if (!context) throw new Error('useVehicle must be used within VehicleProvider');
  return context;
}
