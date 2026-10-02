import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  MapPin, 
  IndianRupee, 
  Scale, 
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  'Minerals & Construction',
  'Agriculture & Food',
  'Wood & Biomass',
  'Metals & Metallurgy',
  'Plastics & Polymers',
  'Paper & Packaging',
  'Chemicals & Solvents'
];

export default function RequirementsView({ 
  currentCompany, 
  myRequirements, 
  onAddRequirement, 
  onDeleteRequirement,
  onNavigateSection
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Minerals & Construction',
    quantityNeeded: '',
    unit: 'Tons',
    maxPricePerUnit: '',
    urgency: 'Continuous Contract',
    location: currentCompany?.location || '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAddRequirement(formData);
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      category: 'Minerals & Construction',
      quantityNeeded: '',
      unit: 'Tons',
      maxPricePerUnit: '',
      urgency: 'Continuous Contract',
      location: currentCompany?.location || '',
      description: ''
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-teal-600" />
            <h1 className="text-xl font-bold text-slate-900">Resource & Raw Material Requirements</h1>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Specify the feedstock inputs <strong className="text-slate-700">{currentCompany?.name}</strong> needs to buy. 
            Our AI scans active industrial waste to find cheaper substitutes.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Material Requirement</span>
        </button>
      </div>

      {/* Requirements List */}
      {myRequirements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No requirements posted yet</h3>
          <p className="text-slate-500 text-xs mt-1 mb-4 leading-relaxed">
            Post what raw materials, pozzolans, wood flour, or polymers your plant consumes to let our AI discover compatible waste!
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            Add Your First Requirement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {myRequirements.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                    {req.category}
                  </span>
                  <button
                    onClick={() => onDeleteRequirement(req.id)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors"
                    title="Remove requirement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-base mt-2">
                  {req.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {req.description || 'Target material specs required for manufacturing operations.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                  <div>
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">Target Demand</div>
                    <div className="font-bold text-slate-800 mt-0.5">{req.quantityNeeded} {req.unit}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">Budget Cap</div>
                    <div className="font-bold text-teal-700 mt-0.5">Max ₹{req.maxPricePerUnit}/{req.unit}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{req.location}</span>
                </span>
                <span className="font-semibold text-slate-600">{req.urgency}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Requirement Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Post Raw Material Requirement</h3>
            <p className="text-xs text-slate-500 mb-4">Tell the platform what feedstock or secondary inputs you need to buy.</p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Material Needed *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Concrete Aggregate Substitute, Spent Brewer Mash"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Procurement Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    <option value="Continuous Contract">Continuous Contract</option>
                    <option value="Immediate">Immediate</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Demand Qty *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="150"
                    value={formData.quantityNeeded}
                    onChange={(e) => setFormData({ ...formData, quantityNeeded: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    <option value="Tons">Tons</option>
                    <option value="Kg">Kg</option>
                    <option value="Barrels">Barrels</option>
                    <option value="Liters">Liters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Budget ($) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="30"
                    value={formData.maxPricePerUnit}
                    onChange={(e) => setFormData({ ...formData, maxPricePerUnit: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Destination / Facility Location</label>
                <input
                  type="text"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feedstock Acceptance Criteria</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Minimum purity, moisture thresholds, particle mesh size required..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Publish Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
