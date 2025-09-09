"use server"

import { google } from "googleapis"

export async function addEventToGoogleCalendar(
  accessToken: string,
  event: { title: string; date: string; activity: string; end: string }
) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const calendar = google.calendar({ version: "v3", auth })

  return calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: event.title,
      description: `${event.activity} - Added from Weekendly!`,
      start: { dateTime: event.date },
      end: {
        dateTime: event.end
          ? event.end
          : new Date(new Date(event.date).getTime() + 60 * 60 * 1000).toISOString(),
      },
    },
  })
}

export async function updateGoogleCalendarEvent(
  accessToken: string,
  eventId: string,
  event: { title?: string; date?: string; activity?: string; end?: string }
) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const calendar = google.calendar({ version: "v3", auth })

  return calendar.events.patch({
    calendarId: "primary",
    eventId,
    requestBody: {
      summary: event.title,
      description: event.activity ? `${event.activity} - Updated from Weekendly!` : undefined,
      start: event.date ? { dateTime: event.date } : undefined,
      end: event.end ? { dateTime: event.end } : undefined,
    },
  })
}

export async function deleteGoogleCalendarEvent(
  accessToken: string,
  eventId: string
) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const calendar = google.calendar({ version: "v3", auth })

  return calendar.events.delete({
    calendarId: "primary",
    eventId,
  })
}