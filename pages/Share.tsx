
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Share: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const referralLink = `${window.location.origin}/#/login?ref=${user.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('Link copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Hero Invite Section */}
      <div className="rounded-xl overflow-hidden bg-[var(--primary-color)] p-6 text-white shadow-md text-center">
          <h2 className="text-xl font-bold mb-2">Partner Program</h2>
          <p className="text-gray-300 text-sm mb-6 max-w-xs mx-auto">Expand your network and earn commissions up to 17% on team investments.</p>
          
          <div className="bg-white/10 rounded-lg p-2 flex items-center border border-white/10 mb-4">
              <div className="flex-grow px-2 text-xs font-mono text-gray-300 truncate">
                  {referralLink}
              </div>
              <button 
                onClick={copyToClipboard}
                className="bg-white text-[var(--primary-color)] font-bold py-1.5 px-3 rounded text-xs hover:bg-gray-100 transition-colors"
              >
                {copied ? 'COPIED' : 'COPY'}
              </button>
          </div>
          
          <div className="text-xs text-gray-400">
              Referral Code: <span className="font-mono text-white ml-1">{user.referralCode}</span>
          </div>
      </div>

      {/* Team Stats */}
      <div>
        <h3 className="text-[var(--text-color)] font-bold text-base mb-3">Network Overview</h3>
        <div className="grid grid-cols-3 gap-3">
            {[
                { lvl: 'Level 1', count: user.team.l1.length, label: 'Direct' },
                { lvl: 'Level 2', count: user.team.l2.length, label: 'Secondary' },
                { lvl: 'Level 3', count: user.team.l3.length, label: 'Tertiary' }
            ].map((stat, idx) => (
                <div key={idx} className="bg-[var(--card-color)] p-4 rounded-xl border border-[var(--border-color)] text-center">
                    <span className="block text-2xl font-bold text-[var(--text-color)]">{stat.count}</span>
                    <span className="text-[10px] uppercase font-semibold text-[var(--secondary-text)]">{stat.label}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Rewards Info */}
      <div className="bg-[var(--card-color)] p-5 rounded-xl border border-[var(--border-color)]">
        <h3 className="text-[var(--text-color)] font-bold text-base mb-4">Commission Structure</h3>
        
        <div className="space-y-0 divide-y divide-[var(--border-color)]">
            {[
                { lvl: 'Level 1', rate: '10%', desc: 'Direct referral commission' },
                { lvl: 'Level 2', rate: '5%', desc: 'Indirect commission' },
                { lvl: 'Level 3', rate: '2%', desc: 'Extended network commission' },
            ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                    <div>
                        <p className="font-semibold text-[var(--text-color)] text-sm">{item.lvl}</p>
                        <p className="text-[10px] text-[var(--secondary-text)]">{item.desc}</p>
                    </div>
                    <span className="text-lg font-bold text-[var(--accent-color)]">{item.rate}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Share;
