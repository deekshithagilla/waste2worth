import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Building2, 
  IndianRupee, 
  Scale, 
  CheckCircle, 
  CheckCheck,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function ChatModal({ 
  isOpen, 
  onClose, 
  deal, 
  currentCompany, 
  onUpdateDealStatus 
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Negotiated fields
  const [negotiatedPrice, setNegotiatedPrice] = useState(deal?.offeredPricePerUnit || 0);
  const [negotiatedQty, setNegotiatedQty] = useState(deal?.requestedQuantity || 0);
  const [isEditingTerms, setIsEditingTerms] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (deal) {
      setNegotiatedPrice(deal.offeredPricePerUnit);
      setNegotiatedQty(deal.requestedQuantity);
      fetchMessages();
    }
  }, [deal]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Periodic polling for new chat messages
  useEffect(() => {
    if (!isOpen || !deal) return;
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [isOpen, deal]);

  const fetchMessages = async () => {
    if (!deal) return;
    try {
      const res = await fetch(`/api/chat/${deal.id}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !deal) return;

    const isBuyer = currentCompany.id === deal.buyerCompanyId;
    const receiverId = isBuyer ? deal.sellerCompanyId : deal.buyerCompanyId;
    const receiverName = isBuyer ? deal.sellerCompanyName : deal.buyerCompanyName;

    const payload = {
      senderCompanyId: currentCompany.id,
      senderCompanyName: currentCompany.name,
      receiverCompanyId: receiverId,
      receiverCompanyName: receiverName,
      text: text.trim()
    };

    try {
      const res = await fetch(`/api/chat/${deal.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setText('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleSaveTerms = async () => {
    try {
      await fetch(`/api/deals/${deal.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: deal.status,
          finalPrice: Number(negotiatedPrice),
          finalQuantity: Number(negotiatedQty)
        })
      });
      setIsEditingTerms(false);
      fetchMessages();
    } catch (err) {
      console.error('Error updating terms:', err);
    }
  };

  if (!isOpen || !deal) return null;

  const isBuyer = currentCompany.id === deal.buyerCompanyId;
  const counterpartyName = isBuyer ? deal.sellerCompanyName : deal.buyerCompanyName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-100 flex flex-col h-[650px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              {counterpartyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm">{counterpartyName}</h3>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                  {isBuyer ? 'Supplier' : 'Buyer'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Negotiating: <span className="text-emerald-400 font-semibold">{deal.wasteTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Deal Negotiation Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-slate-400 font-medium">Negotiated Price: </span>
              {isEditingTerms ? (
                <input
                  type="number"
                  value={negotiatedPrice}
                  onChange={(e) => setNegotiatedPrice(e.target.value)}
                  className="w-16 px-1.5 py-0.5 border rounded font-bold text-slate-800 ml-1"
                />
              ) : (
                <span className="font-bold text-emerald-700">₹{deal.offeredPricePerUnit} / {deal.unit}</span>
              )}
            </div>

            <div>
              <span className="text-slate-400 font-medium">Volume: </span>
              {isEditingTerms ? (
                <input
                  type="number"
                  value={negotiatedQty}
                  onChange={(e) => setNegotiatedQty(e.target.value)}
                  className="w-16 px-1.5 py-0.5 border rounded font-bold text-slate-800 ml-1"
                />
              ) : (
                <span className="font-bold text-slate-800">{deal.requestedQuantity} {deal.unit}</span>
              )}
            </div>

            <div className="hidden sm:block">
              <span className="text-slate-400 font-medium">Total: </span>
              <span className="font-black text-slate-900">₹{(deal.offeredPricePerUnit * deal.requestedQuantity).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            {isEditingTerms ? (
              <button
                onClick={handleSaveTerms}
                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-xs"
              >
                Save Terms
              </button>
            ) : (
              <button
                onClick={() => setIsEditingTerms(true)}
                className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-lg font-medium text-xs"
              >
                Modify Terms
              </button>
            )}

            {deal.status === 'pending' && !isBuyer && (
              <button
                onClick={() => {
                  onUpdateDealStatus(deal.id, 'accepted');
                  onClose();
                }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm"
              >
                Accept Proposal
              </button>
            )}

            {deal.status === 'accepted' && (
              <button
                onClick={() => {
                  onUpdateDealStatus(deal.id, 'completed');
                  onClose();
                }}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>
            )}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MessageSquare className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-xs">No messages exchanged yet. Send a greeting to start negotiating!</p>
            </div>
          ) : (
            messages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="text-[11px] bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-semibold">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isMine = msg.senderCompanyId === currentCompany.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-1 px-1">
                    {msg.senderCompanyName}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                      isMine
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            placeholder={`Message ${counterpartyName} about specs, logistics, payment terms...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

      </div>
    </div>
  );
}
