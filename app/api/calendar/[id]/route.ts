import { type NextRequest, NextResponse } from "next/server"
import type { CalendarEvent } from "@/types/calendar"

// Mock data - same as in route.ts
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
        minutesBefore: 1440,
        sent: false,
      },
    ],
    createdBy: "admin@propertypro.com",
    createdAt: "2024-01-10T15:00:00Z",
    updatedAt: "2024-01-10T15:00:00Z",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = events.find((e) => e.id === params.id)

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: event,
    })
  } catch (error) {
    console.error("Error fetching calendar event:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const eventIndex = events.findIndex((e) => e.id === params.id)

    if (eventIndex === -1) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
    }

    const updatedEvent: CalendarEvent = {
      ...events[eventIndex],
      title: body.title || events[eventIndex].title,
      description: body.description !== undefined ? body.description : events[eventIndex].description,
      startDate: body.startDate || events[eventIndex].startDate,
      endDate: body.endDate || events[eventIndex].endDate,
      startTime: body.startTime || events[eventIndex].startTime,
      endTime: body.endTime || events[eventIndex].endTime,
      type: body.type || events[eventIndex].type,
      priority: body.priority || events[eventIndex].priority,
      status: body.status || events[eventIndex].status,
      location: body.location !== undefined ? body.location : events[eventIndex].location,
      attendees: body.attendees || events[eventIndex].attendees,
      reminders: body.reminders || events[eventIndex].reminders,
      updatedAt: new Date().toISOString(),
    }

    events[eventIndex] = updatedEvent

    return NextResponse.json({
      success: true,
      data: updatedEvent,
      message: "Event updated successfully",
    })
  } catch (error) {
    console.error("Error updating calendar event:", error)
    return NextResponse.json({ success: false, error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventIndex = events.findIndex((e) => e.id === params.id)

    if (eventIndex === -1) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
    }

    const deletedEvent = events[eventIndex]
    events.splice(eventIndex, 1)

    return NextResponse.json({
      success: true,
      data: deletedEvent,
      message: "Event deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting calendar event:", error)
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 })
  }
}
