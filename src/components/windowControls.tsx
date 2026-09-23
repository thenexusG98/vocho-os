import type { windowSide } from "../types/windows"

interface Props {
    side: windowSide
    position: number
    onUp: () => void
    onDown: () => void
    onFullyDown: () => void
    onFullyUp: () => void
}

export default function WindowControls({
    side,
    position,
    onUp,
    onDown,
    onFullyDown,
    onFullyUp,
}: Props) {

    const name = 
    side === "driver"
    ? "Vidrio piloto"
    : "Vidrio copiloto"

    return (
        <div className="absolute bottom-6
        z-10
        left-1/2
        -translate-x-1/2
        bg-zinc-900
        border
        border-zinc-700
        rounded-2xl
        p-5
        w-[280px]
        text-white
        ">
            <div className="text-center">
                <div className="text-sm text-zinc-500">ventana</div>
                <div className="text-xl font-bold">{name}</div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between text-xs text-zinc-500">
                    <span>Abajo</span>
                    <span>{position}%</span>
                    <span>Arriba</span>
                </div>

                <div className="
                mt-2
                w-full
                h-2
                bg-zinc-700
                rounded-full
                overflow-hidden
                ">
                    <div className="h-full bg-red-600 transition-all" 
                    style={{ width: `${position}%` }}>

                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                    <button
                    className="
                    bg-zinc-800
                    hover:bg-zinc-700
                    rounded-xl
                    text-2xl
                    h-14
                    "
                    onClick={onDown}
                    >
                        ↓
                    </button>
                    <button
                    className="
                    bg-zinc-800
                    hover:bg-zinc-700
                    rounded-xl
                    text-2xl
                    h-14
                    "
                    onClick={onUp}
                    >
                        ↑
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                    <button
                    className="
                    bg-zinc-800
                    hover:bg-zinc-700
                    rounded-xl
                    text-sm
                    h-10
                    "
                    onClick={onFullyDown}
                    >
                        Bajar completamente
                    </button>
                    <button
                    className="
                    bg-zinc-800
                    hover:bg-zinc-700
                    rounded-xl
                    text-sm
                    h-10
                    "
                    onClick={onFullyUp}
                    >
                        Subir completamente
                    </button>
                </div>
            </div>
        </div>
    )
}