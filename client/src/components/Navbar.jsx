import React from 'react';
import { 
  Sparkles, 
  Store, 
  Building2, 
  ArrowLeftRight, 
  History, 
  ChevronDown,
  ShieldCheck,
  Leaf,
  UserPlus,
  LogIn,
  LogOut
} from 'lucide-react';

export default function Navbar({ 
  currentCompany, 
  companies, 
  activeTab, 
  setActiveTab, 
  onSwitchCompany, 
  onOpenRegister,
  onOpenLogin,
  onLogout,
  pendingRequestsCount,
  matchCount
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('ai')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Leaf className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Waste<span className="text-emerald-600">2</span>Worth
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  B2B Symbiosis
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Open Circular Economy Exchange</p>
            </div>
          </div>

          {/* Navigation Links (Visible when logged in or browsing) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === 'ai'
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Matchmaker</span>
              {matchCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-xs bg-emerald-600 text-white font-bold rounded-full">
                  {matchCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4 text-slate-500" />
              <span>Marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('depot')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'depot'
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>Company Depot</span>
            </button>

            <button
              onClick={() => setActiveTab('deals')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === 'deals'
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-slate-500" />
              <span>Deals & Requests</span>
              {pendingRequestsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-xs bg-amber-500 text-white font-bold rounded-full animate-bounce">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>History & ESG</span>
            </button>
          </nav>

          {/* User / Company Selector */}
          <div className="flex items-center space-x-2.5">
            {currentCompany ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-xl text-left transition-all">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentCompany.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      {currentCompany.name}
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-slate-500 text-[11px] truncate max-w-[140px]">{currentCompany.location}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 hidden group-hover:block z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{currentCompany.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentCompany.email}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{currentCompany.industry}</div>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Accounts ({companies.length})
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto">
                    {companies.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => onSwitchCompany(c)}
                        className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          c.id === currentCompany.id ? 'bg-emerald-50 font-semibold text-emerald-900' : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-medium truncate">{c.name}</div>
                          <div className="text-[10px] text-slate-400">{c.location}</div>
                        </div>
                        {c.id === currentCompany.id && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 mt-2 pt-2 px-3 space-y-1">
                    <button
                      onClick={onOpenRegister}
                      className="w-full text-left px-3 py-1.5 text-xs text-emerald-700 font-semibold hover:bg-emerald-50 rounded-lg flex items-center gap-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Create Another Company Account</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-600 font-semibold hover:bg-red-50 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out of Company</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile navigation tab bar */}
      <div className="md:hidden flex overflow-x-auto py-2 px-4 border-t border-slate-100 gap-2 bg-slate-50">
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 ${
            activeTab === 'ai' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border'
          }`}
        >
          AI Match ({matchCount})
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 ${
            activeTab === 'marketplace' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border'
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('depot')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 ${
            activeTab === 'depot' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border'
          }`}
        >
          Depot
        </button>
        <button
          onClick={() => setActiveTab('deals')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 ${
            activeTab === 'deals' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border'
          }`}
        >
          Deals ({pendingRequestsCount})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 ${
            activeTab === 'history' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border'
          }`}
        >
          History & ESG
        </button>
      </div>
    </header>
  );
}
