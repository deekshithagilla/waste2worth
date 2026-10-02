import React, { useState, useEffect } from 'react';
import { Building2, Plus, MapPin, Package, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function FacilitiesView({ currentCompany }) {
  const [facilities, setFacilities] = useState([
    {
      id: 'fac_1',
      name: 'Main Processing & Milling Plant',
      location: currentCompany?.location || 'Central Industrial Area',
      type: 'Primary Production Facility',
      storageCapacity: '1,500 Tons',
      operatingStatus: 'Operational'
    },
    {
      id: 'fac_2',
      name: 'Secondary Byproduct Silo & Rail Depot',
      location: currentCompany?.location || 'Logistics Freight Hub',
      type: 'Feedstock Storage & Rail Transfer',
      storageCapacity: '800 Tons',
      operatingStatus: 'Operational'
    }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: currentCompany?.location || '',
    type: 'Processing Plant',
    storageCapacity: '500 Tons'
  });

  useEffect(() => {
    if (currentCompany?.id) {
      fetchFacilities();
    }
  }, [currentCompany]);

  const fetchFacilities = async () => {
    try {
      const res = await fetch(`/api/facilities/${currentCompany.id}`);
      const data = await res.json();
      if (data.success && data.facilities?.length > 0) {
        setFacilities(data.facilities);
      }
    } catch (err) {
      console.error('Error fetching facilities:', err);
    }
  };

  const handleAddFacility = async (e) => {
    e.preventDefault();
    try {
      const targetId = currentCompany?.id || 'comp_current';
      const res = await fetch(`/api/facilities/${targetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setFacilities([...facilities, data.facility]);
        setIsAddOpen(false);
        setForm({ name: '', location: currentCompany?.location || '', type: 'Processing Plant', storageCapacity: '500 Tons' });
      }
    } catch (err) {
      setFacilities([...facilities, { id: `fac_${Date.now()}`, ...form, operatingStatus: 'Operational' }]);
      setIsAddOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Facilities & Plant Locations
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Registered industrial production plants, byproduct silos, and freight warehouses for <strong className="text-slate-700">{currentCompany?.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#134e35] hover:bg-[#0f3f2b] text-white text-xs font-bold rounded-xl shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Plant Facility</span>
        </button>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {facilities.map((fac) => (
          <div key={fac.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {fac.type}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{fac.name}</h3>
              </div>
              <span className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{fac.operatingStatus}</span>
              </span>
            </div>

            <div className="pt-2 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Location: <strong className="text-slate-800">{fac.location}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                <span>Storage Capacity: <strong className="text-slate-800">{fac.storageCapacity}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Facility Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Industrial Facility</h3>
            <p className="text-xs text-slate-500">Register an additional manufacturing unit, silo, or storage warehouse.</p>

            <form onSubmit={handleAddFacility} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Pelletizing Plant, Silo B"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-[#134e35] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Type</label>
                <input
                  type="text"
                  placeholder="e.g. Grain Processing, Secondary Slag Grinding"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-[#134e35] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Storage Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. 1,000 Tons"
                    value={form.storageCapacity}
                    onChange={(e) => setForm({ ...form, storageCapacity: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-[#134e35] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location / City</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-[#134e35] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#134e35] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
