interface BadgeEstadoProps {
    texto: string;
    variante?: "success" | "warning" | "danger" | "info" | "neutral";
    className?: string;
}

const variantes = {
    success: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    danger: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    neutral: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

function BadgeEstado({
    texto,
    variante = "neutral",
    className = "",
}: BadgeEstadoProps) {
    return (
        <span
            className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${variantes[variante]} ${className}`}
        >
            {texto}
        </span>
    );
}

export default BadgeEstado;