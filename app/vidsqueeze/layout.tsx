"use client";

import { VidProvider } from "./VidContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <VidProvider>
            {children}
        </VidProvider>
    );
}
