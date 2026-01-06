
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Transaction } from '../types';
import { SubHeader } from '../components/Layout';

const Admin: React.FC = () => {
  const { user, fetchAllUsers, processWithdrawal } = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'users'>('withdrawals');

  // Hardcoded Admin Check - Updated to your number
  const isAdmin = user?.phoneNumber === "+8801789456123";

  useEffect(() => {
    if (isAdmin) {
        loadData();
    }
  }, [user]);

  const loadData = async () => {
    const users = await fetchAllUsers();
    setAllUsers(users);
  };

  const handleAction = async (targetPhone: string, txId: string, action: 'approve' | 'reject') => {
    await processWithdrawal(targetPhone, txId, action);
    await loadData(); // Refresh
  };

  if (!isAdmin) {
    return (
        <div className="min-h-screen flex items-center justify-center text-red-500 font-bold bg-black">
            ACCESS DENIED
        </div>
    );
  }

  // Flatten pending withdrawals
  const pendingWithdrawals = allUsers.flatMap(u => 
    u.transactions
        .filter(t => t.type === 'withdrawal' && t.status === 'Pending')
        .map(t => ({ ...t, userPhone: u.phoneNumber, bank: u.bankDetails }))
  );

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <SubHeader title="Admin Dashboard" backUrl="/me" />
      
      <div className="pt-20 px-4">
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-white/10 rounded-xl">
            <button 
                onClick={() => setActiveTab('withdrawals')}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'withdrawals' ? 'bg-yellow-500 text-black' : 'text-gray-400'}`}
            >
                Withdrawals ({pendingWithdrawals.length})
            </button>
            <button 
                onClick={() => setActiveTab('users')}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-yellow-500 text-black' : 'text-gray-400'}`}
            >
                Users ({allUsers.length})
            </button>
        </div>

        {/* Content */}
        {activeTab === 'withdrawals' ? (
            <div className="space-y-4">
                {pendingWithdrawals.length === 0 && <p className="text-gray-500 text-center mt-10">No pending requests.</p>}
                
                {pendingWithdrawals.map((tx) => (
                    <div key={tx.id} className="bg-[#1A1A22] p-4 rounded-xl border border-yellow-500/30">
                        <div className="flex justify-between items-start mb-2">
                             <div>
                                 <p className="font-bold text-lg text-yellow-400">৳{tx.amount}</p>
                                 <p className="text-xs text-gray-400">User: {tx.userPhone}</p>
                                 <p className="text-xs text-gray-400">{tx.date.split('T')[0]}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-[10px] uppercase font-bold text-gray-500">Bank Info</p>
                                 {tx.bank ? (
                                     <>
                                        <p className="text-xs">{tx.bank.bankName}</p>
                                        <p className="text-xs font-mono">{tx.bank.accountNumber}</p>
                                     </>
                                 ) : <p className="text-red-500 text-xs">No Bank Added</p>}
                             </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button 
                                onClick={() => handleAction(tx.userPhone, tx.id, 'reject')}
                                className="flex-1 py-2 bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg font-bold text-xs hover:bg-red-500/30"
                            >
                                REJECT (REFUND)
                            </button>
                            <button 
                                onClick={() => handleAction(tx.userPhone, tx.id, 'approve')}
                                className="flex-1 py-2 bg-green-500 text-black rounded-lg font-bold text-xs hover:bg-green-400"
                            >
                                APPROVE
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="space-y-3">
                {allUsers.map(u => (
                    <div key={u.phoneNumber} className="bg-[#1A1A22] p-3 rounded-lg border border-white/5 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-sm">{u.phoneNumber}</p>
                            <p className="text-[10px] text-gray-400">Ref: {u.referralCode} | Upline: {u.referrerPhoneNumber || 'None'}</p>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-green-400">৳{u.balance.toFixed(0)}</p>
                             <p className="text-[10px] text-gray-500">Deps: {u.transactions.filter(t=>t.type==='deposit').length}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
