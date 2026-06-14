export const fetchEspnNews = async () => {
  const response = await fetch('/api/news');
  if (!response.ok) throw new Error("Failed to fetch news");
  return await response.json();
};

export const fetchEspnScores = async () => {
  const response = await fetch('/api/scores');
  if (!response.ok) throw new Error("Failed to fetch scores");
  return await response.json();
};

export const fetchEspnSummary = async (league: string, event: string) => {
  const response = await fetch(`/api/summary?league=${league}&event=${event}`);
  if (!response.ok) throw new Error("Failed to fetch summary");
  return await response.json();
};
