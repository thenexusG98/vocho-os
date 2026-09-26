import type { Track } from "../../types/media";

interface Props {
  tracks: Track[];
  currentTrack: Track | null;
  onSelect: (track: Track) => void;
}

export default function MediaLibrary({
  tracks,
  currentTrack,
  onSelect,
}: Props) {
  return (
    <div className="space-y-2">
      {tracks.map((track) => {
        const selected =
          currentTrack?.id === track.id;

        return (
          <button
            key={track.id}
            onClick={() => onSelect(track)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition ${
              selected
                ? "bg-red-600/20 border border-red-600/40"
                : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
            }`}
          >
            <img
              src={track.cover}
              alt={track.album}
              className="w-14 h-14 rounded-lg object-cover"
            />

            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">
                {track.title}
              </div>

              <div className="text-sm text-zinc-500 truncate">
                {track.artist}
              </div>

              <div className="text-xs text-zinc-600 truncate">
                {track.album}
              </div>
            </div>

            <div className="text-xs text-zinc-500">
              {track.source === "spotify"
                ? "SPOTIFY"
                : "LOCAL"}
            </div>
          </button>
        );
      })}
    </div>
  );
}