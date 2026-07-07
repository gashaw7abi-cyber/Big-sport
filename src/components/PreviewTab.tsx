import React from 'react';

export const PreviewTab = ({ summaryData, homeTeam, awayTeam }: { summaryData: any, homeTeam: any, awayTeam: any }) => {
  
  const getForm = (teamId: string, teamUid: string, index: number) => {
    if (!summaryData?.lastFiveGames) return [];
    const form = summaryData.lastFiveGames.find((t: any) => t.team?.id === teamId || t.team?.uid === teamUid);
    if (form) return form.events || [];
    // fallback to index
    return summaryData.lastFiveGames[index]?.events || [];
  };

  const homeForm = [...getForm(homeTeam.team.id, homeTeam.team.uid, 0)].reverse();
  const awayForm = [...getForm(awayTeam.team.id, awayTeam.team.uid, 1)].reverse();

  const renderMatchBlock = (event: any, currentTeamLogo: string) => {
    const isHome = event.atVs === 'vs';
    const hLogo = isHome ? currentTeamLogo : event.opponentLogo;
    const aLogo = isHome ? event.opponentLogo : currentTeamLogo;
    const score = event.score || `${event.homeTeamScore}-${event.awayTeamScore}`;

    return (
      <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 min-w-[110px] justify-center shadow-sm">
        <div className="w-5 h-5 bg-white rounded-full p-0.5 flex shrink-0">
          {hLogo ? <img src={hLogo} alt="home" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-slate-200 rounded-full" />}
        </div>
        <span className="text-xs font-black text-slate-200 tracking-wider whitespace-nowrap">{score}</span>
        <div className="w-5 h-5 bg-white rounded-full p-0.5 flex shrink-0">
          {aLogo ? <img src={aLogo} alt="away" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-slate-200 rounded-full" />}
        </div>
      </div>
    );
  };

  const renderResultBadge = (result: string) => {
    const color = result === 'W' ? 'bg-emerald-500' : result === 'L' ? 'bg-red-500' : 'bg-amber-500';
    return (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${color} shadow-sm`}>
        <span className="text-[10px] font-black text-white">{result}</span>
      </div>
    );
  };

  // H2H Summary
  let h2hStats = { homeWins: 0, awayWins: 0, draws: 0 };
  const h2hGames = summaryData?.headToHeadGames?.[0]?.events?.slice(0, 4) || [];
  
  if (h2hGames.length > 0) {
    h2hGames.forEach((game: any) => {
      const hId = game.homeTeamId;
      const aId = game.awayTeamId;
      const hScore = parseInt(game.homeTeamScore);
      const aScore = parseInt(game.awayTeamScore);
      
      if (hScore > aScore) {
        if (hId === homeTeam.team.id || hId === homeTeam.team.uid) h2hStats.homeWins++;
        else h2hStats.awayWins++;
      } else if (aScore > hScore) {
        if (aId === homeTeam.team.id || aId === homeTeam.team.uid) h2hStats.homeWins++;
        else h2hStats.awayWins++;
      } else {
        h2hStats.draws++;
      }
    });
  }

  const getLogoForId = (id: string, opponentId: string, opponentLogo: string) => {
    if (id === homeTeam.team.id || id === homeTeam.team.uid) return homeTeam.team.logo;
    if (id === awayTeam.team.id || id === awayTeam.team.uid) return awayTeam.team.logo;
    if (id === opponentId) return opponentLogo;
    return '';
  };

  return (
    <div className="space-y-6 pt-2 pb-8">
      {/* Venue / Attendance Info */}
      {summaryData?.gameInfo && (summaryData.gameInfo.venue || summaryData.gameInfo.attendance > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
          {summaryData.gameInfo.venue && (
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Venue</div>
              <div className="text-xs font-bold text-slate-200">{summaryData.gameInfo.venue.fullName}</div>
            </div>
          )}
          {summaryData.gameInfo.attendance > 0 && (
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Attendance</div>
              <div className="text-xs font-bold text-slate-200">{summaryData.gameInfo.attendance.toLocaleString()}</div>
            </div>
          )}
        </div>
      )}

      {/* Recent Form (Last 5 Games) */}
      {(homeForm.length > 0 || awayForm.length > 0) && (
        <div className="px-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Home Form */}
            <div className="flex flex-col gap-3">
              {homeForm.map((event: any, i: number) => (
                <div key={i} className="flex items-center justify-end gap-2 w-full">
                  {renderMatchBlock(event, homeTeam.team.logo)}
                  {renderResultBadge(event.gameResult)}
                </div>
              ))}
            </div>
            
            {/* Away Form */}
            <div className="flex flex-col gap-3">
              {awayForm.map((event: any, i: number) => (
                <div key={i} className="flex items-center justify-start gap-2 w-full">
                  {renderResultBadge(event.gameResult)}
                  {renderMatchBlock(event, awayTeam.team.logo)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Head to Head */}
      {h2hGames.length > 0 && (
        <div className="mt-8">
          <div className="bg-slate-800/80 px-4 py-2 border-y border-slate-700/50 flex items-center justify-between">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">H2H Last Matches</h3>
            <span className="text-[10px] text-emerald-500 font-bold tracking-wider">MORE</span>
          </div>
          
          <div className="px-4 py-6">
            <div className="flex gap-4 overflow-x-auto justify-center pb-2 hide-scrollbar">
              {h2hGames.map((game: any, i: number) => {
                const hLogo = getLogoForId(game.homeTeamId, game.opponent?.id, game.opponentLogo);
                const aLogo = getLogoForId(game.awayTeamId, game.opponent?.id, game.opponentLogo);
                const hScore = game.homeTeamScore;
                const aScore = game.awayTeamScore;
                
                return (
                  <div key={i} className="flex-shrink-0 flex flex-col items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 w-24">
                    <div className="flex items-center justify-center mb-3 relative">
                      <div className="w-9 h-9 bg-white rounded-full p-1 flex shrink-0 shadow-md z-10">
                        {hLogo ? <img src={hLogo} className="w-full h-full object-contain" /> : <div className="w-full h-full bg-slate-200 rounded-full" />}
                      </div>
                      <div className="w-9 h-9 bg-white rounded-full p-1 flex shrink-0 shadow-md -ml-3 z-0">
                        {aLogo ? <img src={aLogo} className="w-full h-full object-contain" /> : <div className="w-full h-full bg-slate-200 rounded-full" />}
                      </div>
                    </div>
                    <div className="text-lg font-black text-slate-200 tracking-wider">
                      {hScore} <span className="text-slate-500 mx-0.5">-</span> {aScore}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* H2H Stats Summary */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="flex items-center gap-2 bg-slate-800/80 rounded-full pl-1 pr-4 py-1 border border-slate-700/50">
                <div className="w-6 h-6 bg-white rounded-full p-0.5">
                  <img src={homeTeam.team.logo} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-bold text-slate-300"><span className="text-white">{h2hStats.homeWins}</span> Wins</span>
              </div>
              
              <div className="bg-slate-800/80 rounded-full px-4 py-1.5 border border-slate-700/50">
                <span className="text-xs font-bold text-slate-300"><span className="text-white">{h2hStats.draws}</span> Draws</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/80 rounded-full pr-1 pl-4 py-1 border border-slate-700/50">
                <span className="text-xs font-bold text-slate-300"><span className="text-white">{h2hStats.awayWins}</span> Wins</span>
                <div className="w-6 h-6 bg-white rounded-full p-0.5">
                  <img src={awayTeam.team.logo} className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
