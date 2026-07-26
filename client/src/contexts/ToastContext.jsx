import React, { createContext, useContext, useState } from "react";
const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(
            () => setToasts((prev) => prev.filter((t) => t.id !== id)),
            3500,
        );
    };

    const toast = {
        success: (msg) => addToast(msg, "success"),
        error: (msg) => addToast(msg, "error"),
        info: (msg) => addToast(msg, "info"),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div
                style={{
                    position: "fixed",
                    top: 16,
                    right: 16,
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                {toasts.map((t) => {
                    const colors =
                        t.type === "success"
                            ? {
                                  bg: "rgba(20,83,45,0.9)",
                                  border: "#16a34a",
                                  text: "#4ade80",
                              }
                            : t.type === "error"
                              ? {
                                    bg: "rgba(127,29,29,0.9)",
                                    border: "#dc2626",
                                    text: "#fca5a5",
                                }
                              : {
                                    bg: "rgba(23,23,23,0.9)",
                                    border: "#525252",
                                    text: "#d4d4d4",
                                };
                    return (
                        <div
                            key={t.id}
                            className="anim-fadeIn"
                            style={{
                                padding: "12px 16px",
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: 500,
                                background: colors.bg,
                                border: `1px solid ${colors.border}`,
                                color: colors.text,
                            }}>
                            {t.message}
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
