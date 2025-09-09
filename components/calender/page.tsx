"use client"

import React, { useState } from "react"
import Modal from "../modal/page"
import AddEventModal from "./addEvent/page"
import { Holiday } from "@/constants/calender"

type CalendarProps = {
    year?: number
    month?: number
    holidays?: Holiday[]
}

const Calendar: React.FC<CalendarProps> = ({ year, month, holidays = [] }) => {
    const today = new Date()
    const [currentYear, setCurrentYear] = useState<number>(year ?? today.getFullYear())
    const [currentMonth, setCurrentMonth] = useState<number>(month ?? today.getMonth())
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [date, setDate] = useState<string>("");


    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)

    const daysInMonth = lastDayOfMonth.getDate()
    let startDay = firstDayOfMonth.getDay()

    startDay = (startDay + 6) % 7

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    const goToPrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentYear((y) => y - 1)
            setCurrentMonth(11)
        } else {
            setCurrentMonth((m) => m - 1)
        }
    }

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentYear((y) => y + 1)
            setCurrentMonth(0)
        } else {
            setCurrentMonth((m) => m + 1)
        }
    }

    const getDateForDay = (year: number, month: number, day: number) => {
        const date = new Date(year, month, day) // JS Date for that day
        const dd = String(date.getDate()).padStart(2, "0")
        const mm = String(date.getMonth() + 1).padStart(2, "0") // month is 0-indexed
        const yyyy = date.getFullYear()
        return `${dd}-${mm}-${yyyy}` // dd-mm-yyyy format
    }




    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    // Utility: format date as YYYY-MM-DD
    const formatDate = (y: number, m: number, d: number) =>
        `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`

    return (
        <div className="p-4 max-w-xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={goToPrevMonth}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                >
                    ←
                </button>
                <h2 className="text-lg font-semibold">
                    {monthNames[currentMonth]} {currentYear}
                </h2>
                <button
                    onClick={goToNextMonth}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                >
                    →
                </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 text-center font-medium text-gray-600">
                {dayNames.map((day, idx) => (
                    <div
                        key={day}
                        className={idx >= 5 ? "text-red-500 font-bold" : ""}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Dates grid */}
            <div className="grid grid-cols-7 text-center mt-2">
                {/* Empty slots before the first day */}
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {/* Days */}
                {daysArray.map((day) => {
                    const isToday =
                        day === today.getDate() &&
                        currentMonth === today.getMonth() &&
                        currentYear === today.getFullYear()

                    const weekday = (startDay + day - 1) % 7
                    const isWeekend = weekday === 5 || weekday === 6

                    const dateStr = formatDate(currentYear, currentMonth, day)
                    const holiday = holidays.find((h) => h.date === dateStr)

                    // Shared classes
                    const baseClasses =
                        "relative p-2 border rounded m-1 flex flex-col items-center transition"

                    if (isWeekend) {
                        return (

                            <Modal
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                key={day}
                                trigger={
                                    <button
                                        key={day}
                                        onClick={() => {
                                            setIsOpen(true)
                                            setDate(getDateForDay(currentYear, currentMonth, day))
                                        }}
                                        className={`${baseClasses} text-red-600 font-semibold hover:bg-red-500 hover:text-white`}
                                    >
                                        {day}
                                        {holiday && (
                                            <div className="absolute bottom-1 right-1 group">
                                                {/* Holiday Badge */}
                                                <span className="bg-red-500 text-white text-[10px] px-1 rounded cursor-pointer group-hover:bg-red-600 transition">
                                                    {holiday.title.length > 6 ? holiday.title.slice(0, 6) + "…" : holiday.title}
                                                </span>

                                                {/* Tooltip */}
                                                <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                                                    {holiday.title}
                                                </div>
                                            </div>
                                        )}

                                    </button>
                                }
                            >
                                <AddEventModal
                                    setIsOpen={setIsOpen}
                                    date={date}
                                    setDate={setDate}
                                />
                            </Modal>

                        )
                    }

                    // Normal weekday cell
                    return (
                        <div
                            key={day}
                            className={`${baseClasses} ${isToday ? "bg-blue-500 text-white font-bold" : "bg-white"
                                }`}
                        >
                            {day}

                            {holiday && (
                                <div className="absolute bottom-1 right-1 group">
                                    <span className="bg-red-500 text-white text-[10px] px-1 rounded cursor-pointer group-hover:bg-red-600 transition">
                                        {holiday.title.length > 6 ? holiday.title.slice(0, 6) + "…" : holiday.title}
                                    </span>
                                    <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                                        {holiday.title}
                                    </div>
                                </div>
                            )}

                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default Calendar
