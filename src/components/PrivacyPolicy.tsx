import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Shield className="w-5 h-5 text-emerald-400" />
        Privacy Policy
      </h2>
      <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-700/50 text-slate-300 text-sm space-y-4">
        <h3 className="text-md font-bold text-white">1. Introduction</h3>
        <p>Welcome to NEW SPORT. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your information when you use our services.</p>
        
        <h3 className="text-md font-bold text-white mt-6">2. Information We Collect</h3>
        <p>We may collect information you provide directly to us, such as when you create an account, update your profile, or interact with our features.</p>

        <h3 className="text-md font-bold text-white mt-6">3. Use of Information</h3>
        <p>Your information is used to provide, maintain, and improve our services, as well as to personalize your experience. We may use your email to send you updates or notifications if you opt-in.</p>

        <h3 className="text-md font-bold text-white mt-6">4. Third-Party Services & Advertising</h3>
        <p>We use third-party services like Google AdSense for advertising. These third parties may use cookies and similar tracking technologies to deliver targeted advertisements to you based on your interests and browsing history.</p>
        <p>Google, as a third-party vendor, uses cookies to serve ads on our site. Users may opt out of personalized advertising by visiting Google Ads Settings.</p>

        <h3 className="text-md font-bold text-white mt-6">5. Data Security</h3>
        <p>We implement reasonable security measures to protect your data. However, please remember that no method of transmission over the internet or electronic storage is 100% secure.</p>

        <h3 className="text-md font-bold text-white mt-6">6. Changes to This Policy</h3>
        <p>We may update our Privacy Policy periodically. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
        
        <p className="pt-6 text-xs text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};
