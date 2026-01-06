
import React from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/home', icon: 'ri-home-5-line', activeIcon: 'ri-home-5-fill', label: 'Home' },
    { path: '/store', icon: 'ri-briefcase-4-line', activeIcon: 'ri-briefcase-4-fill', label: 'Invest' },
    { path: '/share', icon: 'ri-user-add-line', activeIcon: 'ri-user-add-fill', label: 'Team' },
    { path: '/me', icon: 'ri-user-smile-line', activeIcon: 'ri-user-smile-fill', label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <nav className="glass-panel rounded-2xl h-16 flex items-center justify-between px-6 shadow-2xl shadow-black/50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
              isActive(item.path) ? 'text-white -translate-y-2' : 'text-gray-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isActive(item.path) ? 'bg-gradient-gold text-black shadow-lg shadow-yellow-500/30' : ''
            }`}>
                 <i className={`${isActive(item.path) ? item.activeIcon : item.icon} text-xl`}></i>
            </div>
            {isActive(item.path) && (
                <span className="text-[10px] font-bold mt-1 text-gold-primary absolute -bottom-4">
                    {item.label}
                </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export const SubHeader: React.FC<{ title: string; backUrl?: string }> = ({ title, backUrl = '/me' }) => (
  <header className="fixed top-0 left-0 w-full glass-panel z-50 h-16 flex items-center justify-between px-4 border-b border-white/5">
    <Link to={backUrl} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors">
      <i className="ri-arrow-left-line text-xl"></i>
    </Link>
    <h1 className="text-lg font-bold tracking-wide">{title}</h1>
    <div className="w-10"></div>
  </header>
);

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[40%] bg-yellow-600/10 rounded-full blur-[100px]"></div>
      </div>

      <header className="fixed top-0 left-0 w-full z-50 px-4 py-3 flex justify-between items-center glass-panel border-none bg-opacity-0 backdrop-blur-md">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center text-black shadow-lg shadow-yellow-500/20">
                <i className="ri-vip-diamond-fill"></i>
            </div>
            <h1 className="text-xl font-black italic tracking-tighter text-white">
                GRAB<span className="text-yellow-400">GOLD</span>
            </h1>
        </div>
        <Link to="/news" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center relative">
            <i className="ri-notification-3-line text-white"></i>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
        </Link>
      </header>
      
      <main className="flex-grow pt-20 pb-28 px-4 z-10 overflow-y-auto scroll-smooth">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
