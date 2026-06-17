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
  format = "horizontal", 
  responsive = "false",
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
    <div className={`overflow-hidden text-center bg-[#1e293b] rounded-lg border border-slate-700/20 p-1 min-h-[40px] ${className}`}>
      <div className="text-[8px] text-slate-600 mb-0.5 uppercase tracking-widest font-medium opacity-30">Ad</div>
      <div className="flex justify-center overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '320px', height: '50px' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        ></ins>
      </div>
    </div>
  );
};
