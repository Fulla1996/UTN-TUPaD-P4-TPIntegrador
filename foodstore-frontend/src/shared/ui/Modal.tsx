import {
    useEffect,
    useRef,
    type ReactNode,
} from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    closeOnOverlay?: boolean;
    showCloseButton?: boolean;
}

const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
    closeOnOverlay = true,
    showCloseButton = true,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        previousFocusRef.current = document.activeElement as HTMLElement;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        modalRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }

            if (event.key === "Tab") {
                const focusableElements =
                    modalRef.current?.querySelectorAll<HTMLElement>(
                        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                    );

                if (!focusableElements?.length) return;

                const firstElement = focusableElements[0];
                const lastElement =
                    focusableElements[focusableElements.length - 1];

                if (
                    event.shiftKey &&
                    document.activeElement === firstElement
                ) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === lastElement
                ) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);

            previousFocusRef.current?.focus();
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(event) => {
                if (
                    closeOnOverlay &&
                    event.target === event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
                tabIndex={-1}
                className={`w-full ${sizes[size]} max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-surface shadow-xl outline-none`}
            >
                {(title || showCloseButton) && (
                    <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
                        {title && (
                            <h2
                                id="modal-title"
                                className="text-lg font-semibold text-foreground"
                            >
                                {title}
                            </h2>
                        )}

                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Cerrar modal"
                                className="rounded-md px-2 py-1 text-xl text-muted transition hover:bg-background hover:text-foreground"
                            >
                                &times;
                            </button>
                        )}
                    </header>
                )}

                <div className="p-5">
                    {children}
                </div>

                {footer && (
                    <footer className="flex flex-wrap justify-end gap-3 border-t border-border px-5 py-4">
                        {footer}
                    </footer>
                )}
            </div>
        </div>
    );
}

export default Modal;