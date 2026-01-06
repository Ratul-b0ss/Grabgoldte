
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SubHeader } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';

const Withdraw: React.FC = () => {
  const { withdraw, user } = useAuth();
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.bankDetails) {
        if(window.confirm("Bank account required. Add now?")) navigate('/bank-details');
        return;
    }
    const val = parseFloat(amount);
    if (val > 0) {
        if(val > (user?.balance || 0)) {
            showToast('Insufficient Funds', 'error');
            return;
        }
        withdraw(val);
        showToast('Request Submitted', 'info');
        navigate('/history');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SubHeader title="Withdraw Funds" />

      <div className="bg-[#1A1A22] p-6 rounded-2xl border border-white/10 text-center">
             <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Withdrawable Balance</h3>
             <p className="text-4xl font-black text-white">৳{user?.balance.toFixed(2)}</p>
      </div>

      <div className="bg-[#1A1A22] p-6 rounded-2xl border border-white/10">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2"><i className="ri-bank-card-fill text-blue-500"></i> Cash Out</h3>
            <form onSubmit={handleWithdraw} className="space-y-5">
                <div>
                    <label className="block text-gray-400 mb-2 text-xs font-bold uppercase">Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-400 font-bold">৳</span>
                        <input 
                            type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required 
                            className="w-full pl-8 p-3.5 rounded-xl input-premium font-bold text-lg focus:outline-none"
                        />
                    </div>
                </div>
                 <div>
                    <label className="block text-gray-400 mb-2 text-xs font-bold uppercase">Security PIN</label>
                    <input type="password" placeholder="••••••" required className="w-full p-3.5 rounded-xl input-premium focus:outline-none"/>
                </div>
                <button type="submit" className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-red-800 shadow-lg shadow-red-500/20 active:scale-95 transition-transform">Submit Request</button>
            </form>
      </div>
        
      <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-xl">
             <p className="text-xs text-yellow-500/80">
                <i className="ri-error-warning-fill mr-1"></i> Fee: 5%. Arrival time: 1-24 Hours.
             </p>
      </div>
    </div>
  );
};

export default Withdraw;
