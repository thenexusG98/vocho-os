import type {
  MediaSourceType,
} from "../../types/media";

interface Props {
  source: MediaSourceType;
  onChange: (
    source: MediaSourceType
  ) => void;
}

const sources: Array<{
  id: MediaSourceType;
  label: string;
  icon: string;
}> = [
  {
    id: "local",
    label: "Local",
    icon: "💾",
  },
  {
    id: "usb",
    label: "USB",
    icon: "🔌",
  },
  {
    id: "bluetooth",
    label: "Bluetooth",
    icon: "📱",
  },
  {
    id: "spotify",
    label: "Spotify",
    icon: "🎵",
  },
];

export default function SourceSelector({
  source,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {sources.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`p-3 rounded-xl border text-sm ${
            source === item.id
              ? "border-red-600 bg-red-600/10 text-red-500"
              : "border-zinc-800 bg-zinc-900 text-zinc-400"
          }`}
        >
          <div className="text-xl">
            {item.icon}
          </div>

          <div>{item.label}</div>
        </button>
      ))}
    </div>
  );
}