import { useThemeStore } from "@/store/themeStore";

function ThemeToggle() {
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    return (
        <button
            type="button"
            onClick={toggleTheme}
            title={theme === "light" ? "Modo oscuro" : "Modo claro"}
            aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
            className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-background"
        >
            {theme === "light" ? "🌙" : "☀️"}
        </button>
    );
}

export default ThemeToggle;