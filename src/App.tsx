import './App.css';
import { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import MainPage from './pages/MainPage'
import PlaylistPage from './pages/PlaylistPage'
import TrackPage from './pages/TrackPage'
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PlayerState } from "./types/externalTypes"
import { store } from "./redux/store"

function App() {
  const token = window.sessionStorage.getItem("token");
  // const dispatch = useDispatch();
  // const audio = useSelector((state: PlayerState) => state.audio);
  // useEffect(() => {
  //   if (audio && audio.src !== undefined) {audio.pause()}
  // },[window.location]);
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
