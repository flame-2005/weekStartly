// Holiday type in our app
export type Holiday = {
  id: string
  title: string
  date: string
}

// Minimal Google Calendar event response type
export type GoogleCalendarEvent = {
  id: string
  summary: string
  start: {
    date?: string      // for all-day events
    dateTime?: string 
  }
}