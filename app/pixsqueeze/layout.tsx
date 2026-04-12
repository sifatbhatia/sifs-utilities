"use client";

import { PixProvider } from "./PixContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <PixProvider>
            {children}
        </PixProvider>
    );
}
