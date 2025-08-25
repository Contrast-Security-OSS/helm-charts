import React from "react";
import { ReactNode } from "react";
import clsx from 'clsx';

export function Cell({ label, children, className, title }: { label: string, children: ReactNode, className?: string, title?: string }) {
    return (
        <div className={clsx("d-flex flex-column", className)} title={title}>
            <div className='text-muted' style={{ fontSize: "0.8rem" }}>{label}</div>
            <div>{children}</div>
        </div>
    )
}
