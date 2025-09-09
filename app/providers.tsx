"use client";

import { SessionProvider } from "next-auth/react";
import { EventProvider } from "@/context/EventContext";
import { HolidayProvider } from "@/context/HolidayContext";
import { ToastProvider } from "@/context/toastContest";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <EventProvider>
                <HolidayProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </HolidayProvider>
            </EventProvider>
        </SessionProvider>
    );
}