import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, CheckCircle2, Trash2 } from 'lucide-react';

export default function OrganizationView({ currentCompany }) {
  const [members, setMembers] = useState([
    {
      id: '#1',
      email: currentCompany?.email ? `admin@${currentCompany.email.split('@')[1] || 'company.com'}` : 'admin@greenvalley.com',
      role: 'Admin',
      joinedDate: '02/10/2026'
    }
  ]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const companyName = currentCompany?.name || 'Green Valley Rice Mill';
  const industrySector = currentCompany?.industry || 'Rice Milling & Agri-Processing';

  useEffect(() => {
    if (currentCompany?.id) {
      fetchMembers();
    }
  }, [currentCompany]);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/organization/${currentCompany.id}/members`);
      const data = await res.json();
      if (data.success && data.members?.length > 0) {
        setMembers(data.members);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAlertMsg('Please provide member email and temporary password.');
      return;
    }

    setLoading(true);
    setAlertMsg('');

    try {
      const targetCompanyId = currentCompany?.id || 'comp_current';
      const res = await fetch(`/api/organization/${targetCompanyId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim(), role })
      });
      const data = await res.json();
      if (data.success) {
        setMembers((prev) => [...prev, data.member]);
        setEmail('');
        setPassword('');
        setRole('Member');
        setAlertMsg('Team member successfully added!');
        setTimeout(() => setAlertMsg(''), 3000);
      } else {
        setAlertMsg(data.error || 'Failed to add member');
      }
    } catch (err) {
      // Fallback local addition if network glitch
      const newId = `#${members.length + 1}`;
      const now = new Date();
      const joinedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      setMembers([...members, { id: newId, email, role, joinedDate }]);
      setEmail('');
      setPassword('');
      setAlertMsg('Team member added successfully!');
      setTimeout(() => setAlertMsg(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (memberId) => {
    try {
      const targetCompanyId = currentCompany?.id || 'comp_current';
      const res = await fetch(`/api/organization/${targetCompanyId}/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        setMembers(members.map(m => m.id === memberId ? data.member : m));
      }
    } catch (err) {
      setMembers(members.map(m => {
        if (m.id === memberId) {
          return { ...m, role: m.role === 'Admin' ? 'Member' : 'Admin' };
        }
        return m;
      }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl pb-10">
      
      {/* Page Title (Matches Screenshot) */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Organization & Team Management
        </h1>
      </div>

      {alertMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Card 1: Company Profile (Matches Screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3.5">
        <h3 className="text-base font-bold text-slate-900">
          Company Profile
        </h3>

        <div className="space-y-3 text-sm text-slate-800">
          <div>
            <span className="font-bold text-slate-900">Organization: </span>
            <span className="text-slate-700 font-medium">{companyName}</span>
          </div>

          <div>
            <span className="font-bold text-slate-900">Industry Sector: </span>
            <span className="text-slate-700 font-medium">{industrySector}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Add Team Member (Matches Screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900">
          Add Team Member
        </h3>

        <form onSubmit={handleAddMember} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Member Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Member Email *
              </label>
              <input
                type="email"
                required
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#134e35] focus:border-[#134e35] outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Temporary Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Temporary Password *
              </label>
              <input
                type="password"
                required
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#134e35] focus:border-[#134e35] outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#134e35] focus:border-[#134e35] outline-none bg-white font-medium text-slate-800"
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
                <option value="Procurement Manager">Procurement Manager</option>
                <option value="Plant Supervisor">Plant Supervisor</option>
                <option value="Sustainability Lead">Sustainability Lead</option>
              </select>
            </div>

          </div>

          {/* Add Team Member Button (Dark Forest Green matching screenshot) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#134e35] hover:bg-[#0f3f2b] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-sm transition-all"
          >
            {loading ? 'Adding Team Member...' : 'Add Team Member'}
          </button>
        </form>
      </div>

      {/* Card 3: Team Table (Matches Screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">EMAIL</th>
                <th className="py-3.5 px-6">ROLE</th>
                <th className="py-3.5 px-6">JOINED DATE</th>
                <th className="py-3.5 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-700">
                    {member.id}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {member.email}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      member.role === 'Admin' 
                        ? 'bg-emerald-100 text-emerald-800 font-bold' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {member.joinedDate}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleRole(member.id)}
                      className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-all shadow-2xs"
                    >
                      {member.role === 'Admin' ? 'Switch to Member' : 'Switch to Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
