import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Leaf, 
  IndianRupee, 
  Building2, 
  MapPin, 
  Send,
  Info,
  Layers,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

export default function AiMatchView({ 
  currentCompany, 
  aiMatches, 
  loading, 
  onRefresh, 
  onOpenCreateDealModal,
  onNavigateToDepot
}) {
  const [filterDirection, setFilterDirection] = useState('BUY'); // BUY or SELL

  const buyerMatches = aiMatches?.buyerMatches || [];
  const sellerMatches = aiMatches?.sellerMatches || [];

  const currentList = filterDirection === 'BUY' ? buyerMatches : sellerMatches;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Hero AI banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Circular Matchmaker</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Smart Industrial Symbiosis for <span className="text-emerald-400">{currentCompany?.name}</span>
          </h1>
          
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Our AI scans your raw material needs against live waste streams across verified partner facilities, 
            identifying chemistry, particle size, and technical compatibility to replace costly virgin inputs.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 items-center">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-semibold text-slate-200">
                {buyerMatches.length} Feedstock Match{buyerMatches.length !== 1 ? 'es' : ''} Found
              </span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-xs">
              <span className="font-semibold text-teal-300">
                {sellerMatches.length} Buyer Opportunity{sellerMatches.length !== 1 ? 'ies' : ''} for your waste
              </span>
            </div>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="ml-auto inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 hover:text-white rounded-lg text-xs font-semibold transition-all border border-emerald-400/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Re-scan Matches</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Buy matches vs Sell matches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="inline-flex p-1 bg-slate-200/70 rounded-xl">
          <button
            onClick={() => setFilterDirection('BUY')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              filterDirection === 'BUY'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📥 Sourcing Feedstock (What You Can Buy)</span>
            <span className="px-1.5 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 font-bold">
              {buyerMatches.length}
            </span>
          </button>

          <button
            onClick={() => setFilterDirection('SELL')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              filterDirection === 'SELL'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📤 Offtake Buyers (Who Wants Your Waste)</span>
            <span className="px-1.5 py-0.5 rounded-full text-xs bg-teal-100 text-teal-800 font-bold">
              {sellerMatches.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Scores calculated via chemical compatibility & budget constraints</span>
        </div>
      </div>

      {/* Matches Content Grid */}
      {currentList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No active AI matches found yet</h3>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            {filterDirection === 'BUY'
              ? 'List your input raw material requirements in Company Depot so our AI can cross-reference active industrial waste streams.'
              : 'List your company waste products in Company Depot so other companies can discover your byproducts.'}
          </p>
          <button
            onClick={onNavigateToDepot}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go to Company Depot & Add Postings
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentList.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header with Score */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {match.direction === 'BUY' ? 'Feedstock Solution' : 'Byproduct Monetization'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {match.wasteListing.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{match.sellerCompany.name}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{match.sellerCompany.location}</span>
                    </div>
                  </div>

                  {/* AI Match Gauge */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-white shadow-md ${
                      match.matchScore >= 80 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                        : 'bg-gradient-to-br from-amber-500 to-orange-600'
                    }`}>
                      <span className="text-base leading-none">{match.matchScore}%</span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">Match</span>
                    </div>
                  </div>
                </div>

                {/* Target Requirement link */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-700">Satisfies Requirement:</span> {match.requirement.title}
                  </div>
                  <span className="font-bold text-slate-800">
                    Target: {match.requirement.quantityNeeded} {match.requirement.unit}
                  </span>
                </div>
              </div>

              {/* Card Body: Synergy Insights & Reasons */}
              <div className="p-5 space-y-4 flex-1">
                {/* AI Explanation Banner */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Industrial Symbiosis Insight</span>
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {match.synergyInsight}
                  </p>
                </div>

                {/* Match factors checklist */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Compatibility Factors
                  </div>
                  {match.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Available Volume</div>
                    <div className="font-extrabold text-xs text-slate-800 mt-0.5">
                      {match.wasteListing.quantity} {match.wasteListing.unit}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Asking Price</div>
                    <div className="font-extrabold text-xs text-emerald-700 mt-0.5">
                      ₹{match.wasteListing.pricePerUnit} / {match.wasteListing.unit}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">CO₂ Offset</div>
                    <div className="font-extrabold text-xs text-teal-700 mt-0.5 flex items-center justify-center gap-1">
                      <Leaf className="w-3 h-3" />
                      <span>{match.estimatedCo2SavedTonnes} T</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer with CTA */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-500">Est. Savings: </span>
                  <span className="font-bold text-emerald-700">₹{match.estimatedSavings?.toLocaleString()}</span>
                </div>

                {match.direction === 'BUY' ? (
                  <button
                    onClick={() => onOpenCreateDealModal(match.wasteListing, match.requirement)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Buy Request</span>
                  </button>
                ) : (
                  <div className="text-xs text-slate-500 font-medium">
                    Wait for buyer's proposal or review in Deals
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
