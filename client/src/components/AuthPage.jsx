import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  UserPlus, 
  LogIn, 
  Leaf, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Award,
  Globe,
  ChevronLeft
} from 'lucide-react';

const INDUSTRIES = [
  'Manufacturing & Heavy Industry',
  'Steel & Metallurgy',
  'Cement & Construction',
  'Agriculture & Food Processing',
  'Woodworking, Lumber & Biomass',
  'Plastics, Polymers & Packaging',
  'Paper, Pulp & Cardboard',
  'Chemicals, Solvents & Ash',
  'Textiles & Recycled Fabrics',
  'Electronics & Battery Recycling',
  'Other Industrial Sector'
];

export default function AuthPage({ 
  initialMode = 'login', 
  onLoginSuccess, 
  demoCompanies, 
  onBackToHome,
  onBackToMarketplace 
}) {
  const [authMode, setAuthMode] = useState(initialMode); // 'login' or 'signup'
  
  // Registration form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    industry: 'Manufacturing & Heavy Industry',
    location: '',
    description: ''
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  // Handle Sign Up
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regData.name.trim() || !regData.email.trim()) {
      setError('Please provide your company name and corporate email.');
      return;
    }
    if (!regData.password.trim()) {
      setError('Please choose a password for your account.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.company);
      } else {
        setError(data.error || 'Failed to create account.');
      }
    } catch (err) {
      setError('Could not connect to backend server. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign In
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email.trim()) {
      setError('Please enter your company email or legal name.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.company);
      } else {
        setError(data.error || 'Failed to sign in.');
      }
    } catch (err) {
      setError('Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (company) => {
    onLoginSuccess(company);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden animate-fade-in">
      
      {/* Background glowing ambient elements */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top back button */}
      <div className="max-w-6xl w-full mx-auto mb-4 flex items-center justify-between">
        <button
          onClick={onBackToHome || onBackToMarketplace}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>← Back to Home</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Industrial Network</span>
        </div>
      </div>

      {/* Main Split Layout Container */}
      <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Brand Panel (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl"></div>

          <div>
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Leaf className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="font-black text-2xl tracking-tight">
                  Waste<span className="text-emerald-400">2</span>Worth
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                  Circular Industrial Exchange
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Where Industrial Waste Becomes Feedstock.
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
              Every factory produces residual byproducts, and every factory requires raw materials. 
              Our AI engine maps cross-industry synergies so you can monetize scrap and source cheap inputs.
            </p>

            {/* Value Pillars */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start space-x-3 text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">AI Material Compatibility</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Semantic matchmaking across chemical and particle standards.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Direct Company-to-Company Deals</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Send buy requests, negotiate pricing via chat, and finalize contracts.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Audited ESG Impact Reports</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Automated tracking of landfill tonnage diverted and CO₂ abated.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom testimonial/stat */}
          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
            <span>Verified Industrial Protocol</span>
            <span className="text-emerald-400 font-bold">50,000+ Tons Diverted</span>
          </div>
        </div>

        {/* Right Auth Forms Panel (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            
            {/* Top Switcher: Sign In vs Sign Up */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 transition-all ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4 text-emerald-600" />
                <span>Sign In to Company</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(''); }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 transition-all ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Create Company Account</span>
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
                {error}
              </div>
            )}

            {authMode === 'login' ? (
              /* ================= SIGN IN FORM ================= */
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Welcome back</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sign in with your company credentials to manage listings and negotiate deals.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Corporate Email or Company Legal Name *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="sourcing@company.com or Titan Eco-Cement"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password (default for test accounts: password123) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Remember this company</span>
                    </label>
                    <span className="text-emerald-700 hover:underline cursor-pointer font-semibold">
                      Forgot credentials?
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <span>Signing In...</span>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center text-xs text-slate-500 pt-2">
                  Don't have a company account yet?{' '}
                  <button
                    onClick={() => { setAuthMode('signup'); setError(''); }}
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    Create Company Account
                  </button>
                </div>
              </div>
            ) : (
              /* ================= SIGN UP FORM ================= */
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Register Your Company</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Join verified industrial enterprises trading secondary raw materials.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3.5 mt-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company Legal Name *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. EcoPlast Recyclers Inc / Apex Metallurgy"
                        value={regData.name}
                        onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Corporate Official Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="procurement@company.com"
                          value={regData.email}
                          onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Account Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={regData.password}
                          onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Industry Sector
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <select
                          value={regData.industry}
                          onChange={(e) => setRegData({ ...regData, industry: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                        >
                          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Plant / Facility Location *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Detroit, MI or Columbus, OH"
                          value={regData.location}
                          onChange={(e) => setRegData({ ...regData, location: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Facility Overview & Materials (Optional)
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Describe what byproducts you generate (e.g. slag, dust, grain) or what raw materials you consume..."
                      value={regData.description}
                      onChange={(e) => setRegData({ ...regData, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <span>Creating Company Account...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Register & Enter Waste2Worth</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center text-xs text-slate-500 pt-1">
                  Already have an account?{' '}
                  <button
                    onClick={() => { setAuthMode('login'); setError(''); }}
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Accounts Drawer */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowDemoSelector(!showDemoSelector)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-between w-full"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Want a test drive? Select a 1-Click Demo Enterprise</span>
              </span>
              <span className="text-slate-400 text-[11px]">{showDemoSelector ? '▲ Close' : '▼ View (6)'}</span>
            </button>

            {showDemoSelector && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 animate-fade-in">
                {demoCompanies.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleDemoSelect(c)}
                    className="flex flex-col text-left p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-950 truncate">
                      {c.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{c.industry}</div>
                    <div className="text-[9px] text-emerald-700 font-semibold mt-1">1-Click Login →</div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
