import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ExternalLink, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  Inbox
} from 'lucide-react';

export default function EmailNotificationsModal({
  isOpen,
  onClose,
  notifications = [],
  currentCompany
}) {
  const [selectedEmail, setSelectedEmail] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Contract Email Notifications</h3>
              <p className="text-[11px] text-slate-400">
                Automated emails dispatched to both parties upon contract acceptance & finalization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {selectedEmail ? (
            /* Email Preview Detail View */
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  ← Back to Email List
                </button>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Status: {selectedEmail.status}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">To Recipient:</span>
                  <span className="font-bold text-slate-900">{selectedEmail.recipientEmail} ({selectedEmail.recipientCompanyName})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Counterparty:</span>
                  <span className="font-semibold text-slate-800">{selectedEmail.counterpartyName} ({selectedEmail.counterpartyEmail})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Subject:</span>
                  <span className="font-bold text-slate-800">{selectedEmail.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Dispatched At:</span>
                  <span className="text-slate-600">{new Date(selectedEmail.sentAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Rendered HTML Email Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-100 p-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Delivered Corporate HTML Email Preview</span>
                </div>
                <div 
                  className="bg-white rounded-lg p-2 max-h-[380px] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                />
              </div>
            </div>
          ) : (
            /* Email List View */
            notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Inbox className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <h4 className="font-bold text-slate-700 text-sm">No contract emails dispatched yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  When a contract proposal is accepted or finalized in Messages, both the buyer and seller will immediately receive official email notifications recorded here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                  <span>Recent Outbox Deliveries ({notifications.length})</span>
                  <span className="text-[11px] text-emerald-700 font-bold">Both Parties Notified</span>
                </div>

                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedEmail(item)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50/80 cursor-pointer transition-all shadow-sm group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            item.eventType === 'completed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.eventType === 'completed' ? 'Finalized Contract' : 'Contract Accepted'}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.sentAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {item.subject}
                        </h4>

                        <div className="text-[11px] text-slate-500">
                          To: <strong className="text-slate-700">{item.recipientEmail}</strong> ({item.recipientCompanyName})
                        </div>
                      </div>

                      <button className="text-emerald-700 hover:text-emerald-800 text-xs font-bold shrink-0 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Preview</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dual-delivery protocol: Buyer & Seller receive identical transaction records</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
