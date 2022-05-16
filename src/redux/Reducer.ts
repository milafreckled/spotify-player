import React from 'react';
import { shuffle } from "../utils"
import { TrackItem, Track } from '../types/externalTypes'
import { SET_TRACK, SET_PLAYLIST, PLAY_NEXT, PLAY_PREV, SHUFFLE, SET_AUDIO, TOGGLE_PLAYING } from './actions'
import { PlayerState } from "../types/externalTypes"

const initialState: PlayerState = { 
    indexOfPlaying: 0,
    listOfTracks: [],
    playingTrack: null,
    audio: new Audio(''),
    playing: false
}

const getIndex = (track: Track, list: TrackItem[]) => {
const el = list.find((item) => item.track === track);
return el !== undefined ? list.indexOf(el) : 0;
}

const Reducer = (state = initialState, action: any) => {
    switch (action.type) {
      case TOGGLE_PLAYING: return { ...state, playing: !state.playing}
      case SET_AUDIO: 
          return { ...state, audio: new Audio(action.url)}
      case SET_TRACK:
        return { ...state, playingTrack: action.playingTrack, audio: new Audio(action.playingTrack.preview_url),
           indexOfPlaying: getIndex(action.playingTrack, state.listOfTracks)};
      case SET_PLAYLIST:
        return { ...state, listOfTracks: action.tracks };
      case PLAY_NEXT:{
        let track;
          if (state.indexOfPlaying + 1 < state.listOfTracks.length){
            track = state.listOfTracks[state.indexOfPlaying + 1]?.track;
            return { ...state, indexOfPlaying: state.indexOfPlaying + 1,
            playingTrack: track, audio: new Audio(track.preview_url) };
          }else{
            track = state.listOfTracks[0]?.track;
            return {...state, indexOfPlaying: 0,
            playingTrack: track, audio: new Audio(track.preview_url)}
          }
        }
      case PLAY_PREV: {
          let lastIdx = state.listOfTracks.length - 1;
          let track;
          if (state.indexOfPlaying - 1 >=  0){
            lastIdx = state.indexOfPlaying - 1;
            track = state.listOfTracks[lastIdx].track;
            return { ...state, indexOfPlaying: lastIdx,
            playingTrack: track, audio: new Audio(track.preview_url)};
          }else{
            track = state.listOfTracks[lastIdx].track;
            return {...state, indexOfPlaying:  lastIdx,
            playingTrack: track, audio: new Audio(track.preview_url)}
        }
    }
      case SHUFFLE:
        return {...state, listOfTracks: shuffle(state.listOfTracks)}
        default:
          return state
      }
  }

  export default Reducer;