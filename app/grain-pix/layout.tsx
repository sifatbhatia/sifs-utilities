"use client";

import { GrainProvider } from "./GrainContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <GrainProvider>
            {children}
        </GrainProvider>
    );
}
