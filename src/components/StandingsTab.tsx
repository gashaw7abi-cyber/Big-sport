import React from 'react';

export const StandingsTab = ({ summaryData, homeTeam, awayTeam }: { summaryData: any, homeTeam: any, awayTeam: any }) => {
  const standingsObj = Array.isArray(summaryData?.standings) ? summaryData.standings[0] : summaryData?.standings;
  
  let entries = [];
  if (Array.isArray(standingsObj?.groups?.[0]?.standings?.entries)) {
    entries = standingsObj.groups[0].standings.entries;
  } else if (Array.isArray(standingsObj?.groups?.[0]?.standings)) {
    entries = standingsObj.groups[0].standings;
  }

  if (entries.length === 0) {
    return <div className="text-center text-xs text-slate-500 py-8">Standings not available for this competition.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/50">
      <table className="w-full text-left text-xs whitespace-nowrap">
        <thead className="bg-slate-800 text-slate-400 uppercase tracking-wider font-black text-[10px]">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3 text-center">GP</th>
            <th className="px-4 py-3 text-center">W</th>
            <th className="px-4 py-3 text-center">D</th>
            <th className="px-4 py-3 text-center">L</th>
            <th className="px-4 py-3 text-center">GD</th>
            <th className="px-4 py-3 text-center text-emerald-400">PTS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {entries.map((row: any, ri: number) => {
            const isMatchTeam = row.team?.id === homeTeam.team?.id || row.team?.id === awayTeam.team?.id || row.team?.uid === homeTeam.team?.uid || row.team?.uid === awayTeam.team?.uid;
            return (
              <tr key={ri} className={`hover:bg-slate-700/30 transition-colors ${isMatchTeam ? 'bg-slate-700/20' : ''}`}>
                <td className="px-4 py-3 font-bold text-slate-500">{row.stats?.find((s: any) => s.name === 'rank')?.displayValue || ri + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-white rounded-full p-0.5 shadow-sm flex items-center justify-center shrink-0">
                      {(row.team?.logos?.[0]?.href || row.logo?.[0]?.href) ? (
                        <img src={row.team?.logos?.[0]?.href || row.logo?.[0]?.href} alt={row.team?.name || row.team || ''} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full bg-slate-200 rounded-full" />
                      )}
                    </div>
                    <span className={`font-bold ${isMatchTeam ? 'text-emerald-400' : 'text-slate-200'}`}>{row.team?.shortDisplayName || row.team?.name || (typeof row.team === 'string' ? row.team : 'Unknown')}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-slate-400 font-medium">{row.stats?.find((s: any) => s.name === 'gamesPlayed')?.displayValue || '0'}</td>
                <td className="px-4 py-3 text-center text-slate-400 font-medium">{row.stats?.find((s: any) => s.name === 'wins')?.displayValue || '0'}</td>
                <td className="px-4 py-3 text-center text-slate-400 font-medium">{row.stats?.find((s: any) => s.name === 'ties')?.displayValue || '0'}</td>
                <td className="px-4 py-3 text-center text-slate-400 font-medium">{row.stats?.find((s: any) => s.name === 'losses')?.displayValue || '0'}</td>
                <td className="px-4 py-3 text-center text-slate-400 font-medium">{row.stats?.find((s: any) => s.name === 'pointDifferential')?.displayValue || '0'}</td>
                <td className="px-4 py-3 text-center text-emerald-400 font-black">{row.stats?.find((s: any) => s.name === 'points')?.displayValue || '0'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
