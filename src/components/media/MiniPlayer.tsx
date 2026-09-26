import { useEffect, useState } from "react";

import type { MediaState } from "../../types/media";

import { localMediaPlayer } from "../../services/media/LocalMediaPlayer";

interface Props {
  onOpen: () => void;
}

export default function MiniPlayer({
  onOpen,
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

  const playing =
    state.playbackState === "playing";

  return (
    <div
      className="fixed bottom-5 left-5 right-5 md:left-auto md:w-[420px] z-50"
    >
      <div
        className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl p-3 shadow-2xl"
      >
        <button
          onClick={onOpen}
          className="flex items-center gap-3 min-w-0 flex-1 text-left"
        >
          <img
            src={track.cover}
            alt={track.title}
            className="w-12 h-12 rounded-xl object-cover"
          />

          <div className="min-w-0">
            <div className="font-semibold truncate">
              {track.title}
            </div>

            <div className="text-xs text-zinc-500 truncate">
              {track.artist}
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            if (playing) {
              void localMediaPlayer.pause();
            } else {
              void localMediaPlayer.play();
            }
          }}
          className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center"
        >
          {playing ? "⏸" : "▶"}
        </button>

        <button
          onClick={() =>
            void localMediaPlayer.next()
          }
          className="text-xl"
        >
          ⏭
        </button>
      </div>
    </div>
  );
}
