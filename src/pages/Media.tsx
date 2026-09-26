import MediaCenter from "../components/media/MediaCenter";
import type { AppScreen } from "../types/navigation";

interface MediaProps {
  onNavigate: (screen: AppScreen) => void;
}

export default function Media({
  onNavigate,
}: MediaProps) {
  return (
    <MediaCenter
      onBack={() => onNavigate("dashboard")}
    />
  );
}