import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Inbox, 
  Send, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Clock, 
  Building2, 
  DollarSign, 
  Scale, 
  CheckCheck,
  ShieldAlert
} from 'lucide-react';

export default function DealRequestsView({ 
  currentCompany, 
  deals, 
  onUpdateDealStatus, 
  onOpenChat 
}) {
  const [activeTab, setActiveTab] = useState('INCOMING'); // 'INCOMING' or 'OUTGOING'

  const receivedRequests = deals?.receivedRequests || [];
  const sentRequests = deals?.sentRequests || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Accepted</span>;
      case 'declined':
        return <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Declined</span>;
      case 'completed':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold flex items-center gap-1"><CheckCheck className="w-3 h-3" /> Completed</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending Review</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Deals & Purchase Requests</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage incoming offtake proposals for your waste and track purchase requests you sent to other sellers
            </p>
          </div>

          {/* Tab selector */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('INCOMING')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'INCOMING'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Received Requests ({receivedRequests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('OUTGOING')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'OUTGOING'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Sent Requests ({sentRequests.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'INCOMING' ? (
        // Received Requests (Companies wanting to buy our waste)
        receivedRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-base">No incoming buy requests yet</h3>
            <p className="text-slate-500 text-xs mt-1">
              When other companies find your waste listings and send a purchase proposal, they will appear here.
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
                        Incoming Proposal
                      </span>
                      {getStatusBadge(deal.status)}
                      <span className="text-xs text-slate-400">
                        {new Date(deal.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      Purchase Proposal for: <span className="text-emerald-700">{deal.wasteTitle}</span>
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">Buyer: {deal.buyerCompanyName}</span>
                      <span>({deal.buyerCompanyEmail})</span>
                    </div>

                    {/* Proposal Details pill */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Requested Volume: </span>
                        <span className="font-bold text-slate-800">{deal.requestedQuantity} {deal.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Offered Price: </span>
                        <span className="font-bold text-emerald-700">${deal.offeredPricePerUnit} / {deal.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Total Contract Value: </span>
                        <span className="font-black text-slate-900">${deal.totalValue?.toLocaleString()}</span>
                      </div>
                    </div>

                    {deal.initialMessage && (
                      <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                        "{deal.initialMessage}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
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
                          <span>Accept Proposal</span>
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
                        <span>Finalize & Record Deal</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // Sent Requests (Requests we sent to buy from other companies)
        sentRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <Send className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-base">No outgoing purchase requests</h3>
            <p className="text-slate-500 text-xs mt-1">
              Browse the AI Matchmaker or Marketplace to send purchase proposals for secondary raw materials.
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
                        Outgoing Sourcing Request
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

                    {/* Proposal Details pill */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Requested Volume: </span>
                        <span className="font-bold text-slate-800">{deal.requestedQuantity} {deal.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Your Offered Price: </span>
                        <span className="font-bold text-emerald-700">${deal.offeredPricePerUnit} / {deal.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Estimated Total: </span>
                        <span className="font-black text-slate-900">${deal.totalValue?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
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
                        <span>Confirm Delivery & Complete</span>
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
