"use client"

import React, {useEffect, useRef, useState } from "react"
import { useEvents } from "@/context/EventContext"
import { EventActionType, EventActivityEmojis, EventActivityType, MoodType, WeekendTheme } from "@/constants/event"
import { signIn, useSession } from "next-auth/react"
import { useToast } from "@/context/toastContest"
import CircularLoader from "@/components/circularLoader/page"
import { Calendar, Clock, X, Save, Edit3, Smile, Palette, Activity } from "lucide-react"


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

const EventModal: React.FC<EventModalProps> = ({ setIsOpen, date, setDate, event, isCustomEvent = false }) => {
    const { dispatch,skipedSignIn,setSkipedSignIn } = useEvents()

    const [title, setTitle] = useState(event?.title || "")
    const [mood, setMood] = useState(event?.mood || "")
    const [theme, setTheme] = useState(event?.mood || "")

    // Utility to format date to HH:MM in local time
    const getLocalTimeString = (dateStr: string) => {
        const d = new Date(dateStr);
        const hours = d.getHours().toString().padStart(2, "0");
        const minutes = d.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const [time, setTime] = useState(event ? getLocalTimeString(event.date) : "");
    const [end, setEnd] = useState(event?.end ? getLocalTimeString(event.end) : "");

    const [activity, setActivity] = useState<EventActivityType | "">(event?.activity || "")
    const eventIdRef = useRef<string | null>(null)
    const [saving, setSaving] = useState(false);
    const [updating, setUpdating] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setTime(getLocalTimeString(event.date));
            setEnd(event.end ? getLocalTimeString(event.end) : "");
            setActivity(event.activity);
        } else {
            setTitle("");
            setTime("");
            setEnd("");
            setActivity("");
        }
    }, [event]);

    const { data: session, status } = useSession()

    if (status === "unauthenticated" && !skipedSignIn) {
        return (
            <div className="bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 text-center w-full shadow-2xl">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h3>
                        <p className="text-gray-600">Please sign in to manage your events</p>
                    </div>
                    <button
                        onClick={() => signIn()}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                 transition-colors duration-200 font-medium"
                    >
                        Sign in with Google
                    </button>
                    <button
                        onClick={() => setSkipedSignIn(true)}
                        className="mt-4 w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 
                                 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 
                                 transition-colors duration-200 font-medium"
                    >
                        Skip
                    </button>
                </div>
            </div>
        );
    }

    const formatDateToDDMMYYYY = (date: string) => {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
    };

    const handleSave = async () => {
        if (!title || !date || !time || !activity) {
            showToast("⚠️ Please fill out all required fields before saving!", "error")
            return
        }
        if (time >= end) {
            showToast("⚠️ Please select a valid end time!", "error")
            return
        }

        const [dd, mm, yyyy] = isCustomEvent ? formatDateToDDMMYYYY(date).split("-").map(Number) : date.split("-").map(Number);
        const [startHours, startMinutes] = time.split(":").map(Number);
        const [endHours, endMinutes] = end.split(":").map(Number);

        const eventDate = new Date(yyyy, mm - 1, dd, startHours, startMinutes).toISOString();
        const endDate = new Date(yyyy, mm - 1, dd, endHours, endMinutes).toISOString();

        if (event) {
            setUpdating(true);
            if(session?.accessToken && event.eventId){
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
            if (session?.accessToken ) {
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

    const getDuration = () => {
        if (time && end) {
            const start = new Date(`2000-01-01T${time}`);
            const finish = new Date(`2000-01-01T${end}`);
            const diff = (Number(finish) - Number(start)) / (1000 * 60);
            if (diff > 0) {
                const hours = Math.floor(diff / 60);
                const minutes = diff % 60;
                return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : ''}`;
            }
        }
        return '--';
    }

    if (saving) {
        return (
            <div className="  flex items-center justify-center p-4 z-50">
                <CircularLoader size={72} thickness={6} message="Saving..." />
            </div>
        )
    }

    if (updating) {
        return (
            <div className=" flex items-center justify-center p-4 z-50">
                <CircularLoader size={72} thickness={6} message="Updating..." />
            </div>
        )
    }

    return (
        <div className=" flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {event ? <Edit3 className="w-5 h-5 text-blue-600" /> : <Calendar className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {event ? "Edit Event" : "Create New Event"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {event ? "Update your event details" : "Add a new event to your calendar"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-4 space-y-2">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700">
                            <Edit3 className="w-4 h-4 mr-2 text-blue-500" />
                            Event Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Enter event title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                     transition-all duration-200 hover:border-gray-300 placeholder-gray-400"
                        />
                    </div>

                    <div className="space-y-4">
                        {isCustomEvent && (
                            <div className="space-y-2">
                                <label htmlFor="date" className="flex items-center text-sm font-medium text-gray-700">
                                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                                    Select Date *
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 
                                             focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                             transition-all duration-200 hover:border-gray-300"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        {/* Time Inputs Container */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Start Time */}
                            <div className="space-y-2">
                                <label htmlFor="start-time" className="flex items-center text-sm font-medium text-gray-700">
                                    <Clock className="w-4 h-4 mr-2 text-green-500" />
                                    Start Time *
                                </label>
                                <input
                                    type="time"
                                    id="start-time"
                                    min="09:00"
                                    max="18:00"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 
                                             focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                             transition-all duration-200 hover:border-gray-300 text-center font-mono"
                                />
                            </div>

                            {/* End Time */}
                            <div className="space-y-2">
                                <label htmlFor="end-time" className="flex items-center text-sm font-medium text-gray-700">
                                    <Clock className="w-4 h-4 mr-2 text-red-500" />
                                    End Time *
                                </label>
                                <input
                                    type="time"
                                    id="end-time"
                                    min="09:00"
                                    max="18:00"
                                    value={end}
                                    onChange={(e) => setEnd(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 
                                             focus:ring-2 focus:ring-red-500 focus:border-transparent 
                                             transition-all duration-200 hover:border-gray-300 text-center font-mono"
                                />
                            </div>
                        </div>

                        {/* Duration Display */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-800">Event Duration</span>
                                <span className="text-sm text-blue-600 font-mono">{getDuration()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity Selection */}
                    <div className="space-y-2">
                        <label htmlFor="activity" className="flex items-center text-sm font-medium text-gray-700">
                            <Activity className="w-4 h-4 mr-2 text-orange-500" />
                            Activity Type *
                        </label>
                        <select
                            id="activity"
                            value={activity}
                            onChange={(e) => setActivity(e.target.value as EventActivityType)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 
                                     focus:ring-2 focus:ring-orange-500 focus:border-transparent 
                                     transition-all duration-200 hover:border-gray-300"
                        >
                            <option value="">Choose an activity...</option>
                            {Object.values(EventActivityType).map((value) => (
                                <option key={value} value={value}>
                                    {EventActivityEmojis[value]} {value.split("_")[0]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mood and Theme Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Mood Selection */}
                        <div className="space-y-2">
                            <label htmlFor="mood" className="flex items-center text-sm font-medium text-gray-700">
                                <Smile className="w-4 h-4 mr-2 text-yellow-500" />
                                Mood
                            </label>
                            <select
                                id="mood"
                                value={mood}
                                onChange={(e) => setMood(e.target.value as MoodType)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 
                                         focus:ring-2 focus:ring-yellow-500 focus:border-transparent 
                                         transition-all duration-200 hover:border-gray-300"
                            >
                                <option value="">Choose mood...</option>
                                <option value={MoodType.HAPPY}>😄 Happy</option>
                                <option value={MoodType.RELAXED}>😌 Relaxed</option>
                                <option value={MoodType.ENERGETIC}>⚡ Energetic</option>
                            </select>
                        </div>

                        {/* Theme Selection */}
                        <div className="space-y-2">
                            <label htmlFor="theme" className="flex items-center text-sm font-medium text-gray-700">
                                <Palette className="w-4 h-4 mr-2 text-pink-500" />
                                Theme
                            </label>
                            <select
                                id="theme"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value as WeekendTheme)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 
                                         focus:ring-2 focus:ring-pink-500 focus:border-transparent 
                                         transition-all duration-200 hover:border-gray-300"
                            >
                                <option value="">Choose theme...</option>
                                <option value={WeekendTheme.LAZY}>🛋 Lazy Weekend</option>
                                <option value={WeekendTheme.ADVENTUROUS}>🌍 Adventurous Weekend</option>
                                <option value={WeekendTheme.FAMILY}>👨‍👩‍👧 Family Weekend</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 md:px-6 md:py-3 border border-gray-300 rounded-lg text-gray-700 
                                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 
                                     transition-colors duration-200 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 md:px-6 py-3 bg-blue-600 text-white rounded-lg 
                                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                     transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>{event ? "Update Event" : "Save Event"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventModal