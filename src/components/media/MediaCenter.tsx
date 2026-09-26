import { useEffect, useState } from "react";

import type {
  MediaSourceType,
  MediaState,
} from "../../types/media";

import { localMediaPlayer } from "../../services/media/LocalMediaPlayer";

import MediaControls from "./MediaControls";
import MediaLibrary from "./MediaLibrary";
import SourceSelector from "./SourceSelector";

interface Props {
  onBack: () => void;
}

export default function MediaCenter({
  onBack,
}: Props) {
  const [state, setState] =
    useState<MediaState>(
      localMediaPlayer.getState()
    );

  useEffect(() => {
    return localMediaPlayer.subscribe(
      setState
    );
  }, []);

  const track = state.currentTrack;

  if (!track) {
    return null;
  }

  function changeSource(
    source: MediaSourceType
  ) {
    console.log(
      "Media source:",
      source
    );

    /*
     * Por ahora solamente cambiamos
     * la fuente visualmente.
     *
     * Posteriormente:
     *
     * Spotify
     * Bluetooth
     * USB
     * Local
     */
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}

      <header className="h-20 border-b border-zinc-800 px-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-600">
            VOCHO OS
          </p>

          <h1 className="text-2xl font-bold">
            Media Center
          </h1>
        </div>

        <button
          onClick={onBack}
          className="rounded-xl bg-zinc-900 px-4 py-2 hover:bg-zinc-800"
        >
          ← Dashboard
        </button>
      </header>

      {/* CONTENT */}

      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PLAYER */}

          <section className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            <div className="flex flex-col items-center justify-center">
              <img
                src={track.cover}
                alt={track.album}
                className="w-64 h-64 rounded-2xl object-cover shadow-2xl"
              />

              <div className="text-center mt-6">
                <h2 className="text-2xl font-bold">
                  {track.title}
                </h2>

                <p className="text-zinc-400 mt-1">
                  {track.artist}
                </p>

                <p className="text-sm text-zinc-600">
                  {track.album}
                </p>
              </div>

              <div className="w-full max-w-2xl mt-8">
                <MediaControls
                  track={track}
                  position={state.position}
                  volume={state.volume}
                  playing={
                    state.playbackState ===
                    "playing"
                  }
                  shuffle={state.shuffle}
                  repeat={state.repeat}
                  onPlayPause={() => {
                    if (
                      state.playbackState ===
                      "playing"
                    ) {
                      void localMediaPlayer.pause();
                    } else {
                      void localMediaPlayer.play();
                    }
                  }}
                  onNext={() =>
                    void localMediaPlayer.next()
                  }
                  onPrevious={() =>
                    void localMediaPlayer.previous()
                  }
                  onSeek={(position) =>
                    void localMediaPlayer.seek(
                      position
                    )
                  }
                  onVolume={(volume) =>
                    void localMediaPlayer.setVolume(
                      volume
                    )
                  }
                  onShuffle={() =>
                    void localMediaPlayer.toggleShuffle()
                  }
                  onRepeat={() =>
                    void localMediaPlayer.toggleRepeat()
                  }
                />
              </div>
            </div>
          </section>

          {/* LIBRARY */}

          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-lg font-bold mb-4">
              Biblioteca
            </h2>

            <MediaLibrary
              tracks={state.playlist}
              currentTrack={track}
              onSelect={(selected) =>
                void localMediaPlayer.selectTrack(
                  selected
                )
              }
            />
          </section>
        </div>

        {/* SOURCES */}

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="text-lg font-bold mb-4">
            Fuente de audio
          </h2>

          <SourceSelector
            source={state.source}
            onChange={changeSource}
          />
        </section>
      </main>

      {/* FOOTER */}

      <footer className="h-14 border-t border-zinc-800 flex items-center justify-center">
        <span className="text-xs text-zinc-600">
          VOCHO OS • MEDIA SYSTEM • DEV MODE
        </span>
      </footer>
    </div>
  );
}