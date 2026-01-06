import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SubHeader } from '../components/Layout';

const BankDetails: React.FC = () => {
  const { user, updateBankDetails } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bankName: user?.bankDetails?.bankName || '',
    accountName: user?.bankDetails?.accountName || '',
    accountNumber: user?.bankDetails?.accountNumber || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBankDetails(formData);
    alert('Bank details updated successfully!');
    navigate('/me');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] pb-10">
      <SubHeader title="Bank Details" />

      <div className="pt-20 px-4 space-y-6 animate-fade-in">
        <div className="bg-[var(--card-color)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
             <div className="flex justify-between items-center mb-4 border-b border-[var(--border-color)] pb-2">
                 <h3 className="text-[var(--accent-color)] text-lg font-bold">Linked Account</h3>
                 <span className={`text-xs px-2 py-1 rounded-md font-bold ${user?.bankDetails ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                     {user?.bankDetails ? 'VERIFIED' : 'NOT LINKED'}
                 </span>
             </div>
             {user?.bankDetails ? (
                 <div className="space-y-2 text-sm">
                     <p className="flex justify-between"><span className="text-[var(--secondary-text)]">Bank:</span> <span className="text-[var(--text-color)] font-medium">{user.bankDetails.bankName}</span></p>
                     <p className="flex justify-between"><span className="text-[var(--secondary-text)]">Holder:</span> <span className="text-[var(--text-color)] font-medium">{user.bankDetails.accountName}</span></p>
                     <p className="flex justify-between"><span className="text-[var(--secondary-text)]">No:</span> <span className="text-[var(--text-color)] font-medium font-mono tracking-wider">**** {user.bankDetails.accountNumber.slice(-4)}</span></p>
                 </div>
             ) : (
                 <p className="text-[var(--secondary-text)] text-sm text-center py-2">No bank account linked yet.</p>
             )}
        </div>

        <div className="bg-[var(--card-color)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
            <h3 className="text-[var(--text-color)] font-bold mb-6">Update Information</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-[var(--secondary-text)] mb-1 text-sm">Bank Name</label>
                    <input type="text" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} placeholder="e.g. Chase Bank" required className="w-full p-3.5 rounded-xl bg-[var(--input-bg)] text-[var(--text-color)] placeholder-[var(--secondary-text)] border border-[var(--border-color)] focus:border-[var(--accent-color)] outline-none"/>
                </div>
                <div>
                    <label className="block text-[var(--secondary-text)] mb-1 text-sm">Account Holder Name</label>
                    <input type="text" value={formData.accountName} onChange={e => setFormData({...formData, accountName: e.target.value})} placeholder="Full Legal Name" required className="w-full p-3.5 rounded-xl bg-[var(--input-bg)] text-[var(--text-color)] placeholder-[var(--secondary-text)] border border-[var(--border-color)] focus:border-[var(--accent-color)] outline-none"/>
                </div>
                <div>
                    <label className="block text-[var(--secondary-text)] mb-1 text-sm">Account Number / IBAN</label>
                    <input type="text" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} placeholder="Account Number" required className="w-full p-3.5 rounded-xl bg-[var(--input-bg)] text-[var(--text-color)] placeholder-[var(--secondary-text)] border border-[var(--border-color)] focus:border-[var(--accent-color)] outline-none"/>
                </div>
                <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white btn-gradient mt-2 shadow-lg active:scale-95 transition-transform">Save Details</button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;