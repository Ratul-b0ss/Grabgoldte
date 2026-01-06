import React from 'react';
import { SubHeader } from '../components/Layout';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] pb-10">
      <SubHeader title="About Grab" />

      <div className="pt-20 px-4 space-y-6 animate-fade-in">
        <div className="bg-[var(--card-color)] p-8 rounded-2xl shadow-lg border border-[var(--border-color)] text-center">
            <h1 className="text-3xl font-black italic text-gradient mb-2">Grab Gold</h1>
            <p className="text-[var(--secondary-text)] text-sm">Empowering Digital Wealth</p>
            <div className="w-16 h-1 bg-[var(--accent-color)] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-[var(--card-color)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
            <h3 className="text-[var(--accent-color)] text-lg font-bold mb-2">Our Mission</h3>
            <p className="text-sm text-[var(--secondary-text)] leading-relaxed mb-6">
                Grab is dedicated to creating a simple, transparent, and rewarding digital platform for users worldwide. We strive to provide innovative digital software solutions that empower our community to achieve their financial goals.
            </p>
            
            <h3 className="text-[var(--accent-color)] text-lg font-bold mb-2">Why Choose Us?</h3>
             <ul className="space-y-3">
                {[
                    'Secure & Encrypted Transactions',
                    'Instant Recharge Processing',
                    'High Yield Investment Plans',
                    '24/7 Dedicated Support'
                ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-color)]">
                        <i className="ri-checkbox-circle-fill text-green-500 text-lg"></i>
                        {item}
                    </li>
                ))}
            </ul>
        </div>

        <div className="text-center mt-8">
            <p className="text-[var(--text-color)] font-bold mb-1">Grab Gold Platform</p>
            <p className="text-xs text-[var(--secondary-text)]">Version 3.1.2 (Stable)</p>
            <p className="text-xs text-[var(--secondary-text)] mt-2">&copy; 2025 Grab Digital Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default About;