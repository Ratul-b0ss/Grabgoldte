
import React from 'react';
import { SubHeader } from '../components/Layout';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: 'Announcement' | 'Promo' | 'Maintenance';
}

const newsData: NewsItem[] = [
  {
    id: 1,
    title: 'New Feature: Daily Rewards',
    excerpt: 'We have launched a new Daily Rewards system. Log in daily to claim bonuses.',
    date: 'Dec 08, 2025',
    category: 'Announcement',
  },
  {
    id: 2,
    title: 'Diamond Package Availability',
    excerpt: 'The Diamond Package offers increased daily returns for a limited 30-day period.',
    date: 'Dec 06, 2025',
    category: 'Promo',
  },
  {
    id: 3,
    title: 'System Maintenance Notice',
    excerpt: 'Scheduled server maintenance on Dec 10th from 2:00 AM to 4:00 AM UTC.',
    date: 'Dec 04, 2025',
    category: 'Maintenance',
  },
  {
    id: 4,
    title: 'Community Milestone',
    excerpt: 'We have reached 50,000 active investors. Thank you for your trust.',
    date: 'Nov 28, 2025',
    category: 'Announcement',
  }
];

const News: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] pb-24">
      <SubHeader title="News & Updates" backUrl="/home" />

      <div className="pt-20 px-4 space-y-6 animate-fade-in">
        
        {/* Featured News */}
        <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-sm bg-[var(--primary-color)]">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-4 left-4">
                 <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 uppercase">
                    {newsData[0].category}
                 </span>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                <h2 className="text-xl font-bold text-white mb-2">{newsData[0].title}</h2>
                <p className="text-white/80 text-sm line-clamp-2">{newsData[0].excerpt}</p>
            </div>
        </div>

        {/* List */}
        <div className="space-y-3">
            {newsData.slice(1).map((item) => (
                <div key={item.id} className="bg-[var(--card-color)] p-4 rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-[var(--accent-color)] uppercase tracking-wider">
                            {item.category}
                        </span>
                        <span className="text-[10px] text-[var(--secondary-text)]">{item.date}</span>
                    </div>
                    <h4 className="font-bold text-[var(--text-color)] text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-[var(--secondary-text)] line-clamp-2">{item.excerpt}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default News;
