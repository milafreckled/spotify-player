import React, {useEffect, useState} from 'react'
import { useHistory} from 'react-router-dom'

// 	https://api.spotify.com/v1/playlists/{playlist_id}/tracks - endpoint for tracks
// https://open.spotify.com/playlist/${playlist?.id}
// tracks.items[i].track.external_urls.spotify - link to i-th track
// tracks.items[i].track - object with track data

function MainPage() {
  const history = useHistory();
  const [token, setToken] = useState<string|null>('');
    const AUTH_ENDPOINT='http://accounts.spotify.com/authorize'
    const CLIENT_ID=process.env.REACT_APP_SPOTIFY_CLIENT_ID || 'cdc51aa678bd4de58f23ecd12427f5de';
    const REDIRECT_URI = `${window.location.protocol}//${window.location.host}`;
    const RESPONSE_TYPE='token'
    const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.sessionStorage.getItem("token");
    if (token) history.push("/");
    if (!token && hash) {
        token = hash.substring(1)?.split("&")?.find(elem => elem.startsWith("access_token"))?.split("=")[1] || '';
        window.location.hash = "";
        window.sessionStorage.setItem("token", token);
        history.push('/');
    }
    setToken(token);
    setInterval(() => {sessionStorage.clear()}, 3600 * 1000);
}, [])

  return (
    <button className="loginBtn">
      <a href={url}>Login to Spotify</a> 
    </button>
  )
}
export default  MainPage;