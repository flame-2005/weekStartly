"use client"

import Calendar from "@/components/calender/page"
import { Events } from "@/components/events/page"
import WeeklyEventsList from "@/components/events/weeklyEventList/page"
import { useHolidays } from "@/context/HolidayContext"

export default function Home() {
  const { state } = useHolidays()
  const holidays = state.holidays

  return (
    <div className="container mx-auto">
      <div className="w-[100%] bg-blue-600 p-4 mb-4 flex items-center">
        <h1 className="text-white text-2xl font-bold px-4">Weekendly your very own personalize weekend planner
        </h1>
      </div>
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
