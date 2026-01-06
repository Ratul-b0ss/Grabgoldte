
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Store: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
       <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-6 rounded-2xl border border-white/10 shadow-lg">
          <h2 className="text-xl font-black italic text-white mb-1">MY ASSETS</h2>
          <p className="text-xs text-gray-400">Manage your active gold contracts.</p>
      </div>
      
      {user.purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50 border-2 border-dashed border-white/10 rounded-2xl">
           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-600">
               <i className="ri-safe-2-line text-2xl"></i>
           </div>
           <p className="text-gray-400 font-bold">No Active Contracts</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {user.purchases.map((item, idx) => {
            const isCompleted = item.remainingDays <= 0 || item.status === 'Completed';
            const progress = ((item.days - item.remainingDays) / item.days) * 100;
            
            return (
              <div 
                key={idx} 
                className={`bg-[#1A1A22] p-5 rounded-2xl border ${isCompleted ? 'border-white/5 opacity-60' : 'border-yellow-500/20'} shadow-lg`}
              >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-white/10 text-gray-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                             <i className="ri-vip-diamond-fill"></i>
                         </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">{item.name}</h3>
                            <p className="text-xs text-green-400 font-mono mt-0.5">+৳{item.dailyIncome}/day</p>
                        </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${isCompleted ? 'bg-white/5 text-gray-500' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                        {isCompleted ? 'Expired' : 'Live'}
                    </span>
                </div>
                
                <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1.5 font-bold uppercase tracking-wider">
                        <span>Contract Duration</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
                        <div 
                            className={`h-full ${isCompleted ? 'bg-gray-600' : 'bg-gradient-to-r from-yellow-600 to-yellow-400'} shadow-[0_0_10px_rgba(255,215,0,0.3)]`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-mono">
                         <span>{item.days - item.remainingDays} Days</span>
                         <span>{item.days} Days Total</span>
                    </div>
                </div>

                {!isCompleted && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                         <span className="text-[10px] text-gray-500">Next Payout</span>
                         <span className="text-xs font-mono text-white">{new Date(item.lastRoiDate + 86400000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Store;
