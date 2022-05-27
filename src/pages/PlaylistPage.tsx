import React, { useState, useEffect} from 'react'
import { Track, TrackItem } from '../types/externalTypes'
import { SET_TRACK, SET_PLAYLIST, PLAY_PREV, PLAY_NEXT , TOGGLE_PLAYING} from '../redux/actions'
import { useSelector, useDispatch } from 'react-redux'
import styles from './PlaylistPage.module.css'
import { msConverter } from '../utils'
import { PlayerState } from '../types/externalTypes'
import PlaybackBar from '../components/PlaybackBar'


export default function PlaylistPage() {
    const dispatch = useDispatch();
    const activeTrack = useSelector((state: PlayerState) => state.playingTrack);
    const playing = useSelector((state: PlayerState) => state.playing);
    const tracks = useSelector((state: PlayerState) => state.listOfTracks);
    const token = window.sessionStorage.getItem("token");
    const userId = '31xrwg4j4x2epoksnrzu6xikqh7a';
    const API_URL = process.env.REACT_APP_API_URL || 'https://api.spotify.com/v1';
    const audio = useSelector((state: PlayerState) => state.audio);
    const [open, setOpen] = useState(true);
    const [playlistName, setPlaylistName] = useState('');
    const previewDuration = 30;

useEffect(() => {
    fetchPlaylistData();
}, []);

useEffect(() => {
    if (audio.src !== undefined) audio.pause();
  }, [activeTrack]);

useEffect(() => {
    if (audio.src !== undefined){
        if (playing){
           audio.play();
        }else{
            audio.pause();
        }
    }
}, [playing, audio]);


const handlePrev = () => {  
    audio.pause();
    dispatch({type: PLAY_PREV})
}

const handleNext = () => {  
    audio.pause();
    dispatch({type: PLAY_NEXT})
}


const playTrack = (track: Track) => {
    audio.pause();
    if (track !== activeTrack) dispatch({type: SET_TRACK, playingTrack: track}); 
    dispatch({type: TOGGLE_PLAYING});
}

const fetchPlaylistData = async() => {
    let curPlaylistId = '';
    let url = `${API_URL}/users/${userId}/playlists/`;
    await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(resp => resp.json())
      .then(data => {
          const randomIdx = Math.floor(Math.random() * data.items.length);
          curPlaylistId = data.items[randomIdx].id;
          const playlistName= data.items[randomIdx].name;
          setPlaylistName(playlistName);
    url = `${API_URL}/playlists/${curPlaylistId}/tracks`
    fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(resp => resp.json())
      .then(data => {
          const firstTrack = data.items.filter((i: TrackItem) => i.track.preview_url !== null)[0]?.track;
          dispatch({type: SET_PLAYLIST, tracks: data.items.filter((i: TrackItem) => i.track.preview_url !== null)});
          dispatch({type: SET_TRACK, playingTrack: firstTrack});    
      });
    });
}


  return (
      <>
    <h3 className={styles.nowPlayingText}>Now Playing</h3>
    <div className={styles.playlistBox}>
        <div>
        <h4 className={styles.playlistText}>PLAYLIST</h4>
        <h4 className={styles.playlistName}>{playlistName}</h4>
        </div>
        <button onClick={() => setOpen(!open)} className={open ? styles.dropdownBtn : `${styles.dropdownBtn} ${styles.closed}`}></button>
    </div>
    {open && 
    <div className={styles.tracksContainer}>
    {tracks ? tracks?.map((item) => 
    <div key={item.track.id}>
    <div className={styles.trackBox}>
        <button className={(playing && item.track.id === activeTrack?.id) 
            ? styles.pauseBlueBtn 
            : styles.playBlueBtn} onClick={() => playTrack(item.track)}>
            </button>
            <p className={`${styles.trackName} ${styles.muted}`}>{item.track?.name}</p>
            <p className={`${styles.trackDuration} ${styles.muted}`}>{msConverter(audio.duration || previewDuration).join(':')}</p>
            <a href={ `/track/${item.track?.id}`}><button className={styles.detailsBtn}></button></a> 
    </div>
    {(activeTrack?.id === item.track.id && audio) ? 
    <PlaybackBar audio={audio}  /> : <span className={styles.divider}></span>}
    </div>
    ) : <p>Loading...</p>}
    </div>
    }
    <div className={styles.playerBlue}>
        <div>
        <img src={activeTrack?.album?.images[0]?.url} alt="active track" className={styles.activeTrackImg}/>
        <p className={`${styles.white} ${styles.activeTrackData}`}>
    { activeTrack?.name}<br />{activeTrack?.album?.artists[0]?.name}
        </p>
        </div>
        <div className={styles.controls}>
        <button className={styles.playPrevBtn} onClick={() => handlePrev()}></button>
       { playing ? <button className={styles.pauseWhiteBtn} onClick={() =>  dispatch({type: TOGGLE_PLAYING})}></button>
       : <button className={styles.playWhiteBtn} onClick={() =>   dispatch({type: TOGGLE_PLAYING})}></button> } 
        <button className={styles.playNextBtn} onClick={() => handleNext()}></button>
        </div>
    </div>
    </>
  )
}
