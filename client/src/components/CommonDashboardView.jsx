import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Leaf, 
  Recycle, 
  Layers, 
  TrendingUp, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Award,
  Globe,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function CommonDashboardView({ 
  onNavigateSection, 
  currentCompany 
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommonStats();
  }, []);

  const fetchCommonStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard/common');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch common dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {
    totalCompaniesCount: 6,
    totalActiveWasteStreams: 6,
    totalWasteTonnes: 935,
    totalActiveRequirements: 5,
    totalDemandTonnes: 632,
    totalCompletedDeals: 2,
    totalDivertedTonnes: 225,
    totalCo2SavedTonnes: 130.5,
    totalTradeValue: 4140,
    activeNegotiationsCount: 1
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Network Dashboard (All Companies)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Waste2Worth Industrial Symbiosis Exchange
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Real-time public overview across all participating manufacturing plants. 
            Track secondary material flows, cumulative landfill diversion, and cross-industry symbioses.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5 items-center">
            <button
              onClick={() => onNavigateSection('explore_public_listings')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Explore Public Listings</span>
            </button>

            <button
              onClick={() => onNavigateSection('ai_matchmaker')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>View AI Matches</span>
            </button>

            <button
              onClick={fetchCommonStats}
              disabled={loading}
              className="ml-auto inline-flex items-center space-x-1 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 bg-white/5 rounded-lg border border-white/10"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Facilities</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{stats.totalCompaniesCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Connected plants</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Waste For Sale</span>
            <Recycle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700">{stats.totalWasteTonnes} <span className="text-xs">Tons</span></div>
          <div className="text-[10px] text-slate-500 mt-0.5">{stats.totalActiveWasteStreams} active streams</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Raw Needs</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-black text-teal-700">{stats.totalDemandTonnes} <span className="text-xs">Tons</span></div>
          <div className="text-[10px] text-slate-500 mt-0.5">{stats.totalActiveRequirements} active requests</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Landfill Saved</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{stats.totalDivertedTonnes} <span className="text-xs">Tons</span></div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Diverted from dumps</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">CO₂ Abated</span>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-black text-teal-700">{stats.totalCo2SavedTonnes} <span className="text-xs">MT</span></div>
          <div className="text-[10px] text-slate-500 mt-0.5">Net carbon avoided</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Traded</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900">₹{stats.totalTradeValue?.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{stats.totalCompletedDeals} completed deals</div>
        </div>
      </div>

      {/* Main 2-Column Split: Active Circular Symbioses Map & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Industrial Symbiosis Pathways (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Industrial Symbiosis Knowledge Map</h3>
              <p className="text-xs text-slate-500">Live active material transfer loops across industrial sectors</p>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
              Verified Pairings
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs">
                <span className="font-bold text-slate-800">Blast Furnace Slag</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Cement Clinker Substitute</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">
                Apex Steel ➔ Titan Cement
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs">
                <span className="font-bold text-slate-800">Spent Brewer Grains</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">High-Protein Livestock Fodder</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">
                Heritage Brewery ➔ Meadow Feeds
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs">
                <span className="font-bold text-slate-800">Hardwood Sawdust</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Composite Decking Extrusion</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">
                Nordic Timber ➔ GreenPlank
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs">
                <span className="font-bold text-slate-800">Reclaimed Silica Sand</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Concrete Subbase Aggregate</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">
                Apex Steel ➔ Titan Cement
              </span>
            </div>
          </div>
        </div>

        {/* Right: Live Network Activity (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Live Platform Activity</h3>
                <p className="text-xs text-slate-500">Recent transfers & listings across the network</p>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3.5">
              {(data?.recentHistory || []).map((h) => (
                <div key={h.id} className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 truncate">
                      {h.sellerCompanyName} transferred {h.quantity} {h.unit} of {h.wasteTitle} to {h.buyerCompanyName}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {h.completedDate || 'Recent'} • {h.landfillDivertedTonnes} Tons diverted
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-start space-x-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate">
                    Titan Eco-Cement posted demand for Blast Furnace Slag & Aggregate
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Active Demand • Continuous Sourcing</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigateSection('history_overview')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1"
            >
              <span>View Full History Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
