import type {
  MediaState,
  Track,
} from "../../types/media";

import type { MediaPlayer } from "./MediaPlayer";

import { musicLibrary } from "../../data/musicLibrary";

class LocalMediaPlayer
  implements MediaPlayer
{
  private audio: HTMLAudioElement;

  private listeners: Array<
    (state: MediaState) => void
  > = [];

  private state: MediaState = {
    currentTrack: musicLibrary[0] ?? null,

    playlist: musicLibrary,

    position: 0,

    volume: 70,

    playbackState: "paused",

    shuffle: false,

    repeat: false,

    source: "local",
  };

  constructor() {
    this.audio = new Audio();

    this.audio.volume =
      this.state.volume / 100;

    this.registerEvents();

    this.loadCurrentTrack();
  }

  private registerEvents() {
    this.audio.addEventListener(
      "timeupdate",
      () => {
        this.state.position =
          this.audio.currentTime;

        this.notify();
      }
    );

    this.audio.addEventListener(
      "loadedmetadata",
      () => {
        if (
          !this.state.currentTrack
        ) {
          return;
        }

        this.state.currentTrack = {
          ...this.state.currentTrack,

          duration:
            this.audio.duration || 0,
        };

        this.notify();
      }
    );

    this.audio.addEventListener(
      "play",
      () => {
        this.state.playbackState =
          "playing";

        this.notify();
      }
    );

    this.audio.addEventListener(
      "pause",
      () => {
        this.state.playbackState =
          "paused";

        this.notify();
      }
    );

    this.audio.addEventListener(
      "ended",
      () => {
        void this.handleTrackEnded();
      }
    );

    this.audio.addEventListener(
      "error",
      () => {
        console.error(
          "No se pudo reproducir:",
          this.state.currentTrack?.audio
        );
      }
    );
  }

  private loadCurrentTrack() {
    const track =
      this.state.currentTrack;

    if (!track) {
      return;
    }

    this.audio.src = track.audio;

    this.audio.load();

    this.state.position = 0;

    this.notify();
  }

  private notify() {
    this.listeners.forEach(
      (listener) => {
        listener({
          ...this.state,

          currentTrack:
            this.state.currentTrack
              ? {
                  ...this.state
                    .currentTrack,
                }
              : null,

          playlist: [
            ...this.state.playlist,
          ],
        });
      }
    );
  }

  subscribe(
    listener: (
      state: MediaState
    ) => void
  ) {
    this.listeners.push(listener);

    listener(this.state);

    return () => {
      this.listeners =
        this.listeners.filter(
          (item) =>
            item !== listener
        );
    };
  }

  async play() {
    if (!this.state.currentTrack) {
      return;
    }

    try {
      await this.audio.play();
    } catch (error) {
      console.error(
        "Error reproduciendo audio:",
        error
      );
    }
  }

  async pause() {
    this.audio.pause();
  }

  async next() {
    const playlist =
      this.state.playlist;

    if (playlist.length === 0) {
      return;
    }

    const currentIndex =
      playlist.findIndex(
        (track) =>
          track.id ===
          this.state.currentTrack
            ?.id
      );

    let nextIndex =
      currentIndex + 1;

    if (this.state.shuffle) {
      nextIndex = Math.floor(
        Math.random() *
          playlist.length
      );
    }

    if (
      nextIndex >=
      playlist.length
    ) {
      if (this.state.repeat) {
        nextIndex = 0;
      } else {
        await this.pause();

        return;
      }
    }

    this.state.currentTrack =
      playlist[nextIndex];

    this.loadCurrentTrack();

    await this.play();
  }

  async previous() {
    const playlist =
      this.state.playlist;

    if (playlist.length === 0) {
      return;
    }

    /*
     * Si ya llevamos varios segundos
     * simplemente regresamos al inicio.
     */
    if (this.audio.currentTime > 5) {
      await this.seek(0);

      return;
    }

    const currentIndex =
      playlist.findIndex(
        (track) =>
          track.id ===
          this.state.currentTrack
            ?.id
      );

    let previousIndex =
      currentIndex - 1;

    if (previousIndex < 0) {
      previousIndex =
        playlist.length - 1;
    }

    this.state.currentTrack =
      playlist[previousIndex];

    this.loadCurrentTrack();

    await this.play();
  }

  async seek(position: number) {
    if (!this.state.currentTrack) {
      return;
    }

    this.audio.currentTime =
      Math.max(
        0,
        Math.min(
          position,
          this.audio.duration ||
            this.state.currentTrack
              .duration ||
            0
        )
      );

    this.state.position =
      this.audio.currentTime;

    this.notify();
  }

  async setVolume(
    volume: number
  ) {
    const normalized =
      Math.max(
        0,
        Math.min(volume, 100)
      );

    this.state.volume =
      normalized;

    this.audio.volume =
      normalized / 100;

    this.notify();
  }

  async toggleShuffle() {
    this.state.shuffle =
      !this.state.shuffle;

    this.notify();
  }

  async toggleRepeat() {
    this.state.repeat =
      !this.state.repeat;

    this.notify();
  }

  async selectTrack(
    track: Track
  ) {
    const wasPlaying =
      this.state.playbackState ===
      "playing";

    this.state.currentTrack =
      track;

    this.state.source =
      track.source;

    this.loadCurrentTrack();

    if (wasPlaying) {
      await this.play();
    }
  }

  getCurrentTrack() {
    return this.state.currentTrack;
  }

  getState() {
    return this.state;
  }

  private async handleTrackEnded() {
    if (this.state.repeat) {
      await this.seek(0);

      await this.play();

      return;
    }

    await this.next();
  }
}

export const localMediaPlayer =
  new LocalMediaPlayer();