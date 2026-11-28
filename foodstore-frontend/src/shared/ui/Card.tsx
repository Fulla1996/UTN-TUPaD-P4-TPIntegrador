import type { ReactNode } from "react";

interface CardProps {
    title?: string;
    description?: string;
    children?: ReactNode;
    footer?: ReactNode;
    className?: string;
}

function Card({
    title,
    description,
    children,
    footer,
    className = "",
}: CardProps) {
    return (
        <article
            className={`rounded-lg border border-border bg-surface p-4 shadow-sm ${className}`}
        >
            {(title || description) && (
                <header>
                    {title && (
                        <h3 className="text-lg font-semibold text-foreground">
                            {title}
                        </h3>
                    )}

                    {description && (
                        <p className="mt-2 text-sm text-muted">
                            {description}
                        </p>
                    )}
                </header>
            )}

            {children}

            {footer && (
                <footer className="mt-4">
                    {footer}
                </footer>
            )}
        </article>
    );
}

export default Card;