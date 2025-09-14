"use client"

import Calendar from "@/components/calender/page"
import { Events } from "@/components/events/page"
import WeeklyEventsList from "@/components/events/weeklyEventList/page"
import Navbar from "@/components/navbar/page"
import { useHolidays } from "@/context/HolidayContext"

export default function Home() {
  const { state } = useHolidays()
  const holidays = state.holidays

  return (
    <div className="container mx-auto">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-10 min-h-screen bg-gray-100">
        <div className="md:col-span-6 p-4 order-2 md:order-1">
          <Events />
        </div>

        <div className="md:col-span-4 p-4 order-1 md:order-2">
          <Calendar holidays={holidays} />
          <WeeklyEventsList />
        </div>
      </div>
    </div>
  )
}
