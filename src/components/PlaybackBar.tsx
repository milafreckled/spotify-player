import React, { useState, useEffect } from 'react'
import { msConverter } from "../utils"
import styles from './PlaybackBar.module.css'
import { PLAY_NEXT} from '../redux/actions'
import { useDispatch } from 'react-redux'

const PlaybackBar: React.FC<{audio: HTMLAudioElement, replay?: boolean, setReplay?:  React.Dispatch<React.SetStateAction<boolean>>}> = ({audio, replay, setReplay}) => {
    const dispatch = useDispatch();
    const [playbackWidth, setPlaybackWidth] = useState(audio.currentTime);
    useEffect(() => { 
      if (replay){
        setPlaybackWidth(0);
        if (setReplay) setReplay(false);
      }
    }, [replay]);

    useEffect(() => {
      let interval: NodeJS.Timer | undefined;
        interval = setInterval(() => {
          if (!audio.paused && audio) setPlaybackWidth((prev: number) => prev + 1 );
        }, 1000);   
        
      return () => clearInterval(interval);
    }, [audio.paused, audio.currentTime, audio])

  audio.onended = () => {
      dispatch({type: PLAY_NEXT});
  }

  return (
   <div className={styles.wrapper}>
        <p className={styles.output} style={{left: `${(playbackWidth/audio.duration) * 100}%`}}>{msConverter(audio.currentTime).join(':')}</p>
        <input className={styles.playbackPath} type="range" min="0" max={audio ? audio.duration : 30} value={playbackWidth} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlaybackWidth(Number((e.target as HTMLInputElement).value))}/>
    </div> 
     
  )
}

export default PlaybackBar;