"use client"

import React from "react"
import { useEvents } from "@/context/EventContext"
import EventItem from "../eventItems/page"

const WeeklyEventsList: React.FC = () => {
  const { state } = useEvents()
  const events = state.events

  // Get current week's start (Monday) and end (Sunday)
  const today = new Date()
  const dayOfWeek = today.getDay() // Sunday = 0, Monday = 1, ...
  const diffToMonday = (dayOfWeek + 6) % 7 // shift so Monday is start
  const monday = new Date(today)
  monday.setDate(today.getDate() - diffToMonday)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  // Filter events that fall within this week
  const weeklyEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate >= monday && eventDate <= sunday
  })

  return (
    <section className="p-4 max-w-xl max-h-[25vh] mx-auto">
      <h2 className="text-xl font-bold mb-4">This Week&apos;s Plans</h2>

      {weeklyEvents.length === 0 ? (
        <p className="text-gray-500 text-sm">
          🎉 No plans this week yet — time to add some!
        </p>
      ) : (
        <div className="space-y-3">
          {weeklyEvents
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((event) => (
              <EventItem
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                eventType={event.activity}
                mood={event.mood}
                theme={event.theme}
              />
            ))}
        </div>
      )}
    </section>
  )
}

export default WeeklyEventsList
