import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Layers, 
  Building2, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Info,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Minerals & Construction',
  'Agriculture & Food',
  'Wood & Biomass',
  'Metals & Metallurgy',
  'Plastics & Polymers',
  'Paper & Packaging'
];

export default function ExplorePublicListingsView({ 
  currentCompany, 
  wasteListings, 
  requirements, 
  onOpenCreateDealModal,
  onNavigateSection
}) {
  const [activeTab, setActiveTab] = useState('WASTE'); // 'WASTE' (to buy) or 'REQUIREMENTS' (to supply)
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Exclude own company and items with 0 quantity (fulfilled)
  const publicWaste = wasteListings.filter(w => {
    const isOtherCompany = !currentCompany || w.companyId !== currentCompany.id;
    const hasQuantity = Number(w.quantity) > 0;
    return isOtherCompany && hasQuantity;
  });

  const publicReqs = requirements.filter(r => {
    const isOtherCompany = !currentCompany || r.companyId !== currentCompany.id;
    const hasDemand = Number(r.quantityNeeded) > 0;
    return isOtherCompany && hasDemand;
  });

  // Filter listings by category and search query
  const filteredWaste = publicWaste.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredReqs = publicReqs.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900">Explore Public Listings</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Live Open Market
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Browse secondary raw materials other companies are selling, or raw material needs they are seeking.
              Fulfilled contracts are automatically removed upon delivery.
            </p>
          </div>

          {/* Toggle between Waste For Sale vs Material Demands */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('WASTE')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'WASTE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Waste Available To Sell ({publicWaste.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('REQUIREMENTS')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'REQUIREMENTS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Other Companies' Needs ({publicReqs.length})</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'WASTE' ? "Search available waste streams (e.g. slag, sawdust, pulp, ash)..." : "Search company needs & raw material demands..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex overflow-x-auto pb-1 md:pb-0 gap-1.5 shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {activeTab === 'WASTE' ? (
        filteredWaste.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No available waste streams listed</h3>
            <p className="text-xs text-slate-500 mt-1">All current batches may have been contracted or fulfilled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWaste.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-xs font-black text-emerald-700">
                      ₹{item.pricePerUnit} / {item.unit}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-1">
                    {item.title}
                  </h3>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.companyName}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-[9px] text-slate-400 uppercase font-semibold">Available</div>
                      <div className="font-bold text-slate-800 mt-0.5">{item.quantity} {item.unit}</div>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-[9px] text-slate-400 uppercase font-semibold">Purity</div>
                      <div className="font-bold text-emerald-700 mt-0.5">{item.purityPercentage}%</div>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-[9px] text-slate-400 uppercase font-semibold">Supply</div>
                      <div className="text-[10px] font-bold text-slate-700 truncate mt-0.5">{item.frequency || 'Batch'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Active Stock
                  </span>
                  <button
                    onClick={() => onOpenCreateDealModal(item, null)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Buy Request</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        filteredReqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No raw material requirements found</h3>
            <p className="text-xs text-slate-500 mt-1">Companies have not posted pending demands under this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReqs.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                      {req.category}
                    </span>
                    <span className="text-xs font-black text-teal-700">
                      Budget: Max ₹{req.maxPricePerUnit} / {req.unit}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-1">
                    {req.title}
                  </h3>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{req.companyName}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{req.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-[9px] text-slate-400 uppercase font-semibold">Target Demand</div>
                      <div className="font-bold text-slate-800 mt-0.5">{req.quantityNeeded} {req.unit}</div>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <div className="text-[9px] text-slate-400 uppercase font-semibold">Contract Schedule</div>
                      <div className="text-[10px] font-bold text-teal-800 truncate mt-0.5">{req.urgency || 'Continuous'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Buyer Actively Sourcing
                  </span>
                  <button
                    onClick={() => onNavigateSection('waste_streams')}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    Check if your waste matches ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
}
