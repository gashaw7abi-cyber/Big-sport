import React from 'react';

export const ContactUs: React.FC = () => {
  return (
    <div className="bg-[#1e293b] rounded-2xl p-6 md:p-8 space-y-6 max-w-4xl mx-auto border border-slate-700/50 mt-4">
      <h1 className="text-3xl font-black text-white shrink-0 tracking-tight">Contact Us</h1>
      <div className="space-y-4 text-slate-300 leading-relaxed text-sm md:text-base">
        <p>We'd love to hear from you! If you have any inquiries, feedback, or suggestions, please feel free to reach out to us via our official social media channels, or message us directly on Telegram.</p>
        <p className="mt-4"><strong className="text-emerald-400">Email:</strong> Gashaw7abi@gmail.com</p>
      </div>
    </div>
  );
};
