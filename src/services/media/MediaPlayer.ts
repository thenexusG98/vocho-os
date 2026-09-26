import type {
  MediaState,
  Track,
} from "../../types/media";

export interface MediaPlayer {
  play(): Promise<void>;
  pause(): Promise<void>;
  next(): Promise<void>;
  previous(): Promise<void>;

  seek(position: number): Promise<void>;

  setVolume(volume: number): Promise<void>;

  toggleShuffle(): Promise<void>;
  toggleRepeat(): Promise<void>;

  selectTrack(track: Track): Promise<void>;

  getState(): MediaState;

  subscribe(
    listener: (state: MediaState) => void
  ): () => void;
}