import React from 'react';
import { SubHeader } from '../components/Layout';

const CustomerCare: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] pb-10">
      <SubHeader title="Customer Care" />

      <div className="pt-20 px-4 space-y-6 animate-fade-in">
        <div className="bg-[var(--card-color)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
            <h3 className="text-[var(--accent-color)] text-lg font-bold mb-4 border-b border-[var(--border-color)] pb-2">Official Channels</h3>
            
            <a href="https://t.me/" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-[var(--input-bg)] mb-3 hover:bg-[var(--hover-color)] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <i className="ri-telegram-fill"></i>
                </div>
                <div className="flex-grow">
                    <h4 className="font-bold text-[var(--text-color)]">Telegram Support</h4>
                    <p className="text-xs text-[var(--secondary-text)]">24/7 Live Chat</p>
                </div>
                <i className="ri-arrow-right-s-line text-[var(--secondary-text)]"></i>
            </a>

            <a href="mailto:support@grabgold.com" className="flex items-center gap-4 p-4 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--hover-color)] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <i className="ri-mail-send-fill"></i>
                </div>
                <div className="flex-grow">
                    <h4 className="font-bold text-[var(--text-color)]">Email Support</h4>
                    <p className="text-xs text-[var(--secondary-text)]">Response within 24h</p>
                </div>
                <i className="ri-arrow-right-s-line text-[var(--secondary-text)]"></i>
            </a>
        </div>
        
        <div className="bg-[var(--card-color)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
            <h3 className="text-[var(--text-color)] font-bold mb-4">FAQ</h3>
            <div className="space-y-4">
                <div className="border-b border-[var(--border-color)] pb-3">
                    <p className="font-bold text-[var(--text-color)] text-sm mb-1">How long does withdrawal take?</p>
                    <p className="text-xs text-[var(--secondary-text)]">Withdrawals are processed within 1-24 hours depending on the method.</p>
                </div>
                <div className="border-b border-[var(--border-color)] pb-3">
                    <p className="font-bold text-[var(--text-color)] text-sm mb-1">Is my investment safe?</p>
                    <p className="text-xs text-[var(--secondary-text)]">Yes, we use advanced encryption and cold storage for digital assets.</p>
                </div>
                <div>
                    <p className="font-bold text-[var(--text-color)] text-sm mb-1">Can I have multiple accounts?</p>
                    <p className="text-xs text-[var(--secondary-text)]">No, multiple accounts are strictly prohibited and may lead to a ban.</p>
                </div>
            </div>
        </div>

        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center">
            <p className="text-xs text-red-400">
                <i className="ri-shield-check-fill mr-1"></i> Never share your password or OTP with anyone, including support staff.
            </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerCare;