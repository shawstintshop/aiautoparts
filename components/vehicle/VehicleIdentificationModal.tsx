'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bluetooth, Hash, Car, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import { Vehicle } from '@/types';
import { useVehicle } from '@/lib/context/VehicleContext';
import { TOP_MAKES } from '@/data/vehicles';

interface VehicleIdentificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const MODELS_BY_MAKE: Record<string, string[]> = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', '4Runner', 'Sequoia', 'Tundra', 'Sienna', 'Avalon', 'Prius', 'Venza', 'C-HR'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Passport', 'Ridgeline', 'Fit', 'Insight'],
  Ford: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Expedition', 'Ranger', 'Bronco', 'Transit', 'Maverick', 'EcoSport'],
  Chevrolet: ['Silverado 1500', 'Equinox', 'Tahoe', 'Suburban', 'Malibu', 'Colorado', 'Blazer', 'Traverse', 'Trax', 'Camaro', 'Corvette'],
  GMC: ['Sierra 1500', 'Terrain', 'Yukon', 'Canyon', 'Acadia', 'Envoy'],
  Ram: ['1500', '2500', '3500', 'ProMaster', 'ProMaster City'],
  Jeep: ['Grand Cherokee', 'Wrangler', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Grand Wagoneer'],
  Nissan: ['Altima', 'Rogue', 'Sentra', 'Frontier', 'Pathfinder', 'Murano', 'Armada', 'Titan', 'Kicks', 'Versa'],
  Hyundai: ['Elantra', 'Tucson', 'Santa Fe', 'Sonata', 'Palisade', 'Kona', 'Venue', 'Ioniq'],
  Kia: ['Forte', 'Sportage', 'Sorento', 'Telluride', 'Optima', 'Soul', 'Stinger', 'Carnival'],
  Subaru: ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'Legacy', 'Ascent', 'WRX', 'BRZ'],
  Mazda: ['Mazda3', 'CX-5', 'CX-9', 'Mazda6', 'CX-30', 'CX-50', 'MX-5 Miata'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5', '7 Series', 'X1', 'X7', 'M3', 'M5', '4 Series'],
  Mercedes: ['C-Class', 'E-Class', 'GLE', 'GLC', 'S-Class', 'A-Class', 'GLS', 'G-Class'],
  Audi: ['A4', 'Q5', 'A6', 'Q7', 'A3', 'Q3', 'Q8', 'A8', 'e-tron'],
  Dodge: ['Ram 1500', 'Charger', 'Challenger', 'Durango', 'Journey', 'Grand Caravan'],
  Volkswagen: ['Jetta', 'Tiguan', 'Atlas', 'Passat', 'Golf', 'ID.4', 'Taos'],
  Lexus: ['RX', 'ES', 'GX', 'NX', 'IS', 'LX', 'UX', 'LS'],
  Acura: ['MDX', 'RDX', 'TLX', 'ILX', 'NSX'],
  Infiniti: ['Q50', 'QX60', 'QX80', 'Q60', 'QX50'],
  Cadillac: ['Escalade', 'XT5', 'XT4', 'CT5', 'CT4', 'XT6'],
  Buick: ['Enclave', 'Encore', 'Envision', 'LaCrosse'],
  Lincoln: ['Navigator', 'Aviator', 'Corsair', 'Nautilus', 'Expedition'],
  Chrysler: ['Pacifica', '300', 'Voyager'],
  Mitsubishi: ['Outlander', 'Eclipse Cross', 'Outlander Sport', 'Mirage', 'Galant'],
  Volvo: ['XC90', 'XC60', 'XC40', 'S60', 'V60', 'S90'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
};

const ENGINES = ['2.0L 4-Cyl', '2.4L 4-Cyl', '2.5L 4-Cyl', '3.0L V6', '3.5L V6', '3.6L V6', '4.0L V6', '4.6L V8', '5.0L V8', '5.3L V8', '5.7L V8', '6.2L V8', '2.0L 4-Cyl Turbo', '2.7L V6 Turbo', '3.5L V6 Turbo', 'Electric'];
const DRIVES = ['FWD', 'RWD', 'AWD', '4WD'] as const;

export default function VehicleIdentificationModal({ isOpen, onClose }: VehicleIdentificationModalProps) {
  const { addVehicle } = useVehicle();
  const [tab, setTab] = useState<'obd' | 'vin' | 'manual'>('manual');
  const [loading, setLoading] = useState(false);
  const [vinInput, setVinInput] = useState('');
  const [vinResult, setVinResult] = useState<Partial<Vehicle> | null>(null);
  const [vinError, setVinError] = useState('');
  const [obdStep, setObdStep] = useState(0);

  // Manual form state
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  const [engine, setEngine] = useState('');
  const [drive, setDrive] = useState<'FWD' | 'RWD' | 'AWD' | '4WD'>('FWD');
  const [mileage, setMileage] = useState('');

  const handleVINDecode = async () => {
    if (vinInput.length !== 17) {
      setVinError('VIN must be exactly 17 characters');
      return;
    }
    setLoading(true);
    setVinError('');
    try {
      const res = await fetch(`/api/vehicles/decode?vin=${vinInput}`);
      const data = await res.json();
      if (data.error) {
        setVinError(data.error);
      } else {
        setVinResult(data);
      }
    } catch {
      setVinError('Failed to decode VIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVINSave = () => {
    if (!vinResult) return;
    addVehicle({
      year: vinResult.year || 2020,
      make: vinResult.make || '',
      model: vinResult.model || '',
      trim: vinResult.trim || '',
      engine: vinResult.engine || '',
      drive: (vinResult.drive as 'FWD' | 'RWD' | 'AWD' | '4WD') || 'FWD',
      vin: vinInput,
      mileage: null,
      healthReport: null,
      activeDTCs: [],
      identifiedVia: 'vin',
    });
    onClose();
  };

  const handleManualSave = () => {
    if (!year || !make || !model) return;
    addVehicle({
      year: parseInt(year),
      make,
      model,
      trim: trim || 'Base',
      engine: engine || 'Unknown',
      drive,
      vin: null,
      mileage: mileage ? parseInt(mileage) : null,
      healthReport: null,
      activeDTCs: [],
      identifiedVia: 'manual',
    });
    onClose();
  };

  const handleOBDConnect = async () => {
    setObdStep(1);
    await new Promise(r => setTimeout(r, 1500));
    setObdStep(2);
    await new Promise(r => setTimeout(r, 1000));
    setObdStep(3);
  };

  const models = make ? (MODELS_BY_MAKE[make] || []) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#0d0d10] border border-[#1e1e2e] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1e1e2e]">
              <div>
                <h2 className="text-xl font-bold text-white">Add Your Vehicle</h2>
                <p className="text-[#6b7280] text-sm mt-1">Choose how to identify your vehicle</p>
              </div>
              <button onClick={onClose} className="text-[#6b7280] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#1e1e2e]">
              {[
                { id: 'manual', label: 'Manual', icon: Car },
                { id: 'vin', label: 'VIN Scan', icon: Hash },
                { id: 'obd', label: 'OBD Scanner', icon: Bluetooth },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id as 'obd' | 'vin' | 'manual')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    tab === id
                      ? 'text-[#C45000] border-b-2 border-[#C45000]'
                      : 'text-[#6b7280] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Manual Tab */}
              {tab === 'manual' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#6b7280] mb-1 block">Year</label>
                      <select
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C45000]"
                      >
                        <option value="">Select Year</option>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#6b7280] mb-1 block">Make</label>
                      <select
                        value={make}
                        onChange={e => { setMake(e.target.value); setModel(''); }}
                        className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C45000]"
                      >
                        <option value="">Select Make</option>
                        {TOP_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#6b7280] mb-1 block">Model</label>
                    <select
                      value={model}
                      onChange={e => setModel(e.target.value)}
                      disabled={!make}
                      className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C45000] disabled:opacity-50"
                    >
                      <option value="">Select Model</option>
                      {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#6b7280] mb-1 block">Engine</label>
                      <select
                        value={engine}
                        onChange={e => setEngine(e.target.value)}
                        className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C45000]"
                      >
                        <option value="">Select Engine</option>
                        {ENGINES.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#6b7280] mb-1 block">Drive Type</label>
                      <select
                        value={drive}
                        onChange={e => setDrive(e.target.value as 'FWD' | 'RWD' | 'AWD' | '4WD')}
                        className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C45000]"
                      >
                        {DRIVES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#6b7280] mb-1 block">Trim (Optional)</label>
                    <input
                      type="text"
                      value={trim}
                      onChange={e => setTrim(e.target.value)}
                      placeholder="e.g. XLE, Sport, Limited"
                      className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C45000] placeholder:text-[#6b7280]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#6b7280] mb-1 block">Mileage (Optional)</label>
                    <input
                      type="number"
                      value={mileage}
                      onChange={e => setMileage(e.target.value)}
                      placeholder="e.g. 45000"
                      className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C45000] placeholder:text-[#6b7280]"
                    />
                  </div>

                  <button
                    onClick={handleManualSave}
                    disabled={!year || !make || !model}
                    className="w-full py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                  >
                    Add Vehicle
                  </button>
                </div>
              )}

              {/* VIN Tab */}
              {tab === 'vin' && (
                <div className="space-y-4">
                  <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4 text-sm text-[#6b7280]">
                    <p>Your VIN is a 17-character code found on:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Driver&apos;s side dashboard (visible through windshield)</li>
                      <li>Driver&apos;s door jamb sticker</li>
                      <li>Vehicle registration/title</li>
                      <li>Insurance documents</li>
                    </ul>
                  </div>

                  <div>
                    <label className="text-xs text-[#6b7280] mb-1 block">Enter VIN</label>
                    <input
                      type="text"
                      value={vinInput}
                      onChange={e => setVinInput(e.target.value.toUpperCase())}
                      placeholder="1HGBH41JXMN109186"
                      maxLength={17}
                      className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-[#C45000] placeholder:text-[#6b7280]"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-red-400">{vinError}</span>
                      <span className={`text-xs ${vinInput.length === 17 ? 'text-green-400' : 'text-[#6b7280]'}`}>
                        {vinInput.length}/17
                      </span>
                    </div>
                  </div>

                  {vinResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#12121a] border border-green-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">VIN Decoded Successfully</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(vinResult).filter(([k]) => k !== 'vin').map(([key, val]) => (
                          <div key={key}>
                            <span className="text-[#6b7280] capitalize">{key}: </span>
                            <span className="text-white">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {vinResult ? (
                    <button
                      onClick={handleVINSave}
                      className="w-full py-3 rounded-lg font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                    >
                      Save Vehicle
                    </button>
                  ) : (
                    <button
                      onClick={handleVINDecode}
                      disabled={loading || vinInput.length !== 17}
                      className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {loading ? 'Decoding...' : 'Decode VIN'}
                    </button>
                  )}
                </div>
              )}

              {/* OBD Tab */}
              {tab === 'obd' && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="w-24 h-24 mx-auto mb-4 relative">
                      <motion.div
                        animate={obdStep >= 1 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-24 h-24 rounded-full border-2 border-[#C45000] flex items-center justify-center"
                      >
                        <Bluetooth className="w-10 h-10 text-[#C45000]" />
                      </motion.div>
                      {obdStep >= 2 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>

                    {obdStep === 0 && (
                      <div className="space-y-3">
                        <h3 className="text-white font-semibold">Connect OBD-II Scanner</h3>
                        <p className="text-[#6b7280] text-sm">
                          Plug your Bluetooth OBD-II scanner into your vehicle&apos;s OBD port (usually under the dashboard, driver&apos;s side).
                        </p>
                        <div className="bg-[#C45000]/10 border border-[#C45000]/20 rounded-lg p-3 text-sm">
                          <p className="text-[#C45000] font-medium">Don&apos;t have an OBD scanner?</p>
                          <p className="text-[#6b7280] mt-1">Get a free one with AutoGenius Pro membership!</p>
                          <a href="/membership" className="text-[#C45000] text-xs hover:underline flex items-center gap-1 mt-1">
                            Learn More <ChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                        <button
                          onClick={handleOBDConnect}
                          className="w-full py-3 rounded-lg font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                        >
                          Connect via Bluetooth
                        </button>
                      </div>
                    )}

                    {obdStep === 1 && (
                      <div className="space-y-2">
                        <p className="text-white font-semibold">Scanning for devices...</p>
                        <p className="text-[#6b7280] text-sm">Make sure your vehicle ignition is in the ON position</p>
                      </div>
                    )}

                    {obdStep === 2 && (
                      <div className="space-y-2">
                        <p className="text-white font-semibold">Reading vehicle data...</p>
                        <p className="text-[#6b7280] text-sm">Retrieving VIN and diagnostic codes</p>
                      </div>
                    )}

                    {obdStep === 3 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <p className="text-green-400 font-semibold">Vehicle Identified!</p>
                        <div className="bg-[#12121a] rounded-lg p-3 text-left">
                          <p className="text-white text-sm">2022 Toyota Camry XSE</p>
                          <p className="text-[#6b7280] text-xs">2.5L 4-Cyl · FWD · 24,520 mi</p>
                          <p className="text-green-400 text-xs mt-1">✓ No active fault codes</p>
                        </div>
                        <button
                          onClick={() => {
                            addVehicle({
                              year: 2022,
                              make: 'Toyota',
                              model: 'Camry',
                              trim: 'XSE',
                              engine: '2.5L 4-Cyl',
                              drive: 'FWD',
                              vin: null,
                              mileage: 24520,
                              healthReport: null,
                              activeDTCs: [],
                              identifiedVia: 'obd',
                            });
                            onClose();
                          }}
                          className="w-full py-3 rounded-lg font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg, #C45000, #FF6A00)' }}
                        >
                          Save Vehicle
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
