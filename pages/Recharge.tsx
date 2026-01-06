
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SubHeader } from '../components/Layout';

const Recharge: React.FC = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bkash');
  const navigate = useNavigate();

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0) {
        navigate(`/payment?amount=${val}&method=${method}`);
    } else {
        alert("Please enter a valid amount");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SubHeader title="Deposit Funds" />

      <div className="bg-[#1A1A22] p-6 rounded-2xl border border-white/10 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
             <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Current Balance</h3>
             <p className="text-4xl font-black text-white">৳{user?.balance.toFixed(2)}</p>
      </div>

      <div className="bg-[#1A1A22] p-6 rounded-2xl border border-white/10">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2"><i className="ri-wallet-3-fill text-yellow-500"></i> Payment Details</h3>
            <form onSubmit={handleRecharge} className="space-y-5">
                <div>
                    <label className="block text-gray-400 mb-2 text-xs font-bold uppercase">Amount (BDT)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-400 font-bold">৳</span>
                        <input 
                            type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Min 500" required 
                            className="w-full pl-8 p-3.5 rounded-xl input-premium font-bold text-lg focus:outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 text-xs font-bold uppercase">Gateway</label>
                    <select 
                      value={method} 
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full p-3.5 rounded-xl input-premium focus:outline-none"
                    >
                        <option value="bkash">Bkash (Automated)</option>
                        <option value="nagad">Nagad (Automated)</option>
                    </select>
                </div>
                <button type="submit" className="w-full py-4 rounded-xl font-bold text-black btn-gold mt-2">Proceed to Payment</button>
            </form>
      </div>
        
      <p className="text-center text-[10px] text-gray-600 px-4">
            Secured by SSL. Funds credited instantly after verification.
      </p>
    </div>
  );
};

export default Recharge;
