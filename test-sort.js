const getX = (posName) => {
  if (!posName) return 50;
  posName = posName.toLowerCase();
  if (posName.includes('left back') || posName.includes('left wing back')) return 10;
  if (posName.includes('right back') || posName.includes('right wing back')) return 90;
  if (posName.includes('center left')) return 30;
  if (posName.includes('center right')) return 70;
  if (posName.includes('left')) return 15;
  if (posName.includes('right')) return 85;
  return 50;
}
console.log(['Center Left Defender', 'Left Back', 'Right Back', 'Center Right Defender'].map(p => ({p, x: getX(p)})).sort((a,b)=>a.x-b.x));
