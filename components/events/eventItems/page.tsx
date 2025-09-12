"use client"

import { OptionsPopOver } from "@/components/popOver/page"
import { EventActionType, EventActivityEmojis, EventActivityType, MoodType, WeekendTheme } from "@/constants/event"
import React, { useState } from "react"
import { useEvents } from "@/context/EventContext"
import Modal from "@/components/modal/page"
import EventModal from "@/components/calender/addEvent/page"
import { useSession } from "next-auth/react"
import { useToast } from "@/context/toastContest"
import ThemeBadge from "@/components/badges/ThemeBadge/page"
import MoodBadge from "@/components/badges/MoodBadge/page"
import { Clicker_Script } from "next/font/google"

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

const EventItem: React.FC<EventItemProps> = ({ id, title, date, eventType, mood, theme, end, eventId }) => {
  const { dispatch } = useEvents()
  const [isEditOpen, setIsEditOpen] = useState(false)


  const { showToast } = useToast();

  const formattedDate = new Date(date).toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })

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
          showToast("Event deleted from Google Calendar", "success");
          eventId = '';
        } else {
          showToast("❌ Failed to delete event from Google Calendar", "error");
        }
      } catch (err) {
        showToast("❌ Failed to delete event from Google Calendar", "error");
      }
    }
  };

  const generateGoogleCalendarShareLink = (event: {
    title: string
    date: string
    end: string
    activity: string
  }) => {
    const start = encodeURIComponent(event.date.replace(/-|:|\.\d\d\d/g, ""))
    const end = encodeURIComponent(event.end.replace(/-|:|\.\d\d\d/g, ""))
    const title = encodeURIComponent(event.title)
    const details = encodeURIComponent(`${event.activity} - Planned via Weekendly`)

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`
  }


  return (
    <div>


      <div className="p-4 border rounded-xl shadow-sm bg-white transition-all duration-200 hover:bg-blue-500 hover:text-white overflow-visible transform hover:scale-105 hover:shadow-xl hover:shadow-blue-300">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-1">
                <MoodBadge mood={mood} />
              </div>
              <div className="flex items-center gap-1">
                <ThemeBadge theme={theme} />
              </div>
            </div>
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <span className="text-lg">{EventActivityEmojis[eventType]}</span>
              {title}
            </h3>

            <p className="text-sm mb-1 flex items-center gap-1">
              <span>📅</span>
              {formattedDate}
            </p>

            <div className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-black">
              {eventType.replace("_EVENT", "").replace("_", " ")}
            </div>
          </div>

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
                {
                  label: "Share", onClick: () => {
                    const shareLink = generateGoogleCalendarShareLink({ title, date, end: end || date, activity: eventType })
                    navigator.clipboard.writeText(shareLink)
                      .then(() => {
                        showToast("📋 Google Calendar share link copied to clipboard", "success")
                      })
                      .catch(() => {
                        showToast("❌ Failed to copy link to clipboard", "error")
                      })
                  }
                },
              ]}
            />
          </div>
        </div>

      </div>
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