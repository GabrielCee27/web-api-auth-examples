import React, { useState } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();

function getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

const nowPlayingInitialState = {
    name: 'Not Checked',
    image: ''
};

function App() {

    const params = getHashParams();
    const [loggedIn, setLoggedIn] = useState(!!params.access_token);
    const [nowPlaying, setNowPlaying] = useState(nowPlayingInitialState);

    const getNowPlaying = () => {
        spotifyWebApi.getMyCurrentPlaybackState()
            .then(res => {
                const name = res.item.name;
                const image = res.item.album.images[0].url;
                setNowPlaying({
                    name: name,
                    image: image
                });
            })
    };

    if(!!params.access_token) {
        spotifyWebApi.setAccessToken(params.access_token);
    }

    return (
        <div className="App">
            {!loggedIn &&
            <a href={'http://localhost:8888'}>
                <button>Spotify Login</button>
            </a>
            }
            <div> Now Playing: {nowPlaying && nowPlaying.name} </div>
            <div>
                <img src={nowPlaying && nowPlaying.image} style={{ width: 100 }} />
            </div>
            <button onClick={getNowPlaying}>Check Now Playing</button>
        </div>
    );
}

export default App;
