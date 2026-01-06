
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [localNumber, setLocalNumber] = useState('');
  const [password, setPassword] = useState('');
  const [referrer, setReferrer] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferrer(ref);
      setIsLogin(false);
    }
  }, [searchParams]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('0')) val = val.substring(1);
    if (val.length > 10) return;
    setLocalNumber(val);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^1[3-9]\d{8}$/.test(localNumber)) {
        setError('Invalid BD Number.');
        return;
    }

    setIsVerifying(true);

    setTimeout(async () => {
        const fullPhoneNumber = `+880${localNumber}`;
        let success = false;
        let msg = '';

        if (isLogin) {
            success = await login(fullPhoneNumber, password);
            if (!success) msg = 'Invalid Credentials';
        } else {
            success = await signup(fullPhoneNumber, password, referrer);
            if (!success) msg = 'User already exists';
        }

        setIsVerifying(false);

        if (success) {
            navigate('/home');
        } else {
            setError(msg);
        }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[60%] bg-yellow-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-700 text-black flex items-center justify-center rounded-2xl mx-auto mb-6 text-3xl shadow-[0_0_40px_rgba(255,215,0,0.3)] rotate-3 hover:rotate-6 transition-transform">
                <i className="ri-vip-diamond-fill"></i>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter mb-2">GRAB<span className="text-yellow-400">GOLD</span></h1>
            <p className="text-gray-400 text-sm tracking-wide">PREMIUM DIGITAL ASSETS</p>
        </div>
        
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
            {error && <div className="mb-6 p-3 bg-red-500/20 text-red-400 text-sm font-bold text-center rounded-lg border border-red-500/20 animate-pulse">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mobile Number</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-3 border-r border-white/10 bg-white/5 rounded-l-xl text-gray-400">
                        <span className="text-sm font-bold">+880</span>
                    </div>
                    <input
                        type="tel"
                        required
                        disabled={isVerifying}
                        className="w-full pl-24 p-4 rounded-xl input-premium font-bold tracking-wider focus:outline-none"
                        value={localNumber}
                        onChange={handleNumberChange}
                        placeholder="17xxxxxxxx"
                    />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                <input
                type="password"
                required
                disabled={isVerifying}
                className="w-full p-4 mt-1 rounded-xl input-premium focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                />
            </div>
            
            {!isLogin && (
                <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Referral Code</label>
                <input
                    type="text"
                    disabled={isVerifying}
                    className="w-full p-4 mt-1 rounded-xl input-premium text-center uppercase tracking-[0.3em] focus:outline-none text-yellow-400 font-bold"
                    value={referrer}
                    onChange={(e) => setReferrer(e.target.value.toUpperCase())}
                    placeholder="OPTIONAL"
                    maxLength={6}
                />
                </div>
            )}

            <button
                type="submit"
                disabled={isVerifying}
                className={`w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-[0_5px_20px_rgba(255,215,0,0.3)] hover:shadow-[0_8px_30px_rgba(255,215,0,0.4)] transition-all ${isVerifying ? 'opacity-70 cursor-wait' : 'hover:-translate-y-1'}`}
            >
                {isVerifying ? (
                    <span className="flex items-center justify-center gap-2">
                        <i className="ri-loader-4-line animate-spin text-xl"></i> Verifying...
                    </span>
                ) : (isLogin ? 'ACCESS PORTFOLIO' : 'CREATE ACCOUNT')}
            </button>
            </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          {isLogin ? "New user? " : "Already a member? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            disabled={isVerifying}
            className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors"
          >
            {isLogin ? 'Apply for Access' : 'Login Here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
