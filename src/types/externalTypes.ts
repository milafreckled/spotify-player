type Artist = {
id: string;
name: string;
uri: string;
}
type Album = { 
    artists: Artist[];
    images: Image[];
}
export type PlayerState = {
    listOfTracks: TrackItem[];
    indexOfPlaying: number;
    playingTrack: Track | null;
    audio: any;
    playing: boolean
}
export type Image = { 
    height: number;
    width: number;
    url: string;
}
export type Playlist = {
    id: string;
    images: Image[];
    name: string;
  }
  export type TrackItem = {
      track: Track;
  }
export type Track = {
    id: string;
    preview_url: string;
    name: string;
    duration_ms?: number; // in milliseconds
    album: Album
}