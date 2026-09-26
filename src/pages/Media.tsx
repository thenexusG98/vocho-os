import MediaCenter from "../components/media/MediaCenter";

interface MediaProps {
  onBackToDashboard: () => void;
}

export default function Media({
  onBackToDashboard,
}: MediaProps) {
  return (
    <MediaCenter
      onBack={onBackToDashboard}
    />
  );
}