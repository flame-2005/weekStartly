"use client"

import React, { useState } from "react"
import Modal from "../modal/page"
import AddEventModal from "./addEvent/page"
import { Holiday } from "@/constants/calender"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Star, Gift } from "lucide-react"

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
    const [isCustomEvent, setIsCustomEvent] = useState<boolean>(false);

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
        const date = new Date(year, month, day)
        const dd = String(date.getDate()).padStart(2, "0")
        const mm = String(date.getMonth() + 1).padStart(2, "0")
        const yyyy = date.getFullYear()
        return `${dd}-${mm}-${yyyy}`
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const formatDate = (y: number, m: number, d: number) =>
        `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`

    return (
        <div className="max-w-4xl mx-auto">
            {/* Calendar Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-visible">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white overflow-hidden rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="md:text-2xl text-sm font-bold">
                                    {monthNames[currentMonth]} {currentYear}
                                </h1>
                                <p className="text-blue-100 md:text-sm text-xs ">
                                    Click on any date to add an event
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={goToPrevMonth}
                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 
                                         flex items-center justify-center transition-all duration-200 
                                         backdrop-blur-sm hover:scale-105"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={goToNextMonth}
                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 
                                         flex items-center justify-center transition-all duration-200 
                                         backdrop-blur-sm hover:scale-105"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Content */}
                <div className="p-6">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 mb-4 gap-1.5">
                        {dayNames.map((day, idx) => (
                            <div
                                key={day}
                                className={`text-center py-3 rounded-lg font-semibold text-sm
                                    ${idx >= 5
                                        ? "bg-red-50 text-red-600 border border-red-100"
                                        : "text-gray-700"
                                    }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty slots before the first day */}
                        {Array.from({ length: startDay }).map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className="h-12 rounded-xl bg-gray-25"
                            />
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

                            // Base classes for calendar cells
                            const baseClasses = `
                                relative h-12 rounded-xl border-2 flex flex-col justify-center items-center 
                                text-sm font-medium text-gray-700
                                transition-all duration-200
                            `

                            if (isWeekend) {
                                return (
                                    <Modal
                                        isOpen={isOpen}
                                        setIsOpen={setIsOpen}
                                        key={day}
                                        trigger={
                                            <button
                                                onClick={() => {
                                                    setIsOpen(true)
                                                    setIsCustomEvent(false)
                                                    setDate(getDateForDay(currentYear, currentMonth, day))
                                                }}
                                                className={`${baseClasses} cursor-pointer group hover:scale-105
                                                            hover:shadow-lg transform-gpu ${isToday
                                                        ? "bg-gradient-to-br from-red-500 to-pink-600 text-white border-red-500 shadow-lg"
                                                        : "bg-gradient-to-br from-red-50 to-pink-50 text-red-600 border-red-200 hover:from-red-100 hover:to-pink-100"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center w-full">
                                                    <span className={`text-lg font-bold ${isToday ? 'text-white' : 'text-red-600'}`}>
                                                        {day}
                                                    </span>
                                                    {isToday && (
                                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-center w-full">
                                                    {holiday && (
                                                        <div className="group/tooltip relative">
                                                            <div className="flex items-center space-x-1 bg-white/90 border-red-600 border-2 backdrop-blur-sm px-2 py-1 rounded-full">
                                                                <Gift className="w-3 h-3 text-red-600" />
                                                                <span className="text-xs font-light text-red-600 truncate max-w-[60px]">
                                                                    {holiday.title.length > 8 ? holiday.title.slice(0, 6) + "…" : holiday.title}
                                                                </span>
                                                            </div>

                                                            {/* Enhanced Tooltip */}
                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                                                                          hidden group-hover/tooltip:block z-20">
                                                                <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg 
                                                                              shadow-lg whitespace-nowrap border border-gray-700">
                                                                    {holiday.title}
                                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                                                                                  border-4 border-transparent border-t-gray-900"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="opacity-0 absolute group-hover:opacity-100 transition-opacity duration-200">
                                                        <Plus className={`w-4 h-4 ${isToday ? 'text-white' : 'text-red-500'}`} />
                                                    </div>
                                                </div>
                                            </button>
                                        }
                                    >
                                        <AddEventModal
                                            setIsOpen={setIsOpen}
                                            date={date}
                                            setDate={setDate}
                                            isCustomEvent={isCustomEvent}
                                        />
                                    </Modal>
                                )
                            }

                            // Normal weekday cell
                            return (
                                <div
                                    key={day}
                                    className={`${baseClasses} ${isToday
                                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-500 shadow-lg"
                                        : "bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:from-blue-50 hover:to-purple-50 hover:border-blue-200"
                                        }`}
                                >
                                    <div className="flex items-center justify-center w-full">
                                        <span className={`text-lg font-bold ${isToday ? 'text-white' : 'text-gray-700'}`}>
                                            {day}
                                        </span>
                                        {isToday && (
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                        )}
                                    </div>

                                    <div className="flex items-center justify-center w-full">
                                        {holiday && (
                                            <div className="group/tooltip relative">
                                                <div className="flex items-center space-x-1 bg-red-500 text-white border-white border-2 px-2 py-1 rounded-full">
                                                    <Gift className="w-3 h-3" />
                                                    <span className="text-xs font-medium truncate max-w-[60px]">
                                                        {holiday.title.length > 8 ? holiday.title.slice(0, 6) + "…" : holiday.title}
                                                    </span>
                                                </div>

                                                {/* Enhanced Tooltip */}
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                                                              hidden group-hover/tooltip:block z-50">
                                                    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg 
                                                                  shadow-lg whitespace-nowrap border border-gray-700">
                                                        {holiday.title}
                                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                                                                      border-4 border-transparent border-t-gray-900"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Add Custom Event Button */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <Modal
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            trigger={
                                <button
                                    onClick={() => {
                                        setIsOpen(true)
                                        setDate("")
                                        setIsCustomEvent(true)
                                    }}
                                    className="w-full flex items-center justify-center space-x-3 
                                             bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                                             py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 
                                             transition-all duration-200 font-medium shadow-lg 
                                             hover:shadow-xl transform hover:scale-[1.02]"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add Custom Event</span>
                                    <Star className="w-4 h-4 opacity-70" />
                                </button>
                            }
                        >
                            <AddEventModal
                                setIsOpen={setIsOpen}
                                date={date}
                                setDate={setDate}
                                isCustomEvent={isCustomEvent}
                            />
                        </Modal>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Calendar