import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";

export default function Toast() {
    const mensaje = useNotificationStore((state) => state.message);
    const visible = useNotificationStore((state) => state.visible);
    const hideNotification = useNotificationStore(
        (state) => state.hideNotification
    );

    useEffect(() => {
        if (!visible) return;

        const timeout = setTimeout(() => {
            hideNotification();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [visible, mensaje, hideNotification]);

    if (!visible || !mensaje) return null;

    return (
        <div className="fixed right-6 top-6 z-50">
            <div className="rounded-lg border border-border bg-surface px-5 py-4 text-foreground shadow-lg">
                <p className="font-medium">
                    {mensaje}
                </p>
            </div>
        </div>
    );
}