import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Tag, 
  Send, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Package, 
  Layers,
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

export default function MarketplaceView({ 
  currentCompany, 
  wasteListings, 
  requirements, 
  onOpenCreateDealModal,
  onNavigateToDepot
}) {
  const [activeTab, setActiveTab] = useState('WASTE'); // 'WASTE' or 'REQUIREMENTS'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter listings
  const filteredWaste = wasteListings.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredReqs = requirements.filter((item) => {
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
      
      {/* Top Banner and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Open Industrial Marketplace
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Explore available secondary raw materials and industrial demand across all companies
            </p>
          </div>

          {/* Toggle between Waste for Sale vs Raw Material Requirements */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('WASTE')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'WASTE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Waste Streams For Sale ({wasteListings.length})</span>
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
              <span>Material Needs / Demands ({requirements.length})</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'WASTE' ? "Search waste products, slag, grain, sawdust..." : "Search required raw materials, pozzolans, packaging..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
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

      {/* Grid of items */}
      {activeTab === 'WASTE' ? (
        // Waste Listings Grid
        filteredWaste.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No waste streams found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWaste.map((item) => {
              const isMine = item.companyId === currentCompany?.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      {isMine ? (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Your Listing
                        </span>
                      ) : (
                        <span className="text-[11px] font-extrabold text-emerald-700">
                          ${item.pricePerUnit} / {item.unit}
                        </span>
                      )}
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

                    {/* Stats pills */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <div className="text-[9px] text-slate-400 font-semibold uppercase">Quantity</div>
                        <div className="text-xs font-bold text-slate-800">{item.quantity} {item.unit}</div>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <div className="text-[9px] text-slate-400 font-semibold uppercase">Purity</div>
                        <div className="text-xs font-bold text-emerald-700">{item.purityPercentage}%</div>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <div className="text-[9px] text-slate-400 font-semibold uppercase">Supply</div>
                        <div className="text-[10px] font-bold text-slate-700 truncate">{item.frequency || 'Batch'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Listed {new Date(item.createdAt).toLocaleDateString()}
                    </span>

                    {isMine ? (
                      <span className="text-xs text-slate-400 font-medium">Manage in Depot</span>
                    ) : (
                      <button
                        onClick={() => onOpenCreateDealModal(item, null)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Buy Request</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        // Requirements Grid
        filteredReqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No requirements found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReqs.map((req) => {
              const isMine = req.companyId === currentCompany?.id;
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                        {req.category}
                      </span>
                      {isMine ? (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Your Need
                        </span>
                      ) : (
                        <span className="text-[11px] font-extrabold text-teal-700">
                          Max ${req.maxPricePerUnit} / {req.unit}
                        </span>
                      )}
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

                    {/* Stats pills */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <div className="text-[9px] text-slate-400 font-semibold uppercase">Target Demand</div>
                        <div className="text-xs font-bold text-slate-800">{req.quantityNeeded} {req.unit}</div>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <div className="text-[9px] text-slate-400 font-semibold uppercase">Schedule</div>
                        <div className="text-[10px] font-bold text-teal-800 truncate">{req.urgency || 'Continuous'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Posted {new Date(req.createdAt).toLocaleDateString()}
                    </span>

                    {isMine ? (
                      <span className="text-xs text-slate-400 font-medium">Manage in Depot</span>
                    ) : (
                      <span className="text-xs text-teal-700 font-semibold">
                        Buyer actively seeking suppliers
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
