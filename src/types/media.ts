export type MediaSourceType =
  | "local"
  | "usb"
  | "bluetooth"
  | "spotify";

export type PlaybackState =
  | "playing"
  | "paused"
  | "stopped";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;

  /**
   * Ruta del archivo MP3.
   * Ejemplo:
   * /music/songs/bohemian-rhapsody.mp3
   */
  audio: string;

  /**
   * Ruta de la portada.
   */
  cover: string;

  /**
   * Duración en segundos.
   * Para música local real la obtendremos
   * directamente del elemento Audio.
   */
  duration: number;

  source: MediaSourceType;
}

export interface MediaState {
  currentTrack: Track | null;
  playlist: Track[];

  position: number;
  volume: number;

  playbackState: PlaybackState;

  shuffle: boolean;
  repeat: boolean;

  source: MediaSourceType;
}