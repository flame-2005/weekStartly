"use client"

import React from "react"
import EventList from "./eventList/page"
import { useEvents } from "@/context/EventContext"

export const Events = () => {

    const { state } = useEvents()

  return (
    <section className="p-4 max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Your Weekend Events</h2>
      <EventList events={state.events} />
    </section>
  )
}
