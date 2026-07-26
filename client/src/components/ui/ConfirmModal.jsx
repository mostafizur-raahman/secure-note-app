import React from "react";
import Btn from "./Button";

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
            }}>
            <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-6 max-w-sm w-full mx-4 anim-fadeIn">
                <h3 className="text-base font-medium mb-2">{title}</h3>
                <p className="text-sm text-[#a3a3a3] mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <Btn variant="secondary" size="sm" onClick={onCancel}>
                        Cancel
                    </Btn>
                    <Btn variant="danger" size="sm" onClick={onConfirm}>
                        Delete
                    </Btn>
                </div>
            </div>
        </div>
    );
}
