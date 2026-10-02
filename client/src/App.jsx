import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CommonDashboardView from './components/CommonDashboardView';
import ExplorePublicListingsView from './components/ExplorePublicListingsView';
import AiMatchView from './components/AiMatchView';
import HistoryOverviewView from './components/HistoryOverviewView';
import WasteStreamsView from './components/WasteStreamsView';
import RequirementsView from './components/RequirementsView';
import MessagesDealsView from './components/MessagesDealsView';
import ImpactSavingsView from './components/ImpactSavingsView';
import OrganizationView from './components/OrganizationView';
import ProfileView from './components/ProfileView';

import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import CreateDealModal from './components/CreateDealModal';
import ChatModal from './components/ChatModal';
import EmailNotificationsModal from './components/EmailNotificationsModal';

import { 
  Menu, 
  Bell, 
  ShieldCheck, 
  ChevronDown
} from 'lucide-react';

export default function App() {
  const [currentCompany, setCurrentCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  
  // Active Section: 'home' (landing before login), 'auth' (login/signup),
  // or strictly the 10 requested platform sections:
  // 'common_dashboard', 'explore_public_listings', 'ai_matchmaker', 'history_overview',
  // 'waste_streams', 'requirements', 'messages', 'impact_savings', 'organization', 'profile'
  const [activeSection, setActiveSection] = useState('home');
  const [authPageMode, setAuthPageMode] = useState('login');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data states
  const [wasteListings, setWasteListings] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [aiMatches, setAiMatches] = useState({ buyerMatches: [], sellerMatches: [], topMatches: [] });
  const [deals, setDeals] = useState({ sentRequests: [], receivedRequests: [] });
  const [historyData, setHistoryData] = useState({ boughtFrom: [], soldTo: [], metrics: {} });
  const [notificationsList, setNotificationsList] = useState([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Modals
  const [dealModalState, setDealModalState] = useState({ isOpen: false, wasteListing: null, requirement: null });
  const [chatModalState, setChatModalState] = useState({ isOpen: false, deal: null });
  
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentCompany?.id) {
      loadCompanyScopedData(currentCompany.id);
    } else {
      setAiMatches({ buyerMatches: [], sellerMatches: [], topMatches: [] });
      setDeals({ sentRequests: [], receivedRequests: [] });
      setHistoryData({ boughtFrom: [], soldTo: [], metrics: {} });
    }
  }, [currentCompany]);

  const loadInitialData = async () => {
    try {
      const [compRes, wasteRes, reqRes] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/waste-listings'),
        fetch('/api/requirements')
      ]);

      const compData = await compRes.json();
      const wasteData = await wasteRes.json();
      const reqData = await reqRes.json();

      if (compData.success) {
        setCompanies(compData.companies);
        
        const savedComp = localStorage.getItem('waste2worth_company');
        if (savedComp) {
          try {
            const parsed = JSON.parse(savedComp);
            setCurrentCompany(parsed);
            setActiveSection('common_dashboard');
          } catch {
            setCurrentCompany(null);
            setActiveSection('home');
          }
        } else {
          // If no active session, start on the Home page before login!
          setCurrentCompany(null);
          setActiveSection('home');
        }
      }

      if (wasteData.success) setWasteListings(wasteData.listings);
      if (reqData.success) setRequirements(reqData.requirements);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const loadCompanyScopedData = async (companyId) => {
    setLoading(true);
    try {
      const [matchRes, dealRes, histRes, wasteRes, reqRes, notifRes] = await Promise.all([
        fetch(`/api/ai/matches/${companyId}`),
        fetch(`/api/deals/${companyId}`),
        fetch(`/api/history/${companyId}`),
        fetch('/api/waste-listings'),
        fetch('/api/requirements'),
        fetch(`/api/notifications/${companyId}`)
      ]);

      const matchData = await matchRes.json();
      const dealData = await dealRes.json();
      const histData = await histRes.json();
      const wasteData = await wasteRes.json();
      const reqData = await reqRes.json();
      const notifData = await notifRes.json();

      if (matchData.success) setAiMatches(matchData);
      if (dealData.success) setDeals(dealData);
      if (histData.success) setHistoryData(histData);
      if (wasteData.success) setWasteListings(wasteData.listings);
      if (reqData.success) setRequirements(reqData.requirements);
      if (notifData.success) setNotificationsList(notifData.notifications || []);
    } catch (err) {
      console.error('Failed to load company data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchCompany = (company) => {
    setCurrentCompany(company);
    localStorage.setItem('waste2worth_company', JSON.stringify(company));
    showNotification(`Switched view to ${company.name}`);
  };

  const handleAuthSuccess = (company) => {
    setCurrentCompany(company);
    localStorage.setItem('waste2worth_company', JSON.stringify(company));
    setCompanies((prev) => {
      const exists = prev.some(c => c.id === company.id);
      return exists ? prev : [...prev, company];
    });
    showNotification(`Welcome, ${company.name}!`);
    setActiveSection('common_dashboard');
  };

  const handleLogout = () => {
    setCurrentCompany(null);
    localStorage.removeItem('waste2worth_company');
    setActiveSection('home');
    showNotification('Signed out of company account.');
  };

  const handleNavigateToAuth = (mode) => {
    setAuthPageMode(mode);
    setActiveSection('auth');
  };

  // Add Waste Listing
  const handleAddWaste = async (formData) => {
    if (!currentCompany) {
      handleNavigateToAuth('signup');
      return;
    }
    try {
      const payload = {
        ...formData,
        companyId: currentCompany.id,
        companyName: currentCompany.name,
        companyEmail: currentCompany.email
      };
      const res = await fetch('/api/waste-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Waste byproduct listed successfully!');
        loadCompanyScopedData(currentCompany.id);
      }
    } catch (err) {
      showNotification('Error creating waste listing', 'error');
    }
  };

  // Add Requirement
  const handleAddRequirement = async (formData) => {
    if (!currentCompany) {
      handleNavigateToAuth('signup');
      return;
    }
    try {
      const payload = {
        ...formData,
        companyId: currentCompany.id,
        companyName: currentCompany.name,
        companyEmail: currentCompany.email
      };
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Raw material requirement posted!');
        loadCompanyScopedData(currentCompany.id);
      }
    } catch (err) {
      showNotification('Error posting requirement', 'error');
    }
  };

  // Delete Waste
  const handleDeleteWaste = async (id) => {
    if (!window.confirm('Remove this waste stream?')) return;
    try {
      await fetch(`/api/waste-listings/${id}`, { method: 'DELETE' });
      showNotification('Waste stream removed');
      loadCompanyScopedData(currentCompany.id);
    } catch (err) {
      showNotification('Failed to remove listing', 'error');
    }
  };

  // Delete Requirement
  const handleDeleteRequirement = async (id) => {
    if (!window.confirm('Remove this requirement?')) return;
    try {
      await fetch(`/api/requirements/${id}`, { method: 'DELETE' });
      showNotification('Requirement removed');
      loadCompanyScopedData(currentCompany.id);
    } catch (err) {
      showNotification('Failed to remove requirement', 'error');
    }
  };

  // Submit Deal Proposal
  const handleSubmitDeal = async (payload) => {
    if (!currentCompany) {
      handleNavigateToAuth('signup');
      return;
    }
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Buy proposal sent to ${payload.sellerCompanyName}!`);
        await loadCompanyScopedData(currentCompany.id);
        setActiveSection('messages');
        setChatModalState({ isOpen: true, deal: data.deal });
      }
    } catch (err) {
      showNotification('Failed to send deal request', 'error');
    }
  };

  // Update Deal Status (Automatic removal upon contract completion + Email Notifications)
  const handleUpdateDealStatus = async (dealId, status) => {
    try {
      const res = await fetch(`/api/deals/${dealId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        if (data.emailDispatch?.success) {
          showNotification(
            status === 'completed'
              ? `Contract finalized! Official emails dispatched to both ${data.emailDispatch.buyerEmail} & ${data.emailDispatch.sellerEmail}.`
              : `Contract accepted! Confirmation emails dispatched to both ${data.emailDispatch.buyerEmail} & ${data.emailDispatch.sellerEmail}.`,
            'success'
          );
        } else if (status === 'completed') {
          showNotification('Contract finalized! Stock automatically deducted & recorded to History.', 'success');
        } else {
          showNotification(`Deal status updated: ${status.toUpperCase()}`);
        }
        if (currentCompany) loadCompanyScopedData(currentCompany.id);
      }
    } catch (err) {
      showNotification('Failed to update deal status', 'error');
    }
  };

  const myWasteListings = wasteListings.filter(w => w.companyId === currentCompany?.id);
  const myRequirements = requirements.filter(r => r.companyId === currentCompany?.id);
  const pendingDealsCount = deals.receivedRequests.filter(d => d.status === 'pending').length;
  const matchCount = (aiMatches.buyerMatches?.length || 0) + (aiMatches.sellerMatches?.length || 0);

  // If Home Page (Landing before Login)
  if (activeSection === 'home') {
    return (
      <div className="min-h-screen bg-white flex flex-col selection:bg-emerald-500 selection:text-white">
        {notification && (
          <div className="fixed bottom-5 right-5 z-50 animate-bounce">
            <div className={`px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold text-white flex items-center space-x-2 ${
              notification.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
            }`}>
              <span>{notification.msg}</span>
            </div>
          </div>
        )}

        <HomePage
          onNavigateToLogin={() => handleNavigateToAuth('login')}
          onNavigateToSignup={() => handleNavigateToAuth('signup')}
          onExploreDemo={() => {
            if (companies.length > 0) {
              handleSwitchCompany(companies[0]);
            }
            setActiveSection('common_dashboard');
          }}
          demoCompanies={companies}
        />
      </div>
    );
  }

  // If Auth Page (Login / Sign Up)
  if (activeSection === 'auth') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
        {notification && (
          <div className="fixed bottom-5 right-5 z-50 animate-bounce">
            <div className={`px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold text-white flex items-center space-x-2 ${
              notification.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
            }`}>
              <span>{notification.msg}</span>
            </div>
          </div>
        )}

        <AuthPage
          initialMode={authPageMode}
          onLoginSuccess={handleAuthSuccess}
          demoCompanies={companies}
          onBackToHome={() => setActiveSection('home')}
          onBackToMarketplace={() => setActiveSection('home')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col selection:bg-emerald-500 selection:text-white font-sans antialiased">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div className={`px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold text-white flex items-center space-x-2 ${
            notification.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}>
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* 1. Left Sidebar matching screenshot layout & color */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        currentCompany={currentCompany}
        onLogout={handleLogout}
        pendingDealsCount={pendingDealsCount}
        matchCount={matchCount}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* 2. Main Content Container */}
      <div className="lg:pl-64 flex flex-col flex-1">
        
        {/* Top Header matching screenshot ("Industrial Symbiosis Platform" + Bell) */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 h-14 flex items-center justify-between px-6 sm:px-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs sm:text-sm font-medium text-slate-700 tracking-tight">
              Industrial Symbiosis Platform
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {currentCompany && (
              <div className="relative group hidden sm:block">
                <button className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                  <span className="font-semibold">{currentCompany.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1 hidden group-hover:block z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Test Company
                  </div>
                  {companies.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSwitchCompany(c)}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-50 ${
                        c.id === currentCompany.id ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      {c.id === currentCompany.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bell Notification Icon (Matches Screenshot Top Right) */}
            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="relative text-slate-700 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="Contract Email Notifications"
            >
              <Bell className="w-4 h-4" />
              {notificationsList.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse"></span>
              )}
            </button>
          </div>
        </header>

        {/* 3. Section Router - Strictly 10 user-requested sections */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          
          {/* 1. Common Dashboard */}
          {activeSection === 'common_dashboard' && (
            <CommonDashboardView
              onNavigateSection={setActiveSection}
              currentCompany={currentCompany}
            />
          )}

          {/* 2. Explore Public Listings */}
          {activeSection === 'explore_public_listings' && (
            <ExplorePublicListingsView
              currentCompany={currentCompany}
              wasteListings={wasteListings}
              requirements={requirements}
              onOpenCreateDealModal={(wasteListing, requirement) => {
                if (!currentCompany) {
                  handleNavigateToAuth('signup');
                  return;
                }
                setDealModalState({ isOpen: true, wasteListing, requirement });
              }}
              onNavigateSection={setActiveSection}
            />
          )}

          {/* 3. AI Matchmaker */}
          {activeSection === 'ai_matchmaker' && (
            <AiMatchView
              currentCompany={currentCompany}
              aiMatches={aiMatches}
              loading={loading}
              onRefresh={() => currentCompany && loadCompanyScopedData(currentCompany.id)}
              onOpenCreateDealModal={(wasteListing, requirement) => {
                setDealModalState({ isOpen: true, wasteListing, requirement });
              }}
              onNavigateToDepot={() => setActiveSection('requirements')}
            />
          )}

          {/* 4. History Overview */}
          {activeSection === 'history_overview' && (
            <HistoryOverviewView
              currentCompany={currentCompany}
              historyData={historyData}
              loading={loading}
            />
          )}

          {/* 5. Waste Streams & By-Products */}
          {activeSection === 'waste_streams' && (
            <WasteStreamsView
              currentCompany={currentCompany}
              myWasteListings={myWasteListings}
              onAddWaste={handleAddWaste}
              onDeleteWaste={handleDeleteWaste}
              onNavigateSection={setActiveSection}
            />
          )}

          {/* 6. Requirements */}
          {activeSection === 'requirements' && (
            <RequirementsView
              currentCompany={currentCompany}
              myRequirements={myRequirements}
              onAddRequirement={handleAddRequirement}
              onDeleteRequirement={handleDeleteRequirement}
              onNavigateSection={setActiveSection}
            />
          )}

          {/* 7. Messages */}
          {activeSection === 'messages' && (
            <MessagesDealsView
              currentCompany={currentCompany}
              deals={deals}
              onUpdateDealStatus={handleUpdateDealStatus}
              onOpenChat={(deal) => setChatModalState({ isOpen: true, deal })}
            />
          )}

          {/* 8. Impact & Savings */}
          {activeSection === 'impact_savings' && (
            <ImpactSavingsView
              currentCompany={currentCompany}
              historyData={historyData}
              loading={loading}
            />
          )}

          {/* 9. Organization */}
          {activeSection === 'organization' && (
            <OrganizationView
              currentCompany={currentCompany}
            />
          )}

          {/* 10. Profile */}
          {activeSection === 'profile' && (
            <ProfileView
              currentCompany={currentCompany}
              onLogout={handleLogout}
            />
          )}

        </main>

        {/* Global Modals */}
        <CreateDealModal
          isOpen={dealModalState.isOpen}
          onClose={() => setDealModalState({ isOpen: false, wasteListing: null, requirement: null })}
          wasteListing={dealModalState.wasteListing}
          requirement={dealModalState.requirement}
          currentCompany={currentCompany}
          onSubmitDeal={handleSubmitDeal}
        />

        <ChatModal
          isOpen={chatModalState.isOpen}
          onClose={() => setChatModalState({ isOpen: false, deal: null })}
          deal={chatModalState.deal}
          currentCompany={currentCompany}
          onUpdateDealStatus={handleUpdateDealStatus}
        />

        <EmailNotificationsModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          notifications={notificationsList}
          currentCompany={currentCompany}
        />

      </div>

    </div>
  );
}
