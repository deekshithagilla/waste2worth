import React from 'react';
import { 
  Building2, 
  Sparkles, 
  TrendingUp, 
  Leaf, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Recycle, 
  Layers, 
  MessageSquare, 
  Award, 
  Globe, 
  Users, 
  BarChart2, 
  Clock, 
  Compass, 
  ChevronRight, 
  Mail, 
  CheckCheck,
  Zap,
  ArrowUpRight
} from 'lucide-react';

export default function HomePage({ 
  onNavigateToLogin, 
  onNavigateToSignup, 
  onExploreDemo,
  demoCompanies = []
}) {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Recycle className="w-6 h-6 text-white font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-xl font-black tracking-tight text-slate-900">Waste</span>
                <span className="text-xl font-black text-emerald-600">2Worth</span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                Industrial Symbiosis Platform
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">Platform Pillars</a>
            <a href="#materials" className="hover:text-emerald-600 transition-colors">Material Streams</a>
            <a href="#impact" className="hover:text-emerald-600 transition-colors">ESG Impact</a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateToLogin}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={onNavigateToSignup}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-24 px-6 sm:px-8 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/80">
        {/* Soft Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-200/35 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-teal-200/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI-Powered B2B Circular Economy & Resource Exchange</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] max-w-4xl mx-auto">
            Turn Industrial Waste Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700">Valuable Resources</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The intelligent cross-industry exchange connecting manufacturing plants, steel mills, cement producers, and bio-refineries. Monetize byproduct streams, cut virgin feedstock procurement costs by up to <strong className="text-slate-900 font-bold">50%</strong>, and eliminate landfill disposal.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onNavigateToSignup}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center space-x-2"
            >
              <span>Register Your Enterprise</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToLogin}
              className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-sm transition-all flex items-center space-x-2"
            >
              <span>Sign In to Portal</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              onClick={onExploreDemo}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-all flex items-center space-x-2"
            >
              <Globe className="w-4 h-4 text-teal-600" />
              <span>Explore Live Platform</span>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-100/90">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">35% - 50%</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Feedstock Cost Reduction</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-teal-600">100%</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Landfill Waste Diversion</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-700">AI Match</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Cross-Sector Symbiosis</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">Automated</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Email Contract Notices</div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS (5-STEP CIRCULAR JOURNEY) */}
      <section id="how-it-works" className="py-20 px-6 sm:px-8 bg-slate-50 border-y border-slate-200/90">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-700 text-xs font-black uppercase tracking-widest">
              End-to-End Circular Workflow
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              How Waste2Worth Connects Industries
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              From byproduct listing to verified transfer, Waste2Worth automates the entire industrial symbiosis cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Step 1 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm mb-4 border border-emerald-200">
                  01
                </div>
                <h3 className="font-bold text-slate-900 text-base">List Waste Streams</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Producers catalog industrial byproducts, slag, ash, spent grains, polymers, and timber offcuts with price and volume.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Recycle className="w-3.5 h-3.5" />
                <span>Monetize Byproducts</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-sm mb-4 border border-teal-200">
                  02
                </div>
                <h3 className="font-bold text-slate-900 text-base">Post Requirements</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Manufacturers publish raw material input needs, target volumes, and maximum price thresholds.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Cheaper Feedstock</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-black text-sm mb-4 border border-cyan-200">
                  03
                </div>
                <h3 className="font-bold text-slate-900 text-base">AI Matchmaker</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Our matching engine scores chemical suitability, logistical proximity, and economic synergies between facilities.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-cyan-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Automated Pairing</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black text-sm mb-4 border border-purple-200">
                  04
                </div>
                <h3 className="font-bold text-slate-900 text-base">Negotiate & Chat</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Direct B2B secure chat to agree on volume, pricing per ton, transport schedules, and contract terms.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Direct B2B Chat</span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm mb-4 border border-emerald-200">
                  05
                </div>
                <h3 className="font-bold text-slate-900 text-base">Contract & Emails</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Instant contract execution, automatic stock deductions, permanent history auditing, and dual-company email notices.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Dual Email Notices</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PLATFORM PILLARS (FEATURES GRID) */}
      <section id="features" className="py-20 px-6 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-700 text-xs font-black uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              Engineered for Industrial Scale
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Everything enterprises need to transition from linear consumption to closed-loop circularity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Live Common Dashboard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time visibility into cross-facility circular flows, diverted landfill tonnage, active byproduct streams, and global industrial symbiosis metrics.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 border border-teal-100">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Matchmaker Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Continuously analyzes compatibility, calculating match percentages between secondary feedstocks and active industrial manufacturing requirements.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 border border-purple-100">
                <CheckCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Inventory Settlement</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Once contracts are agreed and transferred, quantities are automatically subtracted or removed from both companies' public listings in real-time.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-cyan-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6 border border-cyan-100">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Dual-Party Email Receipts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatic official email dispatch to both parties upon acceptance and completion, complete with contract terms, pricing, and certified ESG impact.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive Visual Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive financial charts, feedstock cost benchmarks, circular allocation donuts, and real-world ecological equivalencies (cars, trees, water).
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 border border-teal-100">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">ESG Sustainability Certificates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exportable audited certificates quantifying diverted metric tons, carbon dioxide equivalents abated, and circular compliance for SEC and ESG reporting.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SAMPLE INDUSTRIAL SECTORS */}
      <section id="materials" className="py-16 px-6 sm:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Active Material Streams & Industrial Sectors</h3>
              <p className="text-xs text-slate-600 mt-1">Cross-industry byproducts continuously exchanged on the network</p>
            </div>
            <button
              onClick={onExploreDemo}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start md:self-auto"
            >
              <span>View Live Marketplace Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: 'Iron Scrap', sub: 'Steel -> Cement & Foundry', color: 'bg-amber-50/90 border-amber-200' },
              { title: 'Fly Ash', sub: 'Boiler Ash -> Cement & Bricks', color: 'bg-slate-100 border-slate-300' },
              { title: 'Wood Waste', sub: 'Furniture -> Paper & Boards', color: 'bg-yellow-50/90 border-yellow-200' },
              { title: 'Plastic Waste', sub: 'Packaging -> Recycled Plastic', color: 'bg-cyan-50 border-cyan-200' },
              { title: 'Paper Waste', sub: 'Printing -> Cartons & Boxes', color: 'bg-emerald-50 border-emerald-200' },
              { title: 'Bio Waste', sub: 'Agriculture -> Compost & Gas', color: 'bg-teal-50 border-teal-200' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl ${item.color} border shadow-sm flex flex-col justify-between hover:shadow-md transition-all`}
              >
                <div className="font-bold text-xs text-slate-900">{item.title}</div>
                <div className="text-[10px] text-slate-600 mt-2 font-medium">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 px-6 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-10 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-emerald-500/20">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-200">
              Ready to Accelerate Industrial Symbiosis?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 leading-tight">
              Join Hundreds of Enterprises Turning Waste Into Worth Today.
            </h2>
            <p className="mt-4 text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Create your company profile in under 2 minutes. Start listing secondary materials or source high-grade industrial feedstocks at substantial cost savings.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onNavigateToSignup}
                className="px-7 py-3 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
              >
                Create Company Account
              </button>
              <button
                onClick={onNavigateToLogin}
                className="px-7 py-3 bg-emerald-950/60 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
              >
                Sign In With Existing Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 px-6 sm:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Recycle className="w-4 h-4 font-bold" />
            </div>
            <div>
              <span className="font-bold text-slate-900">Waste2Worth</span>
              <span className="text-[10px] text-slate-500 block">Industrial Symbiosis Network</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-500">
            <span>ISO 14001 Compliant</span>
            <span>GHG Scope 3 Accounting</span>
            <span>Verified Industrial Protocol</span>
          </div>

          <div className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} Waste2Worth Alliance. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
