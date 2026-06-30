import React from 'react'

const SpotifyPlayer = ({ emotion }) => {

    const playlists = {

        Happy:
            "https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC",

        Sad:
            "https://open.spotify.com/embed/playlist/37i9dQZF1DWVrtsSlLKzro",

        Angry:
            "https://open.spotify.com/embed/playlist/37i9dQZF1DWYBO1MoTDhZI",

        Neutral:
            "https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6",

        Fear:
            "https://open.spotify.com/embed/playlist/37i9dQZF1DWZqd5JICZI0u",

        Surprise:
            "https://open.spotify.com/embed/playlist/37i9dQZF1DX0BcQWzuB7ZO"
    }

    return (

        <div className='w-full rounded-3xl overflow-hidden border border-white/10'>

            <iframe
                src={playlists[emotion]}
                width="100%"
                height="380"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            />

        </div>
    )
}

export default SpotifyPlayer