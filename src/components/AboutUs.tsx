import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <div className="bg-[#1e293b] rounded-2xl p-6 md:p-8 space-y-6 max-w-4xl mx-auto border border-slate-700/50 mt-4">
      <h1 className="text-3xl font-black text-white shrink-0 tracking-tight">About Us</h1>
      <div className="space-y-4 text-slate-300 leading-relaxed text-sm md:text-base">
        <p>
          Welcome to <strong className="text-emerald-400">NEW SPORT</strong>! We are dedicated to providing the latest and most accurate football news, live scores, and updates from top leagues around the globe. Our platform is built for passionate fans who want real-time information at their fingertips.
        </p>
        <p>
          Our mission is to cover everything from major tournaments like the UEFA Champions League, Premier League, La Liga, Serie A to other local leagues, ensuring you never miss a moment of the action.
        </p>
      </div>
    </div>
  );
};
