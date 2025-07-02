"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  Users,
  Bell,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { CalendarView } from "@/components/calendar-view"
import { EventForm } from "@/components/event-form"
import type { CalendarEvent, CalendarStats, CalendarFilters } from "@/types/calendar"

export default function CalendarPage() {
  const router = useRouter()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [stats, setStats] = useState<CalendarStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    thisWeekEvents: 0,
    completedEvents: 0,
  })
  const [filters, setFilters] = useState<CalendarFilters>({
    search: "",
    type: "all",
    priority: "all",
    status: "all",
    dateRange: {
      start: "",
      end: "",
    },
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>()
  const [showEventForm, setShowEventForm] = useState(false)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<"calendar" | "list">("calendar")

  // Fetch events
  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.type !== "all") params.append("type", filters.type)
      if (filters.priority !== "all") params.append("priority", filters.priority)
      if (filters.status !== "all") params.append("status", filters.status)
      if (filters.dateRange.start) params.append("startDate", filters.dateRange.start)
      if (filters.dateRange.end) params.append("endDate", filters.dateRange.end)

      const response = await fetch(`/api/calendar?${params}`)
      const data = await response.json()

      if (data.success) {
        setEvents(data.data)
        calculateStats(data.data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (eventList: CalendarEvent[]) => {
    const now = new Date()
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const stats = {
      totalEvents: eventList.length,
      upcomingEvents: eventList.filter((event) => {
        const eventDate = new Date(`${event.startDate}T${event.startTime}`)
        return eventDate > now && event.status === "scheduled"
      }).length,
      thisWeekEvents: eventList.filter((event) => {
        const eventDate = new Date(`${event.startDate}T${event.startTime}`)
        return eventDate >= now && eventDate <= oneWeekFromNow
      }).length,
      completedEvents: eventList.filter((event) => event.status === "completed").length,
    }

    setStats(stats)
  }

  useEffect(() => {
    fetchEvents()
  }, [filters])

  const handleCreateEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      const data = await response.json()
      if (data.success) {
        setShowEventForm(false)
        fetchEvents()
      }
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateEvent = async (eventData: Partial<CalendarEvent>) => {
    if (!selectedEvent) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/calendar/${selectedEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      const data = await response.json()
      if (data.success) {
        setShowEventForm(false)
        setSelectedEvent(undefined)
        fetchEvents()
      }
    } catch (error) {
      console.error("Error updating event:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/calendar/${eventId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        setShowEventDetail(false)
        setSelectedEvent(undefined)
        fetchEvents()
      }
    } catch (error) {
      console.error("Error deleting event:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "postponed":
        return <Pause className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Selesai</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Dibatalkan</Badge>
      case "postponed":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Ditunda</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Terjadwal</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Tinggi</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Sedang</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Rendah</Badge>
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kalender Perusahaan</h1>
                <p className="text-gray-600 mt-1">Kelola jadwal, appointment, dan event perusahaan</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={view === "calendar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("calendar")}
                  className={
                    view === "calendar"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Kalender
                </Button>
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("list")}
                  className={
                    view === "list"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Daftar
                </Button>
              </div>
              <Button onClick={() => setShowEventForm(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Buat Event
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
                <div className="h-12 w-12 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisWeekEvents}</p>
                </div>
                <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedEvents}</p>
                </div>
                <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-gray-200 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari events..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="pl-10 bg-white border-gray-300"
                />
              </div>

              <Select
                value={filters.type}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Tipe Event" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="property_viewing">Property Viewing</SelectItem>
                  <SelectItem value="client_call">Client Call</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.priority}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, priority: value as any }))}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Prioritas" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all">Semua Prioritas</SelectItem>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="scheduled">Terjadwal</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  <SelectItem value="postponed">Ditunda</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    search: "",
                    type: "all",
                    priority: "all",
                    status: "all",
                    dateRange: { start: "", end: "" },
                  })
                }
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reset Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {view === "calendar" ? (
          <CalendarView
            events={events}
            onEventClick={(event) => {
              setSelectedEvent(event)
              setShowEventDetail(true)
            }}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        ) : (
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Daftar Events</CardTitle>
              <CardDescription className="text-gray-600">Semua events dalam format list</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Tidak ada events ditemukan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event)
                        setShowEventDetail(true)
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            {getStatusBadge(event.status)}
                            {getPriorityBadge(event.priority)}
                          </div>

                          {event.description && <p className="text-sm text-gray-600 mb-3">{event.description}</p>}

                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(event.startDate).toLocaleDateString("id-ID")}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {event.startTime} - {event.endTime}
                            </div>
                            {event.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {event.location}
                              </div>
                            )}
                            {event.attendees.length > 0 && (
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {event.attendees.length} peserta
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEvent(event)
                              setShowEventForm(true)
                            }}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteEvent(event.id)
                            }}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Event Form Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-gray-200">
          <EventForm
            event={selectedEvent}
            onSave={selectedEvent ? handleUpdateEvent : handleCreateEvent}
            onCancel={() => {
              setShowEventForm(false)
              setSelectedEvent(undefined)
            }}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Event Detail Dialog */}
      <Dialog open={showEventDetail} onOpenChange={setShowEventDetail}>
        <DialogContent className="max-w-2xl bg-white border-gray-200">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-900 flex items-center">
                  {getStatusIcon(selectedEvent.status)}
                  <span className="ml-2">{selectedEvent.title}</span>
                </DialogTitle>
                <DialogDescription className="text-gray-600">Detail informasi event</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {selectedEvent.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Deskripsi</h4>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tanggal & Waktu</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(selectedEvent.startDate).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Status & Prioritas</h4>
                    <div className="space-y-2">
                      {getStatusBadge(selectedEvent.status)}
                      {getPriorityBadge(selectedEvent.priority)}
                    </div>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Lokasi</h4>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {selectedEvent.location}
                    </div>
                  </div>
                )}

                {selectedEvent.attendees.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Peserta ({selectedEvent.attendees.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.attendees.map((email) => (
                        <Badge key={email} variant="secondary" className="bg-gray-100 text-gray-700">
                          {email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.reminders.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pengingat</h4>
                    <div className="space-y-2">
                      {selectedEvent.reminders.map((reminder) => (
                        <div key={reminder.id} className="flex items-center text-sm text-gray-600">
                          <Bell className="h-4 w-4 mr-2" />
                          {reminder.minutesBefore < 60
                            ? `${reminder.minutesBefore} menit sebelum`
                            : reminder.minutesBefore < 1440
                              ? `${Math.floor(reminder.minutesBefore / 60)} jam sebelum`
                              : `${Math.floor(reminder.minutesBefore / 1440)} hari sebelum`}{" "}
                          ({reminder.type})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEventDetail(false)
                      setShowEventForm(true)
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </Button>
                  <Button
                    onClick={() => setShowEventDetail(false)}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
