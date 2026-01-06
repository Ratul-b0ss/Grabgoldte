
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const PaymentGateway: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { recharge } = useAuth();

  const amount = parseFloat(searchParams.get('amount') || '0');
  const method = searchParams.get('method') || 'bkash';

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);

  const themeColor = method === 'bkash' ? '#E2136E' : '#EC1D25';
  const logoText = method === 'bkash' ? 'bKash' : 'Nagad';

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate server processing time
    setTimeout(async () => {
      try {
        await recharge(amount);
        showToast(`Success! ৳${amount} has been added to your wallet.`, 'success');
        navigate('/me');
      } catch (err) {
        showToast(`Payment failed. Please try again.`, 'error');
      } finally {
        setProcessing(false);
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="h-20 flex items-center justify-center" style={{ backgroundColor: themeColor }}>
            <h1 className="text-white text-2xl font-bold italic tracking-wider">{logoText}</h1>
        </div>
        <div className="p-8">
            <div className="text-center mb-6">
                <p className="text-gray-500 text-sm">SECURE CHECKOUT</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-1">৳ {amount.toFixed(2)}</h2>
            </div>

            {processing ? (
                <div className="flex flex-col items-center py-10 text-center">
                    <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: `${themeColor} transparent transparent transparent` }}></div>
                    <p className="text-gray-600 font-bold">Communicating with {logoText} API...</p>
                    <p className="text-[10px] text-gray-400 mt-2 italic">Encryption active (SSL/TLS 1.3)</p>
                </div>
            ) : (
                <form onSubmit={handleConfirm} className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400">Merchant Wallet</label>
                        <input 
                            type="tel" required placeholder="017XXXXXXXX" 
                            value={phone} onChange={e => setPhone(e.target.value)}
                            className="w-full p-3 border-b-2 outline-none text-lg font-mono bg-gray-50 focus:bg-white transition-colors"
                            style={{ borderColor: themeColor }}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400">Security PIN</label>
                        <input 
                            type="password" required placeholder="•••••" maxLength={5}
                            value={pin} onChange={e => setPin(e.target.value)}
                            className="w-full p-3 border-b-2 outline-none text-lg font-mono bg-gray-50 focus:bg-white transition-colors"
                            style={{ borderColor: themeColor }}
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => navigate('/recharge')} className="flex-1 py-3 text-gray-400 font-bold hover:text-gray-600">Cancel</button>
                        <button type="submit" className="flex-1 py-3 rounded text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all" style={{ backgroundColor: themeColor }}>Confirm Pay</button>
                    </div>
                </form>
            )}
            
            <div className="mt-8 flex justify-center items-center gap-2 opacity-30 grayscale">
                <i className="ri-shield-check-line text-xl"></i>
                <span className="text-[10px] font-bold">PCI DSS COMPLIANT</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
