import React, { useState } from 'react';
import { 
  History, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Leaf, 
  DollarSign, 
  CheckCircle2, 
  Award, 
  Building2, 
  Calendar, 
  Download,
  X,
  ShieldCheck
} from 'lucide-react';

export default function HistoryView({ currentCompany, historyData, loading }) {
  const [activeTab, setActiveTab] = useState('SOLD'); // 'SOLD' (who bought from us) or 'BOUGHT' (we bought from)
  const [showCertificate, setShowCertificate] = useState(false);

  const boughtFrom = historyData?.boughtFrom || [];
  const soldTo = historyData?.soldTo || [];
  const metrics = historyData?.metrics || {
    totalWasteDivertedTonnes: 0,
    totalCo2SavedTonnes: 0,
    totalSalesRevenue: 0,
    totalPurchasesCost: 0,
    completedDealsCount: 0
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ESG Impact Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between opacity-80 text-xs font-bold uppercase tracking-wider">
            <span>Landfill Diverted</span>
            <Leaf className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-black">
            {metrics.totalWasteDivertedTonnes} <span className="text-sm font-semibold">Tons</span>
          </div>
          <p className="text-[11px] text-emerald-100 mt-1">Secondary materials repurposed</p>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between opacity-80 text-xs font-bold uppercase tracking-wider">
            <span>CO₂ Emissions Saved</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl font-black">
            {metrics.totalCo2SavedTonnes} <span className="text-sm font-semibold">MT CO₂e</span>
          </div>
          <p className="text-[11px] text-teal-100 mt-1">Lifecycle emissions avoided</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between opacity-80 text-xs font-bold uppercase tracking-wider">
            <span>Waste Sales Revenue</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            ${metrics.totalSalesRevenue?.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-300 mt-1">Turned disposal cost to income</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between opacity-80 text-xs font-bold uppercase tracking-wider">
            <span>Procurement Spend</span>
            <ArrowDownLeft className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-teal-300">
            ${metrics.totalPurchasesCost?.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-300 mt-1">Discounted feedstock inputs</p>
        </div>
      </div>

      {/* Main Records Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Transaction & Trade History</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified auditable records of all closed circular economy transfers
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCertificate(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>ESG Impact Certificate</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mt-5 flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('SOLD')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'SOLD'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span>Companies Who Bought From Us ({soldTo.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('BOUGHT')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'BOUGHT'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 text-teal-600" />
            <span>Companies We Bought From ({boughtFrom.length})</span>
          </button>
        </div>

        {/* Records List */}
        <div className="mt-6">
          {activeTab === 'SOLD' ? (
            soldTo.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No sales records yet. Completed deals will be logged here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {soldTo.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-bold text-slate-900 text-sm">{record.wasteTitle}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          Sales Order
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sold to: <strong className="text-slate-700">{record.buyerCompanyName}</strong></span>
                        <span>•</span>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(record.completedAt).toLocaleDateString()}</span>
                      </div>

                      {record.notes && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          "{record.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-6 text-xs text-right">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Volume</div>
                        <div className="font-bold text-slate-800">{record.quantity} {record.unit}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Rate</div>
                        <div className="font-bold text-emerald-700">${record.finalPricePerUnit}/{record.unit}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Revenue</div>
                        <div className="font-black text-slate-900 text-sm">${record.totalValue?.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            boughtFrom.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No purchase records yet. Finalized purchases will be logged here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {boughtFrom.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-bold text-slate-900 text-sm">{record.wasteTitle}</span>
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-bold text-[10px]">
                          Feedstock Procurement
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sourced from: <strong className="text-slate-700">{record.sellerCompanyName}</strong></span>
                        <span>•</span>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(record.completedAt).toLocaleDateString()}</span>
                      </div>

                      {record.notes && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          "{record.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-6 text-xs text-right">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Volume</div>
                        <div className="font-bold text-slate-800">{record.quantity} {record.unit}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Rate</div>
                        <div className="font-bold text-teal-700">${record.finalPricePerUnit}/{record.unit}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Paid</div>
                        <div className="font-black text-slate-900 text-sm">${record.totalValue?.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* ESG Impact Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border-4 border-emerald-600 p-8 relative text-center">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Award className="w-8 h-8" />
            </div>

            <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-800">
              Waste2Worth Circular Economy Alliance
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Certificate of Sustainability Impact
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Official Verification of Industrial Byproduct Diversion
            </p>

            <div className="my-6 p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-left space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Certified Enterprise:</span>
                <span className="font-black text-slate-900 text-sm">{currentCompany?.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Total Landfill Waste Diverted:</span>
                <span className="font-bold text-emerald-800">{metrics.totalWasteDivertedTonnes} Metric Tons</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Calculated Carbon Abatement:</span>
                <span className="font-bold text-teal-800">{metrics.totalCo2SavedTonnes} MT CO₂e</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Completed Circular Symbioses:</span>
                <span className="font-bold text-slate-900">{metrics.completedDealsCount} Contracts</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-4">
              <div className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified by Waste2Worth Protocol</span>
              </div>
              <span>Issue Date: {new Date().toLocaleDateString()}</span>
            </div>

            <button
              onClick={() => alert('Certificate downloaded for ESG Reporting!')}
              className="mt-6 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Certificate for ESG / Regulatory Filing</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
