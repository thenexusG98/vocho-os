import type {
  MediaState,
  Track,
} from "../../types/media";

import type { MediaPlayer } from "./MediaPlayer";

const tracks: Track[] = [
  {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    cover: "https://picsum.photos/500/500?random=1",
    duration: 354,
    source: "local",
  },
  {
    id: "2",
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    cover: "https://picsum.photos/500/500?random=2",
    duration: 391,
    source: "local",
  },
  {
    id: "3",
    title: "Everlong",
    artist: "Foo Fighters",
    album: "The Colour and the Shape",
    cover: "https://picsum.photos/500/500?random=3",
    duration: 250,
    source: "spotify",
  },
  {
    id: "4",
    title: "Back in Black",
    artist: "AC/DC",
    album: "Back in Black",
    cover: "https://picsum.photos/500/500?random=4",
    duration: 255,
    source: "spotify",
  },
];

class MockMediaPlayer implements MediaPlayer {
  private state: MediaState = {
    currentTrack: tracks[0],
    playlist: tracks,
    position: 0,
    volume: 70,
    playbackState: "paused",
    shuffle: false,
    repeat: false,
    source: "local",
  };

  private listeners: Array<
    (state: MediaState) => void
  > = [];

  private timer: number | null = null;

  subscribe(
    listener: (state: MediaState) => void
  ) {
    this.listeners.push(listener);

    listener(this.state);

    return () => {
      this.listeners =
        this.listeners.filter(
          (item) => item !== listener
        );
    };
  }

  private notify() {
    const state = {
      ...this.state,
      playlist: [...this.state.playlist],
    };

    this.listeners.forEach((listener) => {
      listener(state);
    });
  }

  async play() {
    if (!this.state.currentTrack) {
      return;
    }

    this.state.playbackState = "playing";

    this.startTimer();

    this.notify();
  }

  async pause() {
    this.state.playbackState = "paused";

    this.stopTimer();

    this.notify();
  }

  async next() {
    const currentIndex =
      this.state.playlist.findIndex(
        (track) =>
          track.id ===
          this.state.currentTrack?.id
      );

    let nextIndex = currentIndex + 1;

    if (this.state.shuffle) {
      nextIndex = Math.floor(
        Math.random() *
          this.state.playlist.length
      );
    }

    if (
      nextIndex >=
      this.state.playlist.length
    ) {
      nextIndex = this.state.repeat
        ? 0
        : currentIndex;
    }

    if (nextIndex === currentIndex) {
      await this.pause();
      return;
    }

    this.state.currentTrack =
      this.state.playlist[nextIndex];

    this.state.position = 0;

    this.notify();
  }

  async previous() {
    if (this.state.position > 5) {
      this.state.position = 0;

      this.notify();

      return;
    }

    const currentIndex =
      this.state.playlist.findIndex(
        (track) =>
          track.id ===
          this.state.currentTrack?.id
      );

    let previousIndex = currentIndex - 1;

    if (previousIndex < 0) {
      previousIndex =
        this.state.playlist.length - 1;
    }

    this.state.currentTrack =
      this.state.playlist[previousIndex];

    this.state.position = 0;

    this.notify();
  }

  async seek(position: number) {
    if (!this.state.currentTrack) {
      return;
    }

    this.state.position = Math.max(
      0,
      Math.min(
        position,
        this.state.currentTrack.duration
      )
    );

    this.notify();
  }

  async setVolume(volume: number) {
    this.state.volume = Math.max(
      0,
      Math.min(volume, 100)
    );

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

  async selectTrack(track: Track) {
    this.state.currentTrack = track;
    this.state.position = 0;
    this.state.source = track.source;

    this.notify();
  }

  getState() {
    return this.state;
  }

  private startTimer() {
    if (this.timer !== null) {
      return;
    }

    this.timer = window.setInterval(() => {
      if (
        this.state.playbackState !==
          "playing" ||
        !this.state.currentTrack
      ) {
        return;
      }

      this.state.position++;

      if (
        this.state.position >=
        this.state.currentTrack.duration
      ) {
        void this.next();

        return;
      }

      this.notify();
    }, 1000);
  }

  private stopTimer() {
    if (this.timer !== null) {
      window.clearInterval(
        this.timer
      );

      this.timer = null;
    }
  }
}

export const mediaPlayer =
  new MockMediaPlayer();