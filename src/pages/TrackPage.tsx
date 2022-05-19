import {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom"
import { msConverter } from '../utils'
import styles from './TrackPage.module.css'
import PlaybackBar from "../components/PlaybackBar"
import { PlayerState } from '../types/externalTypes'
import { TOGGLE_PLAYING, PLAY_PREV, PLAY_NEXT, SHUFFLE, SET_TRACK} from "../redux/actions"


export default function TrackPage() {
  const activeTrack = useSelector((state: PlayerState) => state.playingTrack);
  const audio = useSelector((state: PlayerState) => state.audio);
  const playing = useSelector((state: PlayerState) => state.playing);
  const [loading, setLoading] = useState(false);
  const [replay, setReplay] = useState(false);
  const token = window.sessionStorage.getItem("token");
  const trackId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
  const API_URL = process.env.REACT_APP_API_URL || 'https://api.spotify.com/v1';
  const dispatch = useDispatch();
  const history = useHistory();

  const fetchTrackData  = async() => {
    let url = `${API_URL}/tracks/${trackId}`
    setLoading(true);
    await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(resp => resp.json())
      .then(data => {
        dispatch({type: SET_TRACK, playingTrack: data});
      })
      setLoading(false);
  }

useEffect(() => {
  fetchTrackData();
}, [])


useEffect(() => {
  if (audio.src !== undefined) audio.pause();
  history.push(`/track/${activeTrack?.id}`);
}, [activeTrack, audio]);


useEffect(() => { 
  if (playing && loading) dispatch({type: TOGGLE_PLAYING});
  if (audio.src !== undefined && !loading){
    if (playing){
      audio.play();
    }else{
      audio.pause();
    }
  }
}, [playing, audio, loading]);

const handlePrev = () => {
  if (audio.src !== undefined) audio.pause();
  dispatch({type: PLAY_PREV});
}
const handleNext = () => {
  if (audio.src !== undefined) audio.pause();
  dispatch({type: PLAY_NEXT});
}
const handleReplay = () => {
  setReplay(true);
  audio.currentTime = 0;
}
  return (
   audio && audio.src !== undefined ?  <div>
     <div className={styles.header}>
      <h3 className={styles.nowPlayingText}>Now Playing</h3>
      <hr />
      </div>
      <img className={styles.trackImg} src={`${activeTrack?.album?.images[0].url}`} alt="album cover" />
      <p className={styles.trackName}>{activeTrack?.name}</p>
      <p className={styles.trackArtist}> {activeTrack?.album?.artists[0].name}</p>
      <p className={styles.trackDuration}>{msConverter(audio.duration || 30).join(':')}</p>
      <PlaybackBar replay={replay} setReplay={setReplay} audio={audio} />
      <div className={styles.controls}>
        <button className={styles.replayBtn} onClick={() => handleReplay()}></button>
        <button className={styles.playPrevBtn} onClick={() => handlePrev()}></button>
        <button className={playing ? styles.pauseBlueBtn : styles.playBlueBtn} onClick={() => dispatch({type: TOGGLE_PLAYING})}></button>
        <button className={styles.playNextBtn} onClick={() => handleNext()}></button>
        <button className={styles.shuffleBtn} onClick={() => dispatch({type: SHUFFLE})}></button>      
      </div>
    </div> : <p>Loading...</p>
  )
}
