import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  X, 
  CheckCircle2, 
  UserPlus, 
  LogIn,
  FileText
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

export default function LoginModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  demoCompanies, 
  initialMode = 'register' 
}) {
  const [authMode, setAuthMode] = useState(initialMode); // 'register' or 'login'
  
  // Registration form
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    industry: 'Manufacturing & Heavy Industry',
    location: '',
    description: ''
  });

  // Login form
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  if (!isOpen) return null;

  // Handle Create Company Account
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
        onLogin(data.company);
        onClose();
      } else {
        setError(data.error || 'Failed to create account.');
      }
    } catch (err) {
      setError('Could not connect to server. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Login to Existing Account
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email.trim()) {
      setError('Please enter your company email or name.');
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
        onLogin(data.company);
        onClose();
      } else {
        setError(data.error || 'Failed to sign in.');
      }
    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (company) => {
    onLogin(company);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-6 h-6" />
              <h2 className="text-lg font-bold">
                {authMode === 'register' ? 'Create Your Company Account' : 'Sign In to Your Company'}
              </h2>
            </div>
            <p className="text-emerald-100 text-xs mt-0.5">
              Waste2Worth Industrial Symbiosis & Circular Economy Network
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Register vs Sign In */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(''); }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 border-b-2 transition-all ${
              authMode === 'register'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Company Account</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 border-b-2 transition-all ${
              authMode === 'login'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Existing Company</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
              {error}
            </div>
          )}

          {authMode === 'register' ? (
            /* CREATE COMPANY ACCOUNT FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company Legal Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. EcoPlast Recyclers Inc / Midwest BioProducts"
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
                      placeholder="sourcing@yourcompany.com"
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
                    Primary Industry Sector
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
                      placeholder="e.g. Detroit, MI or Houston, TX"
                      value={regData.location}
                      onChange={(e) => setRegData({ ...regData, location: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Facility Overview & Products (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Describe your manufacturing plant and what materials you produce or require..."
                  value={regData.description}
                  onChange={(e) => setRegData({ ...regData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Creating Company Account...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Register Company & Enter Platform</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* SIGN IN TO EXISTING ACCOUNT FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company Official Email or Legal Name *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="procurement@company.com or Apex Steel Mills"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password (default: password123)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Company Portal</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Accounts Drawer (Collapsible) */}
          <div className="pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowDemoSelector(!showDemoSelector)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-between w-full p-1"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Need to test quickly? Use 1-Click Demo Accounts</span>
              </span>
              <span className="text-slate-400 text-[11px]">{showDemoSelector ? '▲ Hide' : '▼ Show'}</span>
            </button>

            {showDemoSelector && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 animate-fade-in">
                {demoCompanies.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleDemoSelect(c)}
                    className="flex items-start text-left p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mr-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {c.name.slice(0, 2)}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-950 truncate">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{c.location}</div>
                    </div>
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
