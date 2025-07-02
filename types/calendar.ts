export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  type: EventType
  priority: EventPriority
  status: EventStatus
  location?: string
  attendees: string[]
  reminders: EventReminder[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type EventType =
  | "meeting"
  | "property_viewing"
  | "client_call"
  | "site_visit"
  | "presentation"
  | "training"
  | "conference"
  | "other"

export type EventPriority = "high" | "medium" | "low"

export type EventStatus = "scheduled" | "completed" | "cancelled" | "postponed"

export interface EventReminder {
  id: string
  type: "email" | "push"
  minutesBefore: number
  sent: boolean
}

export interface CalendarStats {
  totalEvents: number
  upcomingEvents: number
  thisWeekEvents: number
  completedEvents: number
}

export interface CalendarFilters {
  search: string
  type: EventType | "all"
  priority: EventPriority | "all"
  status: EventStatus | "all"
  dateRange: {
    start: string
    end: string
  }
}
