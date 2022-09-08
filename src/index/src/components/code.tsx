import React from "react";
import { ReactNode } from "react";
import clsx from "clsx";

export function Code({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <code className={clsx("bg-dark text-white p-2 rounded w-100", className)}>
            < pre className="mb-0" > {children}</pre >
        </code >
    );
}
