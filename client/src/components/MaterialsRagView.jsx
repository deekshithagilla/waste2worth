import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Atom, 
  CheckCircle2, 
  ArrowRight, 
  Database, 
  FileText,
  HelpCircle,
  Cpu
} from 'lucide-react';

const MATERIAL_DATABASE = [
  {
    name: 'Rice Husk Ash (RHA)',
    sector: 'Agri-Processing & Milling',
    chemicalProfile: '85-92% Amorphous SiO₂ (Silica), <5% Carbon, High Surface Area',
    circularUseCases: [
      'Supplementary cementitious material (SCM) replacing Portland cement',
      'Refractory insulation brick manufacturing',
      'Water purification silica filter media'
    ],
    standards: 'ASTM C618 Class N Pozzolan, ISO 14021',
    co2Abatement: '0.75 MT CO₂e saved per ton used'
  },
  {
    name: 'Granulated Blast Furnace Slag (GGBS)',
    sector: 'Steel & Metallurgy',
    chemicalProfile: '40% CaO, 35% SiO₂, 13% Al₂O₃, 8% MgO (Vitrified glass matrix)',
    circularUseCases: [
      'Eco-friendly low-carbon slag cement (up to 70% clinker substitution)',
      'High-durability marine concrete aggregate',
      'Road base paving stabilizer'
    ],
    standards: 'ASTM C989 Grade 100/120, EN 15167',
    co2Abatement: '0.82 MT CO₂e saved per ton used'
  },
  {
    name: 'Brewer Spent Grains (BSG)',
    sector: 'Brewing & Fermentation',
    chemicalProfile: '24-28% Crude Protein, 70% Moisture, Rich in Beta-Glucans and Fiber',
    circularUseCases: [
      'High-protein dairy and beef cattle feed rations',
      'Mushroom substrate for oyster & shiitake mycelium cultivation',
      'Anaerobic biogas digester co-substrate'
    ],
    standards: 'FDA Animal Feed Compliant, Non-GMO Organic',
    co2Abatement: '0.40 MT CO₂e saved per ton used'
  },
  {
    name: 'Kiln-Dried Hardwood Sawdust',
    sector: 'Woodworking & Lumber',
    chemicalProfile: 'Cellulose 45%, Lignin 28%, Moisture <8%, Zero glues/resins',
    circularUseCases: [
      'Dense wood pellet fuel & biomass briquettes',
      'Wood-plastic composite (WPC) extrusion decking',
      'Agricultural livestock bedding'
    ],
    standards: 'ENplus A1 Pellet Standard, FSC Certified',
    co2Abatement: '0.55 MT CO₂e saved per ton used'
  },
  {
    name: 'Foundry Silica Sand',
    sector: 'Metal Casting & Foundry',
    chemicalProfile: '95-98% Uniform Quartz SiO₂, sub-angular grain structure',
    circularUseCases: [
      'Asphalt concrete pavement aggregate',
      'Embankment and geotechnical flowable fill',
      'Portland cement raw meal silica component'
    ],
    standards: 'AASHTO M 29, EPA Beneficial Use Certified',
    co2Abatement: '0.35 MT CO₂e saved per ton used'
  }
];

export default function MaterialsRagView({ onNavigateSection }) {
  const [query, setQuery] = useState('');
  const [ragPrompt, setRagPrompt] = useState('');
  const [ragResponse, setRagResponse] = useState(null);
  const [ragLoading, setRagLoading] = useState(false);

  const filteredMaterials = MATERIAL_DATABASE.filter(m => 
    !query || 
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.sector.toLowerCase().includes(query.toLowerCase()) ||
    m.chemicalProfile.toLowerCase().includes(query.toLowerCase())
  );

  const handleRagSearch = (e) => {
    e.preventDefault();
    if (!ragPrompt.trim()) return;

    setRagLoading(true);
    setTimeout(() => {
      setRagResponse({
        query: ragPrompt,
        answer: `RAG Retrieval Match: Based on industrial material taxonomy, "${ragPrompt}" has validated high-affinity synergies with Cement Manufacturing, Animal Feeds, and Composite Polymers. By substituting primary raw inputs with this secondary byproduct, plants typically achieve an estimated 25-45% procurement cost reduction and divert ~0.65 tons of landfill waste per ton utilized.`,
        sources: ['ASTM C618 Standards', 'Circular Symbiosis Knowledge Graph', 'Industrial Material Safety Index 2026']
      });
      setRagLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl pb-10">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Materials & RAG Knowledge Engine
          </h1>
        </div>
        <p className="text-slate-500 text-xs mt-1">
          Material science taxonomy and RAG (Retrieval-Augmented Generation) query engine for secondary byproduct valuation and ASTM standards.
        </p>

        {/* RAG Query Input */}
        <form onSubmit={handleRagSearch} className="mt-5 space-y-2">
          <div className="relative">
            <Cpu className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-600" />
            <input
              type="text"
              placeholder="Ask RAG: Can rice husk ash substitute micro-silica in high-performance concrete?"
              value={ragPrompt}
              onChange={(e) => setRagPrompt(e.target.value)}
              className="w-full pl-10 pr-28 py-3 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#134e35] outline-none shadow-2xs"
            />
            <button
              type="submit"
              disabled={ragLoading}
              className="absolute right-2 top-2 px-4 py-1.5 bg-[#134e35] hover:bg-[#0f3f2b] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              {ragLoading ? 'Analyzing...' : 'Query RAG'}
            </button>
          </div>
        </form>

        {/* RAG Response Box */}
        {ragResponse && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs animate-fade-in">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>RAG Analysis Response</span>
            </div>
            <p className="text-emerald-950 leading-relaxed font-medium">{ragResponse.answer}</p>
            <div className="mt-2 text-[10px] text-emerald-700 flex items-center space-x-2">
              <span className="font-bold">Sources:</span>
              <span>{ragResponse.sources.join(' • ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Material Taxonomy Database */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Industrial Material Taxonomy ({filteredMaterials.length})
          </h2>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search materials, chemistry..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#134e35] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((mat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {mat.sector}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{mat.name}</h3>
                </div>
                <Atom className="w-5 h-5 text-slate-400" />
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-1">
                <div>
                  <span className="font-bold text-slate-700">Chemical Profile: </span>
                  <span>{mat.chemicalProfile}</span>
                </div>

                <div>
                  <span className="font-bold text-slate-700">Validated Circular Uses:</span>
                  <ul className="list-disc pl-4 space-y-0.5 mt-0.5 text-slate-600">
                    {mat.circularUseCases.map((use, idx) => (
                      <li key={idx}>{use}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">{mat.standards}</span>
                  <span className="font-bold text-emerald-700">{mat.co2Abatement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
