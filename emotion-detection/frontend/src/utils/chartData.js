// Dummy data for charts
export const generateTimelineData = () => {
  const data = [];
  const emotions = ['happy', 'neutral', 'sad', 'angry', 'surprised'];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}:00`,
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      confidence: Math.floor(Math.random() * 40) + 60,
    });
  }
  return data;
};

export const weeklyMoodData = [
  { day: 'Mon', happy: 60, neutral: 20, sad: 10, other: 10 },
  { day: 'Tue', happy: 45, neutral: 35, sad: 15, other: 5 },
  { day: 'Wed', happy: 70, neutral: 10, sad: 5, other: 15 },
  { day: 'Thu', happy: 50, neutral: 30, sad: 10, other: 10 },
  { day: 'Fri', happy: 80, neutral: 10, sad: 0, other: 10 },
  { day: 'Sat', happy: 90, neutral: 5, sad: 0, other: 5 },
  { day: 'Sun', happy: 75, neutral: 15, sad: 5, other: 5 },
];

export const emotionFrequencyData = [
  { name: 'Happy', value: 45, color: '#10b981' },
  { name: 'Neutral', value: 25, color: '#64748b' },
  { name: 'Sad', value: 10, color: '#3b82f6' },
  { name: 'Angry', value: 5, color: '#ef4444' },
  { name: 'Surprised', value: 15, color: '#eab308' },
];

export const stabilityScoreData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  score: 70 + Math.random() * 25 + (Math.sin(i / 3) * 5),
}));
