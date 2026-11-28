import type { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
    header?: ReactNode;
    sidebar?: ReactNode;
    footer?: ReactNode;
    className?: string;
}

function Layout({
    children,
    header,
    sidebar,
    footer,
    className = "",
}: LayoutProps) {
    return (
        <div className={`flex min-h-screen flex-col bg-background ${className}`}>
            {header}

            <div className="flex flex-1">
                {sidebar}

                <main className="min-w-0 flex-1">
                    {children}
                </main>
            </div>

            {footer}
        </div>
    );
}

export default Layout;