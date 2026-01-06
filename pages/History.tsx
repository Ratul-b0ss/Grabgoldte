
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SubHeader } from '../components/Layout';

const History: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-color)]">
       <SubHeader title="My History" />

      <div className="pt-20 px-4 space-y-4 pb-24 animate-fade-in">
        {user.transactions.length === 0 ? (
           <div className="flex flex-col items-center justify-center mt-20 opacity-50">
               <i className="ri-file-list-3-line text-6xl text-[var(--secondary-text)] mb-4"></i>
               <p className="text-[var(--secondary-text)]">No transactions found.</p>
           </div>
        ) : (
          user.transactions.map((tx) => (
            <div key={tx.id} className="bg-[var(--card-color)] p-4 rounded-xl shadow-sm border border-[var(--border-color)] relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-opacity-10 ${
                        tx.type === 'deposit' || tx.type === 'commission' || tx.type === 'daily_income' 
                        ? 'bg-green-500 text-green-500' 
                        : 'bg-red-500 text-red-500'
                    }`}>
                        <i className={`ri-${
                            tx.type === 'deposit' ? 'add-circle-line' :
                            tx.type === 'withdrawal' ? 'arrow-right-up-line' :
                            tx.type === 'purchase' ? 'shopping-bag-3-line' : 'gift-line'
                        } text-xl`}></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-[var(--text-color)] text-sm capitalize">{tx.description}</h4>
                        <small className="text-[var(--secondary-text)] text-[10px]">{tx.date} • {tx.id.slice(-6)}</small>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${
                    tx.type === 'deposit' || tx.type === 'commission' || tx.type === 'daily_income' 
                    ? 'text-green-500' 
                    : 'text-[var(--text-color)]'
                  }`}>
                    {tx.type === 'purchase' || tx.type === 'withdrawal' ? '-' : '+'}৳{tx.amount.toFixed(2)}
                  </div>
              </div>
              
              {/* Status Badge */}
              {tx.status && (
                <div className="flex justify-end">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        tx.status === 'Success' ? 'bg-green-500/20 text-green-500' :
                        tx.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-red-500/20 text-red-500'
                    }`}>
                        {tx.status}
                    </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
