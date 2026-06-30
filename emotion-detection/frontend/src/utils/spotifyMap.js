export const spotifyMap = {
  happy: {
    playlistUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0', // Happy Hits
    message: 'Keeping the good vibes going!'
  },
  sad: {
    playlistUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWVV27DiNWxkR', // Comfort Crowd
    message: 'Here is something comforting for you.'
  },
  angry: {
    playlistUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZq91oLsHZvy', // Calm Down
    message: 'Let\'s take a deep breath and relax.'
  },
  surprised: {
    playlistUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdOEFt9ZX0dh', // Plot Twist
    message: 'Wow! Here are some exciting tunes.'
  },
  fear: {
    playlistUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO', // Peaceful Piano
    message: 'Find your center with these calming sounds.'
  },
  disgust: {
    playlistUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn', // Lofi Beats
    message: 'Cleanse your mind with some lofi.'
  },
  neutral: {
    playlistUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M', // Today's Top Hits
    message: 'Just some nice background music.'
  }
};

export const getSpotifyRecommendation = (emotion) => spotifyMap[emotion?.toLowerCase()] || spotifyMap.neutral;
