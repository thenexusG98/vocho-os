import type { Track } from "../../types/media";

interface Props {
  track: Track;
  position: number;
  volume: number;
  playing: boolean;
  shuffle: boolean;
  repeat: boolean;

  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
  onVolume: (volume: number) => void;
  onShuffle: () => void;
  onRepeat: () => void;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(
    seconds / 60
  );

  const secs = Math.floor(
    seconds % 60
  );

  return `${minutes}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export default function MediaControls({
  track,
  position,
  volume,
  playing,
  shuffle,
  repeat,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolume,
  onShuffle,
  onRepeat,
}: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500">
          {formatTime(position)}
        </span>

        <input
          type="range"
          min={0}
          max={track.duration}
          value={position}
          onChange={(event) =>
            onSeek(
              Number(event.target.value)
            )
          }
          className="flex-1 accent-red-600"
        />

        <span className="text-xs text-zinc-500">
          {formatTime(track.duration)}
        </span>
      </div>

      <div className="flex items-center justify-center gap-8 mt-6">
        <button
          onClick={onShuffle}
          className={`text-xl ${
            shuffle
              ? "text-red-600"
              : "text-zinc-500"
          }`}
        >
          🔀
        </button>

        <button
          onClick={onPrevious}
          className="text-2xl hover:text-red-500"
        >
          ⏮
        </button>

        <button
          onClick={onPlayPause}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-2xl"
        >
          {playing ? "⏸" : "▶"}
        </button>

        <button
          onClick={onNext}
          className="text-2xl hover:text-red-500"
        >
          ⏭
        </button>

        <button
          onClick={onRepeat}
          className={`text-xl ${
            repeat
              ? "text-red-600"
              : "text-zinc-500"
          }`}
        >
          🔁
        </button>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <span>🔊</span>

        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(event) =>
            onVolume(
              Number(event.target.value)
            )
          }
          className="flex-1 accent-red-600"
        />

        <span className="text-xs text-zinc-500 w-10">
          {volume}%
        </span>
      </div>
    </div>
  );
}