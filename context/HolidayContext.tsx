"use client"

import { GoogleCalendarEvent, Holiday } from "@/constants/calender"
import React, { createContext, useContext, ReactNode, useEffect } from "react"

type State = {
    holidays: Holiday[]
    loading: boolean
    error: string | null
}

type Action =
    | { type: "SET_HOLIDAYS"; payload: Holiday[] }
    | { type: "CLEAR_HOLIDAYS" }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }

const initialState: State = {
    holidays: [],
    loading: false,
    error: null,
}

function holidayReducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_HOLIDAYS":
            return { ...state, holidays: action.payload, loading: false, error: null }
        case "CLEAR_HOLIDAYS":
            return { ...state, holidays: [], error: null }
        case "SET_LOADING":
            return { ...state, loading: action.payload }
        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false }
        default:
            return state
    }
}

// Context
const HolidayContext = createContext<{
    state: State
    dispatch: React.Dispatch<Action>
} | null>(null)

// Provider
export function HolidayProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = React.useReducer(holidayReducer, initialState)

    useEffect(() => {
        const fetchHolidays = async () => {
            dispatch({ type: "SET_LOADING", payload: true })
            dispatch({ type: "SET_ERROR", payload: null })

            try {
                const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

                // Use the correct calendar ID format
                const CALENDAR_ID = encodeURIComponent("en.indian#holiday@group.v.calendar.google.com");
                const now = new Date().toISOString();
                const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

                const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${now}&timeMax=${oneYearLater}&singleEvents=true&orderBy=startTime`;

                const res = await fetch(url);


                if (!res.ok) {
                    const errorText = await res.text()
                    throw new Error(`Google API error (${res.status}): ${res.statusText}. ${errorText}`)
                }

                const data: { items: GoogleCalendarEvent[] } = await res.json()

                if (!data.items) {
                    dispatch({ type: "SET_HOLIDAYS", payload: [] })
                    return
                }

                const holidays: Holiday[] = data.items.map((item) => ({
                    id: item.id,
                    title: item.summary,
                    date: item.start.date || item.start.dateTime?.split('T')[0] || "",
                }))

                dispatch({ type: "SET_HOLIDAYS", payload: holidays })

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
                dispatch({ type: "SET_ERROR", payload: errorMessage })
            }
        }

        fetchHolidays()
    }, [])

    return (
        <HolidayContext.Provider value={{ state, dispatch }}>
            {children}
        </HolidayContext.Provider>
    )
}

// Hook to use holidays
export function useHolidays() {
    const context = useContext(HolidayContext)
    if (!context) {
        throw new Error("useHolidays must be used within a HolidayProvider")
    }
    return context
}