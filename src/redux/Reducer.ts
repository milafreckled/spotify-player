import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import { shuffle } from "../utils"
import { TrackItem, Track } from '../types/externalTypes'
import { SET_TRACK, SET_PLAYLIST, PLAY_NEXT, PLAY_PREV, SHUFFLE, SET_AUDIO, TOGGLE_PLAYING } from './actions'
import { PlayerState, PlaylistState } from "../types/externalTypes"

/* ACTION */
// const setTracks = createAction<TrackItem[]>('setTracks');
// const setActiveTrack = createAction<Track>('setActiveTrack');
// const playPrev = createAction<void>('playPrev');
// const playNext = createAction<void>('playNext');
// const togglePlaying = createAction<void>('togglePlaying');

const initialState: PlayerState = { 
    indexOfPlaying: 0,
    listOfTracks: [],
    playingTrack: null,
    audio: new Audio(''),
    playing: false, 
}
const playlistState: PlaylistState = { 
  loading: false,
  tracks: []
}
const API_URL = process.env.REACT_APP_API_URL;
const userId = process.env.REACT_APP_SPOTIFY_USER_ID;

const token = window.sessionStorage.getItem("token");

const fetchTracks = createAsyncThunk('playlists/getPlaylists', async (thunkAPI) => {
    const getRandomPlaylistId = async () => {
    try{
     await fetch(`${API_URL}/users/${userId}/playlists/`, {
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`
       }
     })
     .then(resp => resp.json())
     .then(data => {
       const randomIdx = Math.floor(Math.random() * data.items.length);
       return data.items[randomIdx].id; 
     });
    }catch(e: any){
     throw new Error(`Error: ${e.message}`);
    }
    }
    const randomPlaylistId = getRandomPlaylistId();
    const res = await fetch(`${API_URL}/playlists/${randomPlaylistId}/tracks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      return res.items.filter((i: TrackItem) => i.track.preview_url !== null)
      // if (res.status === 400) {
      //   // Return the known error for future handling
      //   throw new Error(`Rejected with status code: ${res.status}`);
      // }
});

const playlistsSlice = createSlice({
  name: 'playlists',
  reducers: {},
  initialState: playlistState,
  extraReducers: (builder) => {
    builder.addCase(fetchTracks.fulfilled, (state, action) => {
      state.loading = false
      state.tracks = action.payload
    }),
    builder.addCase(fetchTracks.pending, (state, action) => { 
      state.loading = true 
    }),
    builder.addCase(fetchTracks.rejected, (state, action) => { 
      state.loading = false 
    })
  }
})
// const reducer = combineReducers({
//   playlists: playlistsSlice.reducer,
//   main: mainSlice.reducer
// })
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