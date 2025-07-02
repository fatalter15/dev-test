import { type NextRequest, NextResponse } from "next/server"
import type { CalendarEvent } from "@/types/calendar"

// Mock data - in real app, this would come from database
const events: CalendarEvent[] = [
  {
    id: "1",
    title: "Meeting dengan Klien Baru",
    description: "Diskusi kebutuhan properti untuk keluarga Budi",
    startDate: "2024-01-20",
    endDate: "2024-01-20",
    startTime: "10:00",
    endTime: "11:30",
    type: "meeting",
    priority: "high",
    status: "scheduled",
    location: "Office Meeting Room A",
    attendees: ["budi.santoso@email.com", "agent@propertypro.com"],
    reminders: [
      {
        id: "r1",
        type: "email",
        minutesBefore: 30,
        sent: false,
      },
    ],
    createdBy: "admin@propertypro.com",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Property Viewing - Villa Menteng",
    description: "Tunjukkan villa mewah di Menteng kepada klien potensial",
    startDate: "2024-01-22",
    endDate: "2024-01-22",
    startTime: "14:00",
    endTime: "15:30",
    type: "property_viewing",
    priority: "high",
    status: "scheduled",
    location: "Jl. Menteng Raya No. 123, Jakarta Pusat",
    attendees: ["client@email.com", "agent@propertypro.com"],
    reminders: [
      {
        id: "r2",
        type: "email",
        minutesBefore: 60,
        sent: false,
      },
      {
        id: "r3",
        type: "push",
        minutesBefore: 15,
        sent: false,
      },
    ],
    createdBy: "admin@propertypro.com",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T09:00:00Z",
  },
  {
    id: "3",
    title: "Team Training - Sales Techniques",
    description: "Pelatihan teknik penjualan untuk tim sales",
    startDate: "2024-01-25",
    endDate: "2024-01-25",
    startTime: "09:00",
    endTime: "12:00",
    type: "training",
    priority: "medium",
    status: "scheduled",
    location: "Training Room B",
    attendees: ["team@propertypro.com"],
    reminders: [
      {
        id: "r4",
        type: "email",
        minutesBefore: 1440, // 24 hours
        sent: false,
      },
    ],
    createdBy: "admin@propertypro.com",
    createdAt: "2024-01-10T15:00:00Z",
    updatedAt: "2024-01-10T15:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || "all"
    const priority = searchParams.get("priority") || "all"
    const status = searchParams.get("status") || "all"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let filteredEvents = events

    // Apply filters
    if (search) {
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.description?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (type !== "all") {
      filteredEvents = filteredEvents.filter((event) => event.type === type)
    }

    if (priority !== "all") {
      filteredEvents = filteredEvents.filter((event) => event.priority === priority)
    }

    if (status !== "all") {
      filteredEvents = filteredEvents.filter((event) => event.status === status)
    }

    if (startDate && endDate) {
      filteredEvents = filteredEvents.filter((event) => {
        const eventDate = new Date(event.startDate)
        const filterStart = new Date(startDate)
        const filterEnd = new Date(endDate)
        return eventDate >= filterStart && eventDate <= filterEnd
      })
    }

    // Sort by start date and time
    filteredEvents.sort((a, b) => {
      const dateA = new Date(`${a.startDate}T${a.startTime}`)
      const dateB = new Date(`${b.startDate}T${b.startTime}`)
      return dateA.getTime() - dateB.getTime()
    })

    return NextResponse.json({
      success: true,
      data: filteredEvents,
      total: filteredEvents.length,
    })
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || "",
      startDate: body.startDate,
      endDate: body.endDate,
      startTime: body.startTime,
      endTime: body.endTime,
      type: body.type,
      priority: body.priority,
      status: "scheduled",
      location: body.location || "",
      attendees: body.attendees || [],
      reminders: body.reminders || [],
      createdBy: body.createdBy || "admin@propertypro.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    events.push(newEvent)

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: "Event created successfully",
    })
  } catch (error) {
    console.error("Error creating calendar event:", error)
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 })
  }
}
