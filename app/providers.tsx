"use client";

import { SessionProvider } from "next-auth/react";
import { EventProvider } from "@/context/EventContext";
import { HolidayProvider } from "@/context/HolidayContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <EventProvider>
        <HolidayProvider>
          {children}
        </HolidayProvider>
      </EventProvider>
    </SessionProvider>
  );
}