import React, { useState } from 'react';
import { 
  Building2, 
  Package, 
  Layers, 
  Plus, 
  Trash2, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Scale, 
  Calendar,
  AlertCircle
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

export default function CompanyDepotView({ 
  currentCompany, 
  myWasteListings, 
  myRequirements, 
  onAddWaste, 
  onAddRequirement, 
  onDeleteWaste, 
  onDeleteRequirement,
  onSwitchToAiMatches
}) {
  const [activeTab, setActiveTab] = useState('MY_WASTE'); // 'MY_WASTE' or 'MY_REQS'
  const [isAddWasteOpen, setIsAddWasteOpen] = useState(false);
  const [isAddReqOpen, setIsAddReqOpen] = useState(false);

  // Form states
  const [wasteForm, setWasteForm] = useState({
    title: '',
    category: 'Minerals & Construction',
    quantity: '',
    unit: 'Tons',
    pricePerUnit: '',
    purityPercentage: 95,
    frequency: 'Recurring (Monthly)',
    location: currentCompany?.location || '',
    description: ''
  });

  const [reqForm, setReqForm] = useState({
    title: '',
    category: 'Minerals & Construction',
    quantityNeeded: '',
    unit: 'Tons',
    maxPricePerUnit: '',
    urgency: 'Continuous Contract',
    location: currentCompany?.location || '',
    description: ''
  });

  const handleCreateWaste = async (e) => {
    e.preventDefault();
    await onAddWaste(wasteForm);
    setIsAddWasteOpen(false);
    setWasteForm({
      title: '',
      category: 'Minerals & Construction',
      quantity: '',
      unit: 'Tons',
      pricePerUnit: '',
      purityPercentage: 95,
      frequency: 'Recurring (Monthly)',
      location: currentCompany?.location || '',
      description: ''
    });
  };

  const handleCreateReq = async (e) => {
    e.preventDefault();
    await onAddRequirement(reqForm);
    setIsAddReqOpen(false);
    setReqForm({
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
      
      {/* Header Profile Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {currentCompany?.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">{currentCompany?.name} Depot</h1>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Verified Facility
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{currentCompany?.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {currentCompany?.location}</span>
                <span>•</span>
                <span>{currentCompany?.industry}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onSwitchToAiMatches}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View AI Matches For Our Listings</span>
          </button>
        </div>

        {/* Tab switch */}
        <div className="mt-6 flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('MY_WASTE')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'MY_WASTE'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Our Waste Byproducts For Sale ({myWasteListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MY_REQS')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'MY_REQS'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Our Input Material Needs ({myRequirements.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: My Waste Listings */}
      {activeTab === 'MY_WASTE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Active Waste Streams</h2>
              <p className="text-xs text-slate-500">Materials your plant generates that other companies can reuse as raw feedstock</p>
            </div>
            <button
              onClick={() => setIsAddWasteOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ List Waste Byproduct</span>
            </button>
          </div>

          {myWasteListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No waste streams listed yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Turn your disposal costs into cash flow! List your plant's slag, sawdust, pulp, dust, or scrap.
              </p>
              <button
                onClick={() => setIsAddWasteOpen(true)}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
              >
                List Your First Byproduct
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myWasteListings.map((waste) => (
                <div key={waste.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {waste.category}
                      </span>
                      <button
                        onClick={() => onDeleteWaste(waste.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mt-2">{waste.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{waste.description}</p>

                    <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Quantity</div>
                        <div className="font-bold text-slate-800 mt-0.5">{waste.quantity} {waste.unit}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Price</div>
                        <div className="font-bold text-emerald-700 mt-0.5">${waste.pricePerUnit}/{waste.unit}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Purity</div>
                        <div className="font-bold text-slate-800 mt-0.5">{waste.purityPercentage}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{waste.frequency}</span>
                    <span>{new Date(waste.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Requirements */}
      {activeTab === 'MY_REQS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Required Input Materials</h2>
              <p className="text-xs text-slate-500">Secondary raw materials your factory is looking to buy to replace virgin resources</p>
            </div>
            <button
              onClick={() => setIsAddReqOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post Material Requirement</span>
            </button>
          </div>

          {myRequirements.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No raw material requirements posted</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Tell our AI what raw materials, aggregate, binder, or biomass your plant needs to discover matching waste!
              </p>
              <button
                onClick={() => setIsAddReqOpen(true)}
                className="mt-4 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700"
              >
                Post Your First Requirement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRequirements.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {req.category}
                      </span>
                      <button
                        onClick={() => onDeleteRequirement(req.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                        title="Delete requirement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mt-2">{req.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{req.description}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Target Volume</div>
                        <div className="font-bold text-slate-800 mt-0.5">{req.quantityNeeded} {req.unit}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Budget Cap</div>
                        <div className="font-bold text-teal-700 mt-0.5">Max ${req.maxPricePerUnit}/{req.unit}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{req.urgency}</span>
                    <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Waste Listing */}
      {isAddWasteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">List Waste Byproduct For Sale</h3>
            <p className="text-xs text-slate-500 mb-4">Post byproducts or scrap available for other companies to purchase.</p>

            <form onSubmit={handleCreateWaste} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Granulated Blast Furnace Slag, Untreated Sawdust"
                  value={wasteForm.title}
                  onChange={(e) => setWasteForm({ ...wasteForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={wasteForm.category}
                    onChange={(e) => setWasteForm({ ...wasteForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supply Frequency</label>
                  <select
                    value={wasteForm.frequency}
                    onChange={(e) => setWasteForm({ ...wasteForm, frequency: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="One-time Batch">One-time Batch</option>
                    <option value="Recurring (Weekly)">Recurring (Weekly)</option>
                    <option value="Recurring (Monthly)">Recurring (Monthly)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    value={wasteForm.quantity}
                    onChange={(e) => setWasteForm({ ...wasteForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                  <select
                    value={wasteForm.unit}
                    onChange={(e) => setWasteForm({ ...wasteForm, unit: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="Tons">Tons</option>
                    <option value="Kg">Kg</option>
                    <option value="Barrels">Barrels</option>
                    <option value="Liters">Liters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price / Unit ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={wasteForm.pricePerUnit}
                    onChange={(e) => setWasteForm({ ...wasteForm, pricePerUnit: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Purity (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="95"
                    value={wasteForm.purityPercentage}
                    onChange={(e) => setWasteForm({ ...wasteForm, purityPercentage: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Plant Location</label>
                  <input
                    type="text"
                    placeholder="City, State"
                    value={wasteForm.location}
                    onChange={(e) => setWasteForm({ ...wasteForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Technical Notes & Specifications</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Moisture level, grain size, storage conditions..."
                  value={wasteForm.description}
                  onChange={(e) => setWasteForm({ ...wasteForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddWasteOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Requirement */}
      {isAddReqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Post Raw Material Requirement</h3>
            <p className="text-xs text-slate-500 mb-4">Tell the network and AI what inputs you need to buy.</p>

            <form onSubmit={handleCreateReq} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Material Needed *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Concrete Aggregate Substitute, Spent Brewer Mash"
                  value={reqForm.title}
                  onChange={(e) => setReqForm({ ...reqForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={reqForm.category}
                    onChange={(e) => setReqForm({ ...reqForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Procurement Urgency</label>
                  <select
                    value={reqForm.urgency}
                    onChange={(e) => setReqForm({ ...reqForm, urgency: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="Continuous Contract">Continuous Contract</option>
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
                    placeholder="150"
                    value={reqForm.quantityNeeded}
                    onChange={(e) => setReqForm({ ...reqForm, quantityNeeded: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                  <select
                    value={reqForm.unit}
                    onChange={(e) => setReqForm({ ...reqForm, unit: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
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
                    placeholder="30"
                    value={reqForm.maxPricePerUnit}
                    onChange={(e) => setReqForm({ ...reqForm, maxPricePerUnit: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Destination / Plant</label>
                <input
                  type="text"
                  placeholder="City, State"
                  value={reqForm.location}
                  onChange={(e) => setReqForm({ ...reqForm, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feedstock Acceptance Criteria</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Minimum purity, moisture limits, grain size required..."
                  value={reqForm.description}
                  onChange={(e) => setReqForm({ ...reqForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddReqOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Post Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
