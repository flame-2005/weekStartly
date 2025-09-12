"use client"

import React, { use, useEffect, useRef, useState } from "react"
import { useEvents } from "@/context/EventContext"
import { EventActionType, EventActivityEmojis, EventActivityType, MoodType, WeekendTheme } from "@/constants/event"
import { signIn, useSession } from "next-auth/react"
import { useToast } from "@/context/toastContest"
import CircularLoader from "@/components/circularLoader/page"

type EventModalProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    date: string
    endDate?: string
    setDate: React.Dispatch<React.SetStateAction<string>>
    isCustomEvent?: boolean
    event?: {
        id: string
        title: string
        date: string
        endDate?: string
        activity: EventActivityType
        mood?: MoodType
        theme?: WeekendTheme
        end?: string
        eventId?: string
    }

}

const EventModal: React.FC<EventModalProps> = ({ setIsOpen, date, setDate, event, isCustomEvent }) => {
    const { dispatch } = useEvents()

    const [title, setTitle] = useState(event?.title || "")
    const [mood, setMood] = useState(event?.mood || "")
    const [theme, setTheme] = useState(event?.mood || "")
    const [time, setTime] = useState(event ? new Date(event.date).toISOString().slice(11, 16) : "");
    const [end, setEnd] = useState(event && event.end ? new Date(event.end).toISOString().slice(11, 16) : "");
    const [activity, setActivity] = useState<EventActivityType | "">(event?.activity || "")
    const eventIdRef = useRef<string | null>(null)
    const [saving, setSaving] = useState(false);
    const [updating, setUpdating] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        if (event) {
            setTitle(event.title)
            setTime(new Date(event.date).toISOString().slice(11, 16))
            setActivity(event.activity)
        } else {
            setTitle("")
            setTime("")
            setActivity("")
        }
    }, [event])

    useEffect(() => {
        console.log(date)
    }, [date])


    const { data: session, status } = useSession()

    if (status === "unauthenticated") {
        return <button onClick={() => signIn()}>Please signin to google account</button>;
    }

    const formatDateToDDMMYYYY = (date: string) => {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
    };

    const handleSave = async () => {
        if (!title || !date || !time || !activity) {
            alert("⚠️ Please fill out all fields before saving!")
            return
        }
        if (time >= end) {
            alert("⚠️ please select valid end time!")
            return
        }


        // Build proper date object
        const [dd, mm, yyyy] = formatDateToDDMMYYYY(date).split("-").map(Number);
        const [startHours, startMinutes] = time.split(":").map(Number);
        const [endHours, endMinutes] = end.split(":").map(Number);

        const eventDate = new Date(yyyy, mm - 1, dd, startHours, startMinutes).toISOString();
        const endDate = new Date(yyyy, mm - 1, dd, endHours, endMinutes).toISOString();


        if (event) {
            setUpdating(true);
            try {
                const res = await fetch("/api/google-calendar/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        accessToken: session?.accessToken,
                        eventId: event.eventId,
                        event: {
                            title,
                            date: eventDate,
                            activity,
                            end: endDate,
                        },
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    showToast("Event Updated in Google Calendar successfully!", "success")
                } else {
                    showToast(`Failed to update event in Google Calendar: ${data.error}`, "error");
                }
            } catch (err) {
                showToast(`Failed to update event in Google Calendar: ${err}`, "error");
            }
            dispatch({
                type: EventActionType.UPDATE,
                payload: {
                    ...event, title, date: eventDate, activity: activity as EventActivityType, mood: mood as MoodType,
                    theme: theme as WeekendTheme,
                    end: endDate
                },
            })
            setUpdating(false);
            showToast("Event Updated successfully!", "success")
        } else {
            setSaving(true);
            if (session?.accessToken) {
                try {
                    const res = await fetch("/api/google-calendar/add", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            accessToken: session.accessToken,
                            event: {
                                title,
                                date: eventDate,
                                activity,
                                end: endDate
                            },
                        }),
                    });
                    const data = await res.json();
                    if (data.success) {
                        eventIdRef.current = data.result.data.id;
                    } else {
                        showToast("❌ Failed to add event to Google Calendar", "error")
                    }
                } catch (err) {
                    showToast("❌ Failed to add event to Google Calendar", "error")
                }
            }
            // ✅ ADD
            dispatch({
                type: EventActionType.ADD,
                payload: {
                    id: Date.now().toString(),
                    title,
                    date: eventDate,
                    activity: activity as EventActivityType,
                    mood: mood as MoodType,
                    theme: theme as WeekendTheme,
                    end: endDate,
                    eventId: eventIdRef.current || undefined
                },
            })
            setSaving(false);
            showToast("Event added successfully!", "success")
        }
        setTitle("")
        setTime("")
        setActivity("")
        setDate("")
        setIsOpen(false)
    }

    if (saving) {
        return <CircularLoader size={72} thickness={6} message="Saving..." />
    }

    if (updating) {
        return <CircularLoader size={72} thickness={6} message="Updating..." />
    }



    return (
        <div className="text-black p-6 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">
                {event ? "Edit Event" : "Add New Event"}
            </h2>

            <div className="space-y-4">
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                />

                {/* Time Input */}
                {isCustomEvent && (
                    <div>
                        <label htmlFor="date" className="text-sm font-medium text-gray-900">
                            Select Date:
                        </label>
                        <input
                            type="date"
                            id="date"
                            className="w-full px-3 py-2 border rounded bg-gray-50"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="flex flex-row space-x-4 items-center">
                    <label htmlFor="time" className="text-sm font-medium text-gray-900">
                        Select Start time:
                    </label>
                    <input
                        type="time"
                        id="time"
                        min="09:00"
                        max="18:00"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="rounded-lg text-center bg-gray-50 border-gray-300 text-gray-900 
                       focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    />
                </div>
                <div className="flex flex-row space-x-4 items-center">
                    <label htmlFor="time" className="text-sm font-medium text-gray-900">
                        Select End time:
                    </label>
                    <input
                        type="time"
                        id="time"
                        min="09:00"
                        max="18:00"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        required
                        className="rounded-lg text-center bg-gray-50 border-gray-300 text-gray-900 
                       focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    />
                </div>

                {/* Activity Dropdown */}
                <select
                    id="activity"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value as EventActivityType)}
                    className="w-full px-3 py-2 border rounded bg-gray-50 pr-5"
                >
                    <option value="">Choose an activity</option>
                    {Object.values(EventActivityType).map((value) => (
                        <option key={value} value={value}>
                            {EventActivityEmojis[value]} {value.split("_")[0]}
                        </option>
                    ))}
                </select>

                {/* Mood Selection */}
                <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as MoodType)}
                    className="w-full px-3 py-2 border rounded bg-gray-50 pr-5"
                >
                    <option value="">Choose mood</option>
                    <option value={MoodType.HAPPY}>😄 Happy</option>
                    <option value={MoodType.RELAXED}>😌 Relaxed</option>
                    <option value={MoodType.ENERGETIC}>⚡ Energetic</option>
                </select>

                {/* Theme Selection */}
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as WeekendTheme)}
                    className="w-full px-3 py-2 border rounded bg-gray-50 pr-5"
                >
                    <option value="">Choose theme</option>
                    <option value={WeekendTheme.LAZY}>🛋 Lazy Weekend</option>
                    <option value={WeekendTheme.ADVENTUROUS}>🌍 Adventurous Weekend</option>
                    <option value={WeekendTheme.FAMILY}>👨‍👩‍👧 Family Weekend</option>
                </select>


                {/* Save / Update Button */}
                <button
                    onClick={handleSave}
                    className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    {event ? "Update Event" : "Save Event"}
                </button>
            </div>
        </div>
    )
}

export default EventModal
