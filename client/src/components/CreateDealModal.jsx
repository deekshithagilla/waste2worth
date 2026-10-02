import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Building2, 
  IndianRupee, 
  Scale, 
  Package, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function CreateDealModal({ 
  isOpen, 
  onClose, 
  wasteListing, 
  requirement, 
  currentCompany, 
  onSubmitDeal 
}) {
  const [quantity, setQuantity] = useState(10);
  const [offeredPrice, setOfferedPrice] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wasteListing) {
      // Default quantity to target need if available, or full waste quantity
      const defaultQty = requirement?.quantityNeeded 
        ? Math.min(requirement.quantityNeeded, wasteListing.quantity)
        : wasteListing.quantity;
      setQuantity(defaultQty);
      setOfferedPrice(wasteListing.pricePerUnit);
      setMessage(`Hello ${wasteListing.companyName} team, we are interested in purchasing ${defaultQty} ${wasteListing.unit} of your "${wasteListing.title}". Please let us know if this volume is available.`);
    }
  }, [wasteListing, requirement]);

  if (!isOpen || !wasteListing) return null;

  const totalValue = Number(quantity || 0) * Number(offeredPrice || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dealPayload = {
      wasteListingId: wasteListing.id,
      wasteTitle: wasteListing.title,
      buyerCompanyId: currentCompany.id,
      buyerCompanyName: currentCompany.name,
      buyerCompanyEmail: currentCompany.email,
      sellerCompanyId: wasteListing.companyId,
      sellerCompanyName: wasteListing.companyName,
      sellerCompanyEmail: wasteListing.companyEmail,
      requestedQuantity: Number(quantity),
      unit: wasteListing.unit,
      offeredPricePerUnit: Number(offeredPrice),
      initialMessage: message
    };

    await onSubmitDeal(dealPayload);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>Send Purchase Proposal</span>
            </h2>
            <p className="text-emerald-100 text-xs">
              Initiate formal negotiation with {wasteListing.companyName}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Target material overview */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Selected Material
            </div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">
              {wasteListing.title}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center justify-between">
              <span>Seller: {wasteListing.companyName} ({wasteListing.location})</span>
              <span className="font-semibold text-emerald-700">List Price: ₹{wasteListing.pricePerUnit}/{wasteListing.unit}</span>
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Requested Volume ({wasteListing.unit}) *
              </label>
              <input
                type="number"
                required
                min="1"
                max={wasteListing.quantity * 2}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
              />
              <span className="text-[10px] text-slate-400">Available: {wasteListing.quantity} {wasteListing.unit}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Offered Price (₹ / ) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-700"
              />
              <span className="text-[10px] text-slate-400">Negotiable during chat</span>
            </div>
          </div>

          {/* Total Contract Estimation */}
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
            <span className="text-emerald-900 font-medium">Estimated Purchase Value:</span>
            <span className="text-base font-black text-emerald-800">
              ${totalValue.toLocaleString()}
            </span>
          </div>

          {/* Initial Message to Seller */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Proposal Message / Doubts / Specs Inquiry
            </label>
            <textarea
              rows="3"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about purity certificates, delivery logistics, payment method..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Sending Request...' : 'Send Buy Request'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
