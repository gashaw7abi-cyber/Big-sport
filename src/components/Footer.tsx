import React from 'react';
import { Facebook, Twitter, Youtube, Send } from 'lucide-react';

interface FooterProps {
  changeTab: (tab: 'news' | 'scores' | 'admin' | 'profile' | 'privacy' | 'about' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ changeTab }) => {
  return (
    <footer className="mt-16 pt-10 pb-8 text-center md:text-left text-slate-400 border-t border-slate-700/50 bg-[#0f172a]/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-8 mb-10">
          
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <img src="https://i.postimg.cc/g29Gpg7r/1778746810882.jpg" alt="Logo" className="w-10 h-10 object-cover rounded-full bg-[#1e293b]" />
              <div className="flex flex-col text-left">
                <span className="text-xl font-black text-white italic tracking-tighter">NEW SPORT</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest leading-none">Live Updates & News</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 max-w-xs text-center md:text-left">
              Your ultimate source for real-time football news, live scores, and exclusive updates from around the world.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <button onClick={() => changeTab('privacy')} className="hover:text-emerald-400 transition-colors text-sm font-medium">Privacy Policy</button>
            <button onClick={() => changeTab('contact')} className="hover:text-emerald-400 transition-colors text-sm font-medium">Contact Us</button>
            <button onClick={() => changeTab('about')} className="hover:text-emerald-400 transition-colors text-sm font-medium">About Us</button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-700/50">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} NEW SPORT. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="https://x.com/Newsporti" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.07H5.078z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@new_sporti" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="YouTube">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/newsporti" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://t.me/newsport5" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Telegram">
              <Send className="w-5 h-5" />
            </a>
            <a href="https://t.me/newsporti_bot" target="_blank" rel="noreferrer" className="border border-slate-500 rounded-md px-2 py-0.5 text-[10px] font-bold text-slate-400 hover:text-white hover:border-white transition-colors" aria-label="Telegram Bot">
              BOT
            </a>
            <a href="https://tiktok.com/@new_sporti" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="TikTok">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.95v5.03c-.01 2.37-.87 4.7-2.6 6.27-1.4 1.28-3.3 1.94-5.23 1.76-2.52-.27-4.71-1.92-5.58-4.28-.7-1.95-.5-4.14.54-5.91 1.2-2.03 3.42-3.35 5.76-3.41 1.18-.03 2.36.17 3.48.59v4.2c-.41-.18-.84-.28-1.28-.31-1.07-.08-2.18.23-2.92.95-.73.71-.97 1.78-.71 2.78.26 1 .98 1.83 1.93 2.15 1.1.37 2.37.1 3.19-.72.67-.66 1.05-1.58 1.07-2.53.03-4.57.01-9.14.01-13.71z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
