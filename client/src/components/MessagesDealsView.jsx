import React, { useState } from 'react';
import { 
  MessageSquare, 
  Inbox, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  IndianRupee, 
  CheckCheck,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function MessagesDealsView({ 
  currentCompany, 
  deals, 
  onUpdateDealStatus, 
  onOpenChat 
}) {
  const [activeTab, setActiveTab] = useState('RECEIVED'); // 'RECEIVED' or 'SENT'

  const receivedRequests = deals?.receivedRequests || [];
  const sentRequests = deals?.sentRequests || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Contract Agreed</span>;
      case 'declined':
        return <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Declined</span>;
      case 'completed':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold flex items-center gap-1"><CheckCheck className="w-3 h-3" /> Transferred & Fulfilled</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Proposal Pending</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Messages (Deals & Requests)</h1>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Negotiate quantity, pricing, and terms with other companies. Once transferred, contracts are permanently recorded.
          </p>
        </div>

        {/* Tab Switcher: Received vs Sent */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('RECEIVED')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'RECEIVED'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Received Requests ({receivedRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SENT')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'SENT'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sent Requests ({sentRequests.length})</span>
          </button>
        </div>
      </div>

      {/* Main Deals Content */}
      {activeTab === 'RECEIVED' ? (
        // RECEIVED REQUESTS (Others wanting to buy our waste)
        receivedRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No incoming proposals</h3>
            <p className="text-xs text-slate-500 mt-1">
              When other companies send buy proposals for your waste streams, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-200 p-5 shadow-sm transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        Incoming Buy Proposal
                      </span>
                      {getStatusBadge(deal.status)}
                      <span className="text-xs text-slate-400">
                        {new Date(deal.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      Proposal to Purchase: <span className="text-emerald-700">{deal.wasteTitle}</span>
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">Buyer: {deal.buyerCompanyName}</span>
                      <span>({deal.buyerCompanyEmail})</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Requested Volume: </span>
                        <span className="font-bold text-slate-800">{deal.requestedQuantity} {deal.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Offered Price: </span>
                        <span className="font-bold text-emerald-700">₹{deal.offeredPricePerUnit} / {deal.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Total Contract Value: </span>
                        <span className="font-black text-slate-900">₹{deal.totalValue?.toLocaleString()}</span>
                      </div>
                    </div>

                    {deal.initialMessage && (
                      <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                        "{deal.initialMessage}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 justify-end">
                    <button
                      onClick={() => onOpenChat(deal)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat & Negotiate</span>
                    </button>

                    {deal.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onUpdateDealStatus(deal.id, 'accepted')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept Contract</span>
                        </button>
                        <button
                          onClick={() => onUpdateDealStatus(deal.id, 'declined')}
                          className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    {deal.status === 'accepted' && (
                      <button
                        onClick={() => onUpdateDealStatus(deal.id, 'completed')}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Confirm Transfer & Finalize</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // SENT REQUESTS (Proposals we sent to buy from other companies)
        sentRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Send className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No outgoing proposals</h3>
            <p className="text-xs text-slate-500 mt-1">
              Browse the AI Matchmaker or Explore Public Listings to send buy proposals for secondary materials.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sentRequests.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-200 p-5 shadow-sm transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        Outgoing Sourcing Proposal
                      </span>
                      {getStatusBadge(deal.status)}
                      <span className="text-xs text-slate-400">
                        {new Date(deal.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      Request to Purchase: <span className="text-emerald-700">{deal.wasteTitle}</span>
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">Seller: {deal.sellerCompanyName}</span>
                      <span>({deal.sellerCompanyEmail})</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Requested Volume: </span>
                        <span className="font-bold text-slate-800">{deal.requestedQuantity} {deal.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Offered Price: </span>
                        <span className="font-bold text-emerald-700">₹{deal.offeredPricePerUnit} / {deal.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Total Contract: </span>
                        <span className="font-black text-slate-900">₹{deal.totalValue?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 justify-end">
                    <button
                      onClick={() => onOpenChat(deal)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat with Seller</span>
                    </button>

                    {deal.status === 'accepted' && (
                      <button
                        onClick={() => onUpdateDealStatus(deal.id, 'completed')}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Confirm Transfer & Finalize</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
}
