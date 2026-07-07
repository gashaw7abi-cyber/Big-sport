import React from 'react';

export function LineupsTab({ summaryData, homeTeam, awayTeam }: { summaryData: any, homeTeam: any, awayTeam: any }) {
  if (!summaryData?.rosters) {
    return <div className="text-center text-xs text-slate-500 py-8">Lineups not available yet.</div>;
  }

  const getRoster = (team: any, index: number) => 
    summaryData.rosters.find((r: any) => r.team?.id === team.team?.id || r.team?.uid === team.team?.uid || summaryData.rosters.indexOf(r) === index)?.roster || [];

  const homeRoster = getRoster(homeTeam, 0);
  const awayRoster = getRoster(awayTeam, 1);

  const getStarters = (roster: any[]) => roster.filter((p: any) => p.starter);
  
  const getRows = (starters: any[], isHome: boolean) => {
    const getX = (posName: string) => {
      if (!posName) return 50;
      posName = posName.toLowerCase();
      if (posName.includes('left back') || posName.includes('left wing back')) return 10;
      if (posName.includes('right back') || posName.includes('right wing back')) return 90;
      if (posName.includes('center left')) return 30;
      if (posName.includes('center right')) return 70;
      if (posName.includes('left')) return 15;
      if (posName.includes('right')) return 85;
      return 50;
    };

    const gks: any[] = [];
    const defs: any[] = [];
    const mids: any[] = [];
    const fwds: any[] = [];

    starters.forEach(p => {
      const name = (p.position?.name || '').toLowerCase();
      if (name.includes('goalkeeper') || name.includes('gk')) {
        gks.push(p);
      } else if (name.includes('defender') || name.includes('back')) {
        defs.push(p);
      } else if (name.includes('midfielder') || name.includes('mid')) {
        mids.push(p);
      } else if (name.includes('forward') || name.includes('attacker') || name.includes('striker')) {
        fwds.push(p);
      } else {
        mids.push(p);
      }
    });

    const sortByX = (players: any[]) => players.sort((a, b) => getX(a.position?.name) - getX(b.position?.name));

    const rows = [sortByX(fwds), sortByX(mids), sortByX(defs), sortByX(gks)];
    return isHome ? rows : [sortByX(gks), sortByX(defs), sortByX(mids), sortByX(fwds)];
  };

  const homeStarters = getStarters(homeRoster);
  const awayStarters = getStarters(awayRoster);

  const renderPlayerNode = (player: any, colorClass: string) => {
    return (
      <div key={player.athlete?.id} className="flex flex-col items-center w-12 md:w-16">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white flex items-center justify-center text-xs md:text-sm font-bold text-white shadow-lg ${colorClass} bg-cover bg-center`}
             style={player.athlete?.jerseyImages?.[0]?.href ? { backgroundImage: `url(${player.athlete.jerseyImages[0].href})` } : {}}>
          {!player.athlete?.jerseyImages?.[0]?.href && (player.jersey || '-')}
        </div>
        <div className="text-[9px] md:text-[10px] font-bold text-white mt-1 bg-black/70 px-1.5 py-0.5 rounded shadow-sm text-center w-full truncate border border-slate-700/50">
          {player.athlete?.shortName}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* PITCH VIEW */}
      {(homeStarters.length > 0 || awayStarters.length > 0) && (
        <div className="relative w-full max-w-lg mx-auto aspect-[2/3] bg-emerald-700 border-2 border-emerald-500/50 rounded-lg overflow-hidden shadow-xl mb-8">
          {/* Pitch lines (CSS) */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Center line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white transform -translate-y-1/2" />
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 w-20 h-20 md:w-28 md:h-28 rounded-full border-[2px] border-white transform -translate-x-1/2 -translate-y-1/2" />
            {/* Center spot */}
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2" />
            {/* Penalty areas */}
            <div className="absolute top-0 left-1/2 w-1/2 h-1/6 border-x-[2px] border-b-[2px] border-white transform -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-1/2 h-1/6 border-x-[2px] border-t-[2px] border-white transform -translate-x-1/2" />
            {/* Goal areas */}
            <div className="absolute top-0 left-1/2 w-1/4 h-[8%] border-x-[2px] border-b-[2px] border-white transform -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-1/4 h-[8%] border-x-[2px] border-t-[2px] border-white transform -translate-x-1/2" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-between py-2 md:py-4">
            {/* Away Team Half (Top) */}
            <div className="flex-1 flex flex-col justify-between">
               {getRows(awayStarters, false).map((row, i) => (
                 <div key={i} className="flex justify-around items-center w-full px-2 h-1/4">
                    {row.map((player: any) => renderPlayerNode(player, "bg-slate-900"))}
                 </div>
               ))}
            </div>
            
            {/* Home Team Half (Bottom) */}
            <div className="flex-1 flex flex-col justify-between mt-4">
               {getRows(homeStarters, true).map((row, i) => (
                 <div key={i} className="flex justify-around items-center w-full px-2 h-1/4">
                    {row.map((player: any) => renderPlayerNode(player, "bg-slate-800"))}
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* SQUAD LISTS HEADER */}
      <div className="bg-slate-800/80 rounded-t-xl border border-slate-700/50 p-3 flex justify-between items-center text-xs font-bold text-slate-300">
        <span>SQUAD LISTS</span>
      </div>

      {/* SQUAD LISTS CONTENT (Side by side) */}
      <div className="grid grid-cols-2 gap-0 border-x border-b border-slate-700/50 rounded-b-xl overflow-hidden bg-slate-900/50">
        {/* Home Column */}
        <div className="border-r border-slate-700/50">
          <div className="p-3 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-end gap-2 text-right">
            <span className="text-[10px] md:text-xs font-bold text-white uppercase truncate">{homeTeam.team.shortDisplayName}</span>
            <div className="w-5 h-5 bg-white rounded-full p-0.5 shrink-0">
               {homeTeam.team.logo ? <img src={homeTeam.team.logo} alt="" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-slate-200 rounded-full" />}
            </div>
          </div>
          <div className="divide-y divide-slate-700/30 max-h-[500px] overflow-y-auto custom-scrollbar">
            {homeRoster.map((player: any, pi: number) => (
              <div key={pi} className="flex items-center gap-3 p-2.5 hover:bg-slate-800/40 transition-colors justify-end text-right">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] md:text-xs font-bold text-slate-200 truncate">
                    {player.athlete?.shortName || player.athlete?.displayName}
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium uppercase mt-0.5">
                    {player.position?.abbreviation || player.position?.name?.substring(0,3) || 'UNK'} {player.starter ? '(GS)' : ''}
                  </div>
                </div>
                <div className="w-7 h-7 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                  {player.jersey || '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Away Column */}
        <div>
          <div className="p-3 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-start gap-2">
            <div className="w-5 h-5 bg-white rounded-full p-0.5 shrink-0">
               {awayTeam.team.logo ? <img src={awayTeam.team.logo} alt="" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-slate-200 rounded-full" />}
            </div>
            <span className="text-[10px] md:text-xs font-bold text-white uppercase truncate">{awayTeam.team.shortDisplayName}</span>
          </div>
          <div className="divide-y divide-slate-700/30 max-h-[500px] overflow-y-auto custom-scrollbar">
            {awayRoster.map((player: any, pi: number) => (
              <div key={pi} className="flex items-center gap-3 p-2.5 hover:bg-slate-800/40 transition-colors justify-start">
                <div className="w-7 h-7 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                  {player.jersey || '-'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] md:text-xs font-bold text-slate-200 truncate">
                    {player.athlete?.shortName || player.athlete?.displayName}
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium uppercase mt-0.5">
                    {player.position?.abbreviation || player.position?.name?.substring(0,3) || 'UNK'} {player.starter ? '(GS)' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
