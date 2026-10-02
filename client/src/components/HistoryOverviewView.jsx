import React, { useState } from 'react';
import { 
  History, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Search, 
  Filter, 
  Leaf, 
  Award,
  Layers,
  Scale
} from 'lucide-react';

export default function HistoryOverviewView({ 
  currentCompany, 
  historyData, 
  loading 
}) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'BOUGHT', 'SOLD'
  const [search, setSearch] = useState('');

  const boughtFrom = historyData?.boughtFrom || [];
  const soldTo = historyData?.soldTo || [];

  // Combine with direction tag
  const allRecords = [
    ...boughtFrom.map(b => ({ ...b, direction: 'BOUGHT' })),
    ...soldTo.map(s => ({ ...s, direction: 'SOLD' }))
  ].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  const filtered = allRecords.filter(item => {
    const matchesType = filterType === 'ALL' || item.direction === filterType;
    const matchesSearch = !search || 
      item.wasteTitle.toLowerCase().includes(search.toLowerCase()) ||
      (item.buyerCompanyName && item.buyerCompanyName.toLowerCase().includes(search.toLowerCase())) ||
      (item.sellerCompanyName && item.sellerCompanyName.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-emerald-600" />
              <h1 className="text-xl font-bold text-slate-900">History Overview</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Complete auditable ledger of past bought materials and sold materials with recorded date and time.
            </p>
          </div>

          {/* Filters */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records ({allRecords.length})
            </button>
            <button
              onClick={() => setFilterType('BOUGHT')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'BOUGHT'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Past Bought ({boughtFrom.length})</span>
            </button>
            <button
              onClick={() => setFilterType('SOLD')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'SOLD'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Past Sold ({soldTo.length})</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search transaction by material or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Records Stream */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No transaction records found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Once contracts are finalized in Messages, completed transactions will appear here with exact date and time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isBought = item.direction === 'BOUGHT';
            const counterparty = isBought ? item.sellerCompanyName : item.buyerCompanyName;
            
            // Format date and time
            const dateObj = new Date(item.completedAt);
            const dateStr = item.completedDate || dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = item.completedTime || dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-sm transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                        isBought 
                          ? 'bg-teal-100 text-teal-800 border border-teal-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isBought ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        <span>{isBought ? 'Bought Material (Feedstock Input)' : 'Sold Material (Waste By-Product)'}</span>
                      </span>

                      {/* Exact Date & Time Stamp Badge */}
                      <span className="flex items-center space-x-1 text-slate-500 text-xs bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{dateStr}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-slate-700">{timeStr}</span>
                      </span>

                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Transferred & Fulfilled</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {item.wasteTitle}
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{isBought ? 'Sourced from Seller:' : 'Sold to Buyer:'} <strong className="text-slate-800">{counterparty}</strong></span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-500 italic mt-1">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* Financial & Environmental Metrics Block */}
                  <div className="flex items-center space-x-6 text-xs text-right bg-slate-50 p-3 rounded-xl border border-slate-100 shrink-0">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Transferred Volume</div>
                      <div className="font-extrabold text-slate-900 text-sm">{item.quantity} {item.unit}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Agreed Rate</div>
                      <div className="font-extrabold text-slate-800 text-sm">₹{item.finalPricePerUnit}/{item.unit}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">{isBought ? 'Total Paid' : 'Total Revenue'}</div>
                      <div className={`font-black text-sm ${isBought ? 'text-teal-700' : 'text-emerald-700'}`}>₹{item.totalValue?.toLocaleString()}</div>
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Landfill Saved</div>
                      <div className="font-bold text-emerald-600 text-xs flex items-center justify-end gap-1">
                        <Leaf className="w-3 h-3" />
                        <span>{item.landfillDivertedTonnes} T</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
