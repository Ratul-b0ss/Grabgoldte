
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Product } from '../types';

const products: Product[] = [
  { id: 'P001', name: 'Sovereign Bullion', price: 10000, dailyIncome: 1000, days: 365 },
  { id: 'P002', name: 'Fractional Mint', price: 4000, dailyIncome: 400, days: 180 },
  { id: 'P003', name: 'Digital Reserve', price: 1500, dailyIncome: 150, days: 90 },
];

const Home: React.FC = () => {
  const { user, buyProduct, claimDailyBonus } = useAuth();
  const { showToast } = useToast();
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (user) {
        const today = new Date().toISOString().split('T')[0];
        if (user.lastDailyBonusDate !== today) {
            const timer = setTimeout(() => setShowBonusModal(true), 1500);
            return () => clearTimeout(timer);
        }
    }
  }, [user]);

  const handleBuy = async (product: Product) => {
    const result = await buyProduct(product);
    if (result.success) {
        showToast(result.message, 'success');
    } else {
        showToast(result.message, 'error');
    }
  };

  const handleClaimBonus = async () => {
    setIsClaiming(true);
    setTimeout(async () => {
        const result = await claimDailyBonus();
        setIsClaiming(false);
        if (result.success) {
            showToast(`Received ৳${result.amount}`, 'success');
            setShowBonusModal(false);
        } else {
            showToast(result.message, 'info');
            setShowBonusModal(false);
        }
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* --- PREMIUM DAILY BONUS MODAL --- */}
      {showBonusModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-fade-in">
            <div className="relative w-full max-w-sm rounded-3xl p-1 bg-gradient-to-b from-yellow-400 via-orange-500 to-transparent">
                <div className="bg-[#15151a] rounded-[22px] p-6 text-center relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-500/20 blur-[50px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.4)] animate-float">
                            <i className="ri-gift-2-fill text-4xl text-black drop-shadow-sm"></i>
                        </div>
                        
                        <h2 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-1">DAILY REWARD</h2>
                        <p className="text-gray-400 text-sm mb-6">Claim your free dividends now.</p>
                        
                        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10 backdrop-blur-sm">
                             <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600">৳25.00</div>
                             <span className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">Instant Credit</span>
                        </div>

                        <button 
                            onClick={handleClaimBonus}
                            disabled={isClaiming}
                            className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-[0_4px_20px_rgba(255,215,0,0.3)] hover:shadow-[0_4px_30px_rgba(255,215,0,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isClaiming ? 'Processing...' : (
                                <>Claim Bonus <i className="ri-arrow-right-line"></i></>
                            )}
                        </button>
                        
                        <button 
                            onClick={() => setShowBonusModal(false)}
                            className="mt-4 text-xs text-gray-500 hover:text-white transition-colors"
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-2xl group border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] to-[#16213e]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        {/* Animated Accent */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-500/20 rounded-full blur-[60px] animate-pulse"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center p-6 z-10">
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Verified</span>
                <span className="text-yellow-600/50 text-xs">●</span>
                <span className="text-gray-400 text-xs font-mono">24h Volume: High</span>
            </div>
            <h2 className="text-3xl font-black text-white italic leading-none mb-1">GOLD <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">FUTURES 2025</span></h2>
            <p className="text-sm text-gray-400 max-w-[200px] mt-2 leading-relaxed">Secure your portfolio with institutional-grade gold assets.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <i className="ri-bar-chart-fill text-yellow-500"></i> Market
            </h2>
            <span className="text-xs text-gray-500">Live Prices</span>
        </div>

        {products.map((pkg, idx) => (
          <div key={pkg.id} className="relative group">
            {/* Glow border on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-yellow-300 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            
            <div className="relative bg-[#1A1A22] rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner ${
                            idx === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-white' : 
                            'bg-[#252530] text-gray-400'
                        }`}>
                            <i className="ri-vip-diamond-fill"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-tight">{pkg.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 border border-white/5">{pkg.days} Days</span>
                                <span className="text-[10px] text-green-400 font-bold flex items-center gap-1"><i className="ri-arrow-up-fill"></i> 5.0% ROI</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-black/20 rounded-xl p-3 border border-white/5">
                     <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Daily</p>
                        <p className="text-base font-bold text-green-400">+৳{pkg.dailyIncome}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Price</p>
                        <p className="text-lg font-bold text-yellow-400">৳{pkg.price.toLocaleString()}</p>
                     </div>
                </div>

                <button
                    onClick={() => handleBuy(pkg)}
                    className="w-full py-3 rounded-lg font-bold text-black bg-white hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                    Start Investment
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
