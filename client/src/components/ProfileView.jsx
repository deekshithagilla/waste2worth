import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Mail, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Calendar, 
  Lock, 
  LogOut,
  CheckCircle2,
  Save
} from 'lucide-react';

export default function ProfileView({ 
  currentCompany, 
  onLogout 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentCompany?.name || '',
    email: currentCompany?.email || '',
    industry: currentCompany?.industry || '',
    location: currentCompany?.location || '',
    description: currentCompany?.description || ''
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900">Company Profile</h1>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Manage your manufacturing facility's credentials, address, and circular network status.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        
        {/* Profile Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-2xl shadow-md">
              {currentCompany?.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">{currentCompany?.name}</h2>
                <span className="flex items-center space-x-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified Industrial Facility</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentCompany?.email}</p>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {currentCompany?.location}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {currentCompany?.industry}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Details Form / Display */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Official Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Industry Sector</label>
                <input
                  type="text"
                  value={profileData.industry}
                  onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plant Location / City</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Facility Operations & Overview</label>
              <textarea
                rows="3"
                value={profileData.description}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Entity ID</span>
                <p className="font-mono font-bold text-slate-800 mt-0.5">{currentCompany?.id}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Industry Sector</span>
                <p className="font-bold text-slate-800 mt-0.5">{currentCompany?.industry}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Facility Location</span>
                <p className="font-bold text-slate-800 mt-0.5">{currentCompany?.location}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Facility Overview</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {currentCompany?.description || 'Active manufacturing enterprise participating in the circular economy network.'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Circular Protocol Status</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-emerald-800">Operational & Matchmaker Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
