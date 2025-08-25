import React, { ReactNode } from "react";
import { ContrastIcons } from "../assets/references";

const ContrastLogo = () => {
    return (
        <div>
            <img className="w-100" src={ContrastIcons.ContrastLogoUrl.toString()} alt="Contrast Logo"></img>
        </div>
    );
}

const HelmLogo = () => {
    return (
        <div>
            <img className="w-100" src={ContrastIcons.HelmLogoUrl.toString()} alt="Helm Logo"></img>
        </div>
    );
}

function TopNavigation() {
    return (
        <div className="border-bottom d-flex flex-column align-items-center justify-content-center p-3">
            <div className="d-flex justify-content-center align-items-center">
                <div className="px-4" style={{ width: "300px" }}>
                    <ContrastLogo />
                </div>
                <div className="px-4 border-start" style={{ width: "150px" }}>
                    <HelmLogo />
                </div>
            </div>
            <div className="mt-1 text-muted">
                Happy sailing!
            </div>
        </div>
    );
}

export function Frame({ children }: { children: ReactNode }) {
    return (
        <div>
            <TopNavigation />
            <div className="d-flex justify-content-center">
                <div className="d-flex flex-column justify-content-center w-100" style={{ maxWidth: "720px" }}>
                    {children}
                </div>
            </div>
        </div>
    )
}
