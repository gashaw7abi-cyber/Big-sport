import React, { useEffect, useRef } from 'react';

interface AdSenseProps {
  client?: string;
  slot: string;
  format?: string;
  responsive?: string;
  className?: string;
}

export const AdSense: React.FC<AdSenseProps> = ({ 
  client = "ca-pub-1052173421990358", 
  slot, 
  format = "auto", 
  responsive = "true",
  className = ""
}) => {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!isLoaded.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      } catch (err: any) {
        // Ignore the expected error when strict mode renders twice
        const errorMessage = typeof err === 'string' ? err : err instanceof Error ? err.message : String(err);
        if (!errorMessage.includes('already have ads') && !errorMessage.includes('availableWidth=0')) {
          console.error("AdSense error:", err);
        }
      }
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden text-center bg-[#1e293b] rounded-xl border border-slate-700/50 p-2 min-h-[90px] ${className}`}>
      <div className="text-[10px] text-slate-600 mb-1 uppercase tracking-widest font-medium opacity-50">Ad</div>
      <div className="w-full flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minWidth: '250px', minHeight: '60px' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        ></ins>
      </div>
    </div>
  );
};
