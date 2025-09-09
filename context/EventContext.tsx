"use client"

import React, { createContext, useReducer, useContext, ReactNode, useEffect } from "react"
import { EventType, EventActionType } from "@/constants/event"

type State = {
  events: EventType[]
}

type Action =
  | { type: EventActionType.ADD; payload: EventType }
  | { type: EventActionType.REMOVE; payload: string }
  | { type: EventActionType.UPDATE; payload: EventType }
  | { type: EventActionType.UPDATE_ORDER; payload: EventType[] }

const initialState: State = {
  events: [],
}

function eventReducer(state: State, action: Action): State {
  switch (action.type) {
    case EventActionType.ADD:
      return { ...state, events: [...state.events, action.payload] }
    case EventActionType.REMOVE:
      return { ...state, events: state.events.filter((e) => e.id !== action.payload) }
    case EventActionType.UPDATE:
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      }
    case EventActionType.UPDATE_ORDER:
      return { ...state, events: action.payload }
    default:
      return state
  }
}

// Context
const EventContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | null>(null)

// Provider
export function EventProvider({ children }: { children: ReactNode }) {
  const storedEvents =
    typeof window !== "undefined"
      ? localStorage.getItem("events")
      : null

  const [state, dispatch] = useReducer(
    eventReducer,
    storedEvents ? { events: JSON.parse(storedEvents) } : initialState
  )

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(state.events))
  }, [state.events])

  return (
    <EventContext.Provider value={{ state, dispatch }}>
      {children}
    </EventContext.Provider>
  )
}

// Hook to use events
export function useEvents() {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
}
