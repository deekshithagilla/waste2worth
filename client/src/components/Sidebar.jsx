import React from 'react';
import { 
  BarChart2,
  Compass,
  Sparkles,
  History,
  Recycle, 
  Layers, 
  MessageSquare, 
  Leaf, 
  ShieldCheck, 
  User, 
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeSection, 
  setActiveSection, 
  currentCompany, 
  onLogout,
  pendingDealsCount,
  matchCount,
  isMobileOpen,
  setIsMobileOpen
}) {
  // ONLY the 10 exact sections requested by the user from top left to bottom left
  const menuItems = [
    {
      id: 'common_dashboard',
      label: 'Common Dashboard',
      icon: BarChart2
    },
    {
      id: 'explore_public_listings',
      label: 'Explore Public Listings',
      icon: Compass
    },
    {
      id: 'ai_matchmaker',
      label: 'AI Matchmaker',
      icon: Sparkles,
      badgeCount: matchCount
    },
    {
      id: 'history_overview',
      label: 'History Overview',
      icon: History
    },
    {
      id: 'waste_streams',
      label: 'Waste Streams & By-Products',
      icon: Recycle
    },
    {
      id: 'requirements',
      label: 'Requirements',
      icon: Layers
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      badgeCount: pendingDealsCount
    },
    {
      id: 'impact_savings',
      label: 'Impact & Savings',
      icon: Leaf
    },
    {
      id: 'organization',
      label: 'Organization',
      icon: ShieldCheck
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User
    }
  ];

  const handleSelect = (id) => {
    setActiveSection(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container (Styled like the uploaded screenshot) */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white text-slate-700 flex flex-col justify-between border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Logo Header: Gold Waste, Dark Green 2Worth */}
          <div className="p-5 flex items-center justify-between shrink-0">
            <div 
              className="flex items-center space-x-2.5 cursor-pointer" 
              onClick={() => handleSelect('common_dashboard')}
            >
              <div className="w-6 h-6 flex items-center justify-center text-amber-500">
                <span className="text-xl leading-none">🌱</span>
              </div>
              <div className="flex items-center text-xl font-black tracking-tight">
                <span className="text-amber-500 font-extrabold mr-1">Waste</span>
                <span className="text-[#134e35] font-black">2Worth</span>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* EXACT 10 Navigation Items from top to bottom line by line */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#134e35] text-white font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badgeCount > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Left: Log Out button matching screenshot */}
          <div className="p-4 border-t border-slate-100 shrink-0">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 rounded text-xs font-semibold text-slate-700 transition-colors flex items-center space-x-1.5 shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-600" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}
