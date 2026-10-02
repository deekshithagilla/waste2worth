import React from 'react';
import { Building, Layout, Sparkles, Image, Upload } from 'lucide-react';

export default function OrganisationView({ currentCompany }) {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <Building className="w-5 h-5 text-emerald-600" />
          <h1 className="text-xl font-bold text-slate-900">Organisation</h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
            Awaiting Screenshot / Design
          </span>
        </div>
        <p className="text-slate-500 text-xs mt-1">
          Custom departmental structure, facility branches, and organizational team mapping for <strong className="text-slate-700">{currentCompany?.name}</strong>.
        </p>
      </div>

      {/* Clean Empty Placeholder Canvas */}
      <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-16 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Image className="w-8 h-8 text-slate-400" />
        </div>

        <h3 className="text-lg font-bold text-slate-800">Organisation Section (Ready for Your Design)</h3>
        
        <p className="text-slate-500 text-xs max-w-md mx-auto mt-2 leading-relaxed">
          This section is currently left empty as requested. Whenever you are ready, share your screenshot or design specifications, and we will build this section out to match your requirements.
        </p>

        <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Canvas Initialized & Ready</span>
        </div>
      </div>

    </div>
  );
}
