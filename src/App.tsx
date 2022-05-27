import React from 'react'
import './App.css';
import {  useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import MainPage from './pages/MainPage'
import PlaylistPage from './pages/PlaylistPage'
import TrackPage from './pages/TrackPage'
import { Provider } from 'react-redux';
import axios from 'axios'
import { store } from "./redux/store"

function App() {
  const token = window.sessionStorage.getItem("token");
  const AUTH_ENDPOINT='http://accounts.spotify.com/authorize'
  const scope = 'user-read-private user-read-email';
  const CLIENT_ID=process.env.REACT_APP_SPOTIFY_CLIENT_ID || 'cdc51aa678bd4de58f23ecd12427f5de';
  const REDIRECT_URI = `${window.location.protocol}//${window.location.host}`;
  const RESPONSE_TYPE='code'
  const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
  useEffect(() => {
    const reqInstance = axios.create({
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        }
      }
    )
    reqInstance.get(url).then((response) => console.log(response));
  }, [])
  return (
    <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" >
        {token ? <Redirect to= "/player"/> : <MainPage />}
        </Route>
        <Route path="/track/:trackId">
        <TrackPage />
        </Route>
        <Route path="/player">
        <PlaylistPage />
        </Route>
      </Switch>
    </Router>
    </Provider>
  );
}

export default App;

