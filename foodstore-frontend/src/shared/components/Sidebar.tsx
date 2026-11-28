import type { ReactNode } from "react";

interface SidebarProps {
    children: ReactNode;
    title?: string;
    header?: ReactNode;
    footer?: ReactNode;
    className?: string;
}

function Sidebar({
    children,
    title,
    header,
    footer,
    className = "",
}: SidebarProps) {
    return (
        <aside
            className={`flex w-64 shrink-0 flex-col border-r border-border bg-surface ${className}`}
        >
            {(title || header) && (
                <div className="border-b border-border p-5">
                    {title && (
                        <h2 className="text-lg font-semibold text-foreground">
                            {title}
                        </h2>
                    )}

                    {header}
                </div>
            )}

            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {children}
            </nav>

            {footer && (
                <div className="border-t border-border p-4">
                    {footer}
                </div>
            )}
        </aside>
    );
}

export default Sidebar;