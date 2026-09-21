interface Props {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function MenuButton({ icon, label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center
      min-w-[90px] h-[75px] rounded-xl
      transition
      ${active 
      ? 'bg-red-700' 
      : 'bg-zinc-900 hover:bg-zinc-800'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm mt-1">{label}</span>
    </button>
  );
}