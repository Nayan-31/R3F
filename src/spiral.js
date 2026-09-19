// Progress 0 = fingertip, 1 = upper outer end. Same path for cubes and ribbons.
// Progress time nahi hai; raaste par location batane wala number hai.
// progress ki value 0 se 1 tak hai
export function getSpiralPosition(progress, phase) {
  const angle = progress * Math.PI * 2 * 2.2 + phase;
  const radius = progress * 5.4 + Math.sin(progress * Math.PI) * 1.1;
  // Pehle model ke around dip, phir upar wide spiral.
  const dip = progress < 0.45 ? Math.sin((progress / 0.45) * Math.PI) * 3.3 : 0;
  return [
    Math.cos(angle) * radius,
    progress * 8 - dip,
    Math.sin(angle) * radius * 0.65,
  ];
}
