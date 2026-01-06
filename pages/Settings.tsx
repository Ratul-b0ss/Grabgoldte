import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SubHeader } from '../components/Layout';

const Settings: React.FC = () => {
  const { changePassword } = useAuth();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  
  const handlePassChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    const result = await changePassword(oldPass, newPass);
    alert(result.message);
    if (result.success) {
        setOldPass('');
        setNewPass('');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] pb-10">
      <SubHeader title="Security & Settings" />

      <div className="pt-20 px-4 space-y-6 animate-fade-in">
        
        <div className="bg-[var(--card-color)] rounded-2xl shadow-lg border border-[var(--border-color)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--input-bg)]">
                <h3 className="text-[var(--accent-color)] font-bold">General</h3>
            </div>
            <div className="p-0">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-3">
                        <i className="ri-notification-3-line text-[var(--text-color)] text-xl"></i>
                        <span className="text-[var(--text-color)] text-sm">Notifications</span>
                    </div>
                    <div className="w-10 h-6 bg-[var(--accent-color)] rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                    </div>
                </div>
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <i className="ri-global-line text-[var(--text-color)] text-xl"></i>
                        <span className="text-[var(--text-color)] text-sm">Language</span>
                    </div>
                    <span className="text-xs text-[var(--secondary-text)] flex items-center">English <i className="ri-arrow-right-s-line ml-1"></i></span>
                </div>
            </div>
        </div>

        <div className="bg-[var(--card-color)] rounded-2xl shadow-lg border border-[var(--border-color)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--input-bg)]">
                <h3 className="text-[var(--accent-color)] font-bold">Security</h3>
            </div>
            <div className="p-6">
                <h4 className="text-[var(--text-color)] text-sm font-bold mb-4">Change Password</h4>
                <form onSubmit={handlePassChange} className="space-y-4">
                    <input 
                        type="password" 
                        value={oldPass}
                        onChange={e => setOldPass(e.target.value)}
                        placeholder="Current Password" 
                        className="w-full p-3 rounded-xl bg-[var(--bg-color)] text-[var(--text-color)] border border-[var(--border-color)] text-sm focus:border-[var(--accent-color)] outline-none"
                    />
                    <input 
                        type="password" 
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                        placeholder="New Password (min 6 chars)" 
                        className="w-full p-3 rounded-xl bg-[var(--bg-color)] text-[var(--text-color)] border border-[var(--border-color)] text-sm focus:border-[var(--accent-color)] outline-none"
                    />
                    <button type="submit" className="w-full py-3 rounded-xl font-bold text-white btn-gradient text-sm active:scale-95 transition-transform">Update Password</button>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;