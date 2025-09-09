"use client"

import { OptionsPopOver } from "@/components/popOver/page"
import { EventActionType, EventActivityEmojis, EventActivityType, MoodType, WeekendTheme } from "@/constants/event"
import React, { useState } from "react"
import { useEvents } from "@/context/EventContext"
import Modal from "@/components/modal/page"
import EventModal from "@/components/calender/addEvent/page"
import { useSession } from "next-auth/react"

type EventItemProps = {
  id: string
  title: string
  date: string
  eventType: EventActivityType
  mood?: MoodType
  theme?: WeekendTheme
  end?: string
  eventId?: string
}

// Custom mood component
const MoodBadge: React.FC<{ mood?: string }> = ({ mood }) => {
  if (!mood) {
    return null
  }

  const moodStyles = {
    [MoodType.HAPPY]: {
      bg: "bg-gradient-to-r from-yellow-100 to-orange-100",
      text: "text-orange-700",
      border: "border-orange-200",
      emoji: "😄",
      label: "Happy"
    },
    [MoodType.RELAXED]: {
      bg: "bg-gradient-to-r from-blue-100 to-indigo-100",
      text: "text-blue-700",
      border: "border-blue-200",
      emoji: "😌",
      label: "Relaxed"
    },
    [MoodType.ENERGETIC]: {
      bg: "bg-gradient-to-r from-red-100 to-pink-100",
      text: "text-red-700",
      border: "border-red-200",
      emoji: "⚡",
      label: "Energetic"
    }
  }

  const style = moodStyles[mood as keyof typeof moodStyles]

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border} shadow-sm`}>
      <span className="mr-1 text-sm">{style.emoji}</span>
      {style.label}
    </div>
  )
}

// Custom theme component
const ThemeBadge: React.FC<{ theme?: string }> = ({ theme }) => {
  if (!theme) {
    return null
  }

  const themeStyles = {
    [WeekendTheme.LAZY]: {
      bg: "bg-gradient-to-r from-purple-100 to-indigo-100",
      text: "text-purple-700",
      border: "border-purple-200",
      emoji: "🛋️",
      label: "Lazy Weekend"
    },
    [WeekendTheme.ADVENTUROUS]: {
      bg: "bg-gradient-to-r from-green-100 to-emerald-100",
      text: "text-green-700",
      border: "border-green-200",
      emoji: "🌍",
      label: "Adventurous Weekend"
    },
    [WeekendTheme.FAMILY]: {
      bg: "bg-gradient-to-r from-pink-100 to-rose-100",
      text: "text-pink-700",
      border: "border-pink-200",
      emoji: "👨‍👩‍👧",
      label: "Family Weekend"
    }
  }

  const style = themeStyles[theme as keyof typeof themeStyles]

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border} shadow-sm`}>
      <span className="mr-1">{style.emoji}</span>
      {style.label}
    </div>
  )
}

const EventItem: React.FC<EventItemProps> = ({ id, title, date, eventType, mood, theme, end, eventId }) => {
  const { dispatch } = useEvents()
  const [isEditOpen, setIsEditOpen] = useState(false)

  const formattedDate = new Date(date).toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Build event object for editing
  const currentEvent = {
    id,
    title,
    date,
    activity: eventType,
    mood,
    theme,
    end,
    eventId
  }

  const { data: session } = useSession()

  const handleDelete = async () => {
    if (session?.accessToken && eventId) {
      try {
        const res = await fetch("/api/google-calendar/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: session.accessToken,
            eventId: eventId,
          }),
        });
        const data = await res.json();
        if (data.success) {
          console.log("✅ Event deleted from Google Calendar");
          eventId = ''; // Clear eventId after deletion
        } else {
          console.error("❌ Failed to delete event from Google Calendar", data.error);
        }
      } catch (err) {
        console.error("❌ Failed to delete event from Google Calendar", err);
      }
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white transition-all duration-200 hover:shadow-md hover:bg-blue-500 hover:text-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Mood and Theme badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1">
              <MoodBadge mood={mood} />
            </div>
            <div className="flex items-center gap-1">
              <ThemeBadge theme={theme} />
            </div>
          </div>

          {/* Title with emoji */}
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <span className="text-lg">{EventActivityEmojis[eventType]}</span>
            {title}
          </h3>

          {/* Date */}
          <p className="text-sm mb-1 flex items-center gap-1">
            <span>📅</span>
            {formattedDate}
          </p>

          {/* Activity type */}
          <div className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-black">
            {eventType.replace("_EVENT", "").replace("_", " ")}
          </div>
        </div>

        {/* Options Popover */}
        <div className="ml-4">
          <OptionsPopOver
            trigger={
              <button className="p-2 hover:bg-gray-100 hover:text-black rounded-full transition-colors duration-200">
                <span className=" text-lg font-bold">⋮</span>
              </button>
            }
            options={[
              { label: "Edit", onClick: () => setIsEditOpen(true) },
              {
                label: "Delete",
                onClick: () => {
                  handleDelete();
                  dispatch({ type: EventActionType.REMOVE, payload: id });
                }
              },
              { label: "Share", onClick: () => alert("Share clicked") },
            ]}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} setIsOpen={setIsEditOpen} trigger={<></>}>
        <EventModal
          setIsOpen={setIsEditOpen}
          date={new Date(date).toLocaleDateString("en-GB").split("/").join("-")}
          setDate={() => { }}
          event={currentEvent}
        />
      </Modal>
    </div>
  )
}

export default EventItem