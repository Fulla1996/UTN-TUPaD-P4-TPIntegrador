import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
    label: string;
    to: string;
    icon?: ReactNode;
    end?: boolean;
    className?: string;
}

function SidebarItem({
    label,
    to,
    icon,
    end = false,
    className = "",
}: SidebarItemProps) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                        ? "bg-primary text-white"
                        : "text-muted hover:bg-background hover:text-foreground"
                } ${className}`
            }
        >
            {icon && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                    {icon}
                </span>
            )}

            <span>{label}</span>
        </NavLink>
    );
}

export default SidebarItem;