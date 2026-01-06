
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const Me: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Hardcoded Admin Check - Updated to your number
  const isAdmin = user?.phoneNumber === "+8801789456123";

  const handleInstall = async () => {
    const promptEvent = (window as any).deferredPrompt;
    if (promptEvent) {
        promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === 'accepted') showToast('App installed successfully.', 'success');
        (window as any).deferredPrompt = null;
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* VIP CARD */}
      <div className="relative w-full aspect-[1.8] rounded-2xl overflow-hidden shadow-2xl transform transition-all hover:scale-[1.02]">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] via-[#D4AF37] to-[#B8860B]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-multiply"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/20 blur-[60px] rounded-full"></div>
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-black/80">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-black tracking-tighter italic">GRAB<span className="text-white drop-shadow-md">GOLD</span></h2>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">Platinum Member</span>
                </div>
                <i className="ri-rfid-line text-3xl opacity-50"></i>
            </div>
            
            <div>
                <p className="text-sm font-medium opacity-70 mb-1">Total Balance</p>
                <p className="text-4xl font-black text-black tracking-tight drop-shadow-sm">৳{user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="flex justify-between items-end">
                <div className="text-xs font-mono font-bold opacity-80">
                    **** **** **** {user.phoneNumber.slice(-4)}
                </div>
                <div className="text-[10px] font-bold uppercase">EXP 12/28</div>
            </div>
        </div>
      </div>

      {/* ADMIN BUTTON */}
      {isAdmin && (
        <Link to="/admin" className="block w-full py-3 bg-red-600/20 border border-red-500 text-red-500 font-bold text-center rounded-xl animate-pulse">
            <i className="ri-admin-fill mr-2"></i> ADMIN PANEL ACCESS
        </Link>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/recharge" className="bg-[#1A1A22] border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:bg-[#252530] transition-colors">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <i className="ri-arrow-down-circle-fill text-xl"></i>
            </div>
            <div>
                <p className="text-white font-bold text-sm">Deposit</p>
                <p className="text-xs text-gray-500">Add Funds</p>
            </div>
        </Link>
        <Link to="/withdraw" className="bg-[#1A1A22] border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:bg-[#252530] transition-colors">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <i className="ri-arrow-up-circle-fill text-xl"></i>
            </div>
            <div>
                <p className="text-white font-bold text-sm">Withdraw</p>
                <p className="text-xs text-gray-500">Cash Out</p>
            </div>
        </Link>
      </div>

      {/* Dashboard Grid */}
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 pl-1">Dashboard</h3>
        <div className="grid grid-cols-3 gap-3">
             {[
                { to: '/store', icon: 'ri-pie-chart-2-fill', color: 'text-purple-400', label: 'Portfolio' },
                { to: '/history', icon: 'ri-file-list-3-fill', color: 'text-blue-400', label: 'History' },
                { to: '/share', icon: 'ri-team-fill', color: 'text-yellow-400', label: 'Team' },
                { to: '/bank-details', icon: 'ri-bank-card-fill', color: 'text-pink-400', label: 'Bank' },
                { to: '/customer-care', icon: 'ri-headphone-fill', color: 'text-green-400', label: 'Support' },
                { to: '/settings', icon: 'ri-settings-4-fill', color: 'text-gray-400', label: 'Settings' },
             ].map((item, i) => (
                 <Link key={i} to={item.to} className="bg-[#1A1A22] border border-white/5 rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 hover:bg-[#252530] hover:border-white/10 transition-all">
                     <i className={`${item.icon} ${item.color} text-2xl`}></i>
                     <span className="text-[11px] font-medium text-gray-300">{item.label}</span>
                 </Link>
             ))}
        </div>
      </div>

      {/* App Install & Logout */}
      <div className="pt-2 space-y-3">
        {(window as any).deferredPrompt && (
            <button onClick={handleInstall} className="w-full py-3 bg-blue-600/10 text-blue-400 text-sm font-bold rounded-xl border border-blue-600/20 hover:bg-blue-600/20 transition-colors">
                <i className="ri-download-cloud-2-line mr-2"></i> Install Application
            </button>
        )}
        <button onClick={() => { logout(); navigate('/'); }} className="w-full py-3 text-red-500/80 text-sm font-bold hover:text-red-500 transition-colors">
            Sign Out
        </button>
      </div>

      <div className="text-center pb-6">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">Secured by 256-bit Encryption</p>
      </div>
    </div>
  );
};

export default Me;
