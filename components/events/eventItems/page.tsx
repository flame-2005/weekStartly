"use client"

import { OptionsPopOver } from "@/components/popOver/page"
import { EventActionType, EventActivityEmojis, EventActivityType, MoodType, WeekendTheme } from "@/constants/event"
import React, { useEffect, useState } from "react"
import { useEvents } from "@/context/EventContext"
import Modal from "@/components/modal/page"
import EventModal from "@/components/calender/addEvent/page"
import { useSession } from "next-auth/react"
import { useToast } from "@/context/toastContest"
import ThemeBadge from "@/components/badges/ThemeBadge/page"
import MoodBadge from "@/components/badges/MoodBadge/page"
import { Calendar, Clock, Edit3, Trash2, Share2, MoreVertical, MapPin } from "lucide-react"

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
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false);

  const { showToast } = useToast();

  const formattedDate = new Date(date).toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Calculate duration if end time exists
  const getDuration = () => {
    if (end) {
      const startTime = new Date(date)
      const endTime = new Date(end)
      const diffMs = endTime.getTime() - startTime.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const hours = Math.floor(diffMins / 60)
      const minutes = diffMins % 60
      return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m` : ''}`
    }
    return null
  }

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

  // Check if device is mobile with resize handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Get activity color theme - Updated for your actual enum values
  const getActivityTheme = (activity: EventActivityType) => {
    const themes = {
      [EventActivityType.HIKING]: { bg: "from-green-500 to-emerald-500", accent: "bg-green-100 text-green-700", hover: "hover:shadow-green-500/25" },
      [EventActivityType.BRUNCH]: { bg: "from-orange-500 to-amber-500", accent: "bg-orange-100 text-orange-700", hover: "hover:shadow-orange-500/25" },
      [EventActivityType.MOVIE]: { bg: "from-purple-500 to-pink-500", accent: "bg-purple-100 text-purple-700", hover: "hover:shadow-purple-500/25" },
      [EventActivityType.FIGHT]: { bg: "from-red-500 to-rose-500", accent: "bg-red-100 text-red-700", hover: "hover:shadow-red-500/25" },
      [EventActivityType.READING]: { bg: "from-blue-500 to-indigo-500", accent: "bg-blue-100 text-blue-700", hover: "hover:shadow-blue-500/25" },
    }
    return themes[activity] || themes[EventActivityType.HIKING]
  }

  const activityTheme = getActivityTheme(eventType)
  const duration = getDuration()

  return (
    <div className="relative"
    >
      <div
        className={`
          relative p-6 rounded-2xl shadow-lg bg-white border border-gray-100
          transition-all duration-300 cursor-pointer group overflow-visible
          hover:shadow-2xl hover:scale-[1.02] ${activityTheme.hover}
          transform-gpu
        `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`
          absolute inset-0 bg-gradient-to-br ${activityTheme.bg} opacity-0 
          group-hover:opacity-95 transition-opacity duration-300 rounded-2xl
        `} />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {mood && <MoodBadge mood={mood} />}
                {theme && <ThemeBadge theme={theme} />}
                {duration && (
                  <div className={`
                    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    ${isHovered ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-gray-100 text-gray-600'}
                    transition-all duration-300
                  `}>
                    <Clock className="w-3 h-3 mr-1" />
                    {duration}
                  </div>
                )}
              </div>

              {/* Event Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                  ${isHovered ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-200'}
                  transition-all duration-300
                `}>
                  {EventActivityEmojis[eventType]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    font-bold text-lg leading-tight
                    ${isHovered ? 'text-white' : 'text-gray-900'}
                    transition-colors duration-300 truncate
                  `}>
                    {title}
                  </h3>
                  <button
                    onClick={() => {
                      const searchQuery = eventType
                        .replace("_EVENT", "")
                        .replace("_", " ")
                        .toLowerCase();

                      const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
                        searchQuery
                      )}`;

                      window.open(googleMapsUrl, "_blank");
                    }}
                    className={`
                          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-1
                          cursor-pointer
                          ${isHovered ? "bg-white/20 text-white/90" : activityTheme.accent}
                          transition-all duration-300 hover:scale-105 hover:shadow-md
                        `}
                    title={`Find ${eventType.replace("_EVENT", "").replace("_", " ")} places on Google Maps`}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {eventType.replace("_EVENT", "").replace("_", " ")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Date and Time Section */}
          <div className={`
            flex items-center gap-2 p-3 rounded-xl
            ${isHovered ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-200'}
            transition-all duration-300
          `}>
            <Calendar className={`
              w-4 h-4 flex-shrink-0
              ${isHovered ? 'text-white/80' : 'text-gray-500'}
            `} />
            <p className={`
              text-sm font-medium
              ${isHovered ? 'text-white/90' : 'text-gray-700'}
              transition-colors duration-300
            `}>
              {formattedDate}
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
            <div className={`
              w-20 h-20 rounded-full bg-gradient-to-br ${activityTheme.bg}
              transform rotate-12 scale-75 opacity-10
            `} />
          </div>
        </div>
      </div>
      {/* Options Menu */}
      <div className="absolute top-4 right-4 z-50">
        <OptionsPopOver
          trigger={
            <button className={`
                    p-2 rounded-xl transition-all duration-200 group/btn
                    ${isHovered
                ? 'hover:bg-white/20 text-white backdrop-blur-sm'
                : 'hover:bg-gray-100 text-gray-600'
              }
                  `}>
              <MoreVertical className="w-5 h-5" />
            </button>
          }
          options={[
            {
              label: "Edit",
              onClick: () => {
                setIsEditOpen(true)
                setIsHovered(false);
              }
            },
            {
              label: "Delete",
              onClick: () => {
                handleDelete();
                dispatch({ type: EventActionType.REMOVE, payload: id });
              }
            },
            {
              label: "Share",
              onClick: () => {
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