export const emotionColors = {
  happy: '#10b981', // emerald-500
  sad: '#3b82f6',   // blue-500
  angry: '#ef4444', // red-500
  surprised: '#eab308', // yellow-500
  fear: '#8b5cf6',  // violet-500
  disgust: '#14b8a6', // teal-500
  neutral: '#64748b'  // slate-500
};

export const emotionGradients = {
  happy: 'from-emerald-500/20 to-emerald-900/20',
  sad: 'from-blue-500/20 to-blue-900/20',
  angry: 'from-red-500/20 to-red-900/20',
  surprised: 'from-yellow-500/20 to-yellow-900/20',
  fear: 'from-violet-500/20 to-violet-900/20',
  disgust: 'from-teal-500/20 to-teal-900/20',
  neutral: 'from-slate-500/20 to-slate-900/20'
};

export const getEmotionColor = (emotion) => {
  const norm = emotion?.toLowerCase();
  const key = norm === 'surprise' ? 'surprised' : norm;
  return emotionColors[key] || emotionColors.neutral;
};

export const getEmotionGradient = (emotion) => {
  const norm = emotion?.toLowerCase();
  const key = norm === 'surprise' ? 'surprised' : norm;
  return emotionGradients[key] || emotionGradients.neutral;
};
