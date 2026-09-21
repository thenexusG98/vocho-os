interface Props {
    title: string;
    value: string;
    icon: string;
}

export default function StatusCard({ title, value, icon }: Props) {
    return (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
            <div className="text-2xl">{icon}</div>

            <div className="text-zinc-500 text-sm mt-2">
                {title}
            </div>

            <div className="text-2xl font-bold mt-1">
                {value}
            </div>
        </div>
    );
}