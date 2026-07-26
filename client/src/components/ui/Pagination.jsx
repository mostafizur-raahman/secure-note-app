import React from "react";
import Btn from "./Button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <Btn
                variant="ghost"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}>
                Prev
            </Btn>
            <span className="text-xs text-[#a3a3a3]">
                Page {currentPage} of {totalPages}
            </span>
            <Btn
                variant="ghost"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}>
                Next
            </Btn>
        </div>
    );
}
