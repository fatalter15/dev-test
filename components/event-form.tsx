"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, MapPin, Users, Bell } from "lucide-react"
import type { CalendarEvent, EventType, EventPriority, EventStatus } from "@/types/calendar"

interface EventFormProps {
  event?: CalendarEvent
  onSave: (eventData: Partial<CalendarEvent>) => void
  onCancel: () => void
  isLoading?: boolean
}

export function EventForm({ event, onSave, onCancel, isLoading = false }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    startDate: event?.startDate || new Date().toISOString().split("T")[0],
    endDate: event?.endDate || new Date().toISOString().split("T")[0],
    startTime: event?.startTime || "09:00",
    endTime: event?.endTime || "10:00",
    type: event?.type || ("meeting" as EventType),
    priority: event?.priority || ("medium" as EventPriority),
    status: event?.status || ("scheduled" as EventStatus),
    location: event?.location || "",
    attendees: event?.attendees || [],
    reminders: event?.reminders || [],
  })

  const [newAttendee, setNewAttendee] = useState("")
  const [newReminderMinutes, setNewReminderMinutes] = useState("30")

  const eventTypes = [
    { value: "meeting", label: "Meeting" },
    { value: "property_viewing", label: "Property Viewing" },
    { value: "client_call", label: "Client Call" },
    { value: "site_visit", label: "Site Visit" },
    { value: "presentation", label: "Presentation" },
    { value: "training", label: "Training" },
    { value: "conference", label: "Conference" },
    { value: "other", label: "Other" },
  ]

  const priorityOptions = [
    { value: "high", label: "High", color: "bg-red-100 text-red-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  ]

  const statusOptions = [
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "postponed", label: "Postponed" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData((prev) => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()],
      }))
      setNewAttendee("")
    }
  }

  const removeAttendee = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      attendees: prev.attendees.filter((a) => a !== email),
    }))
  }

  const addReminder = () => {
    const minutes = Number.parseInt(newReminderMinutes)
    if (minutes > 0) {
      const newReminder = {
        id: Date.now().toString(),
        type: "email" as const,
        minutesBefore: minutes,
        sent: false,
      }
      setFormData((prev) => ({
        ...prev,
        reminders: [...prev.reminders, newReminder],
      }))
    }
  }

  const removeReminder = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((r) => r.id !== id),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const formatReminderTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} menit sebelum`
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60)
      return `${hours} jam sebelum`
    } else {
      const days = Math.floor(minutes / 1440)
      return `${days} hari sebelum`
    }
  }

  return (
    <Card className="bg-white border-gray-200 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">{event ? "Edit Event" : "Buat Event Baru"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-700">
                Judul Event *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Masukkan judul event"
                required
                className="bg-white border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700">
                Deskripsi
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Deskripsi event (opsional)"
                rows={3}
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-gray-700">
                Tanggal Mulai *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-gray-700">
                Tanggal Selesai *
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="startTime" className="text-gray-700">
                Waktu Mulai *
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                required
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="text-gray-700">
                Waktu Selesai *
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                required
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          {/* Event Properties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-700">Tipe Event *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700">Prioritas *</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${priority.color.includes("red") ? "bg-red-500" : priority.color.includes("yellow") ? "bg-yellow-500" : "bg-green-500"}`}
                        ></div>
                        <span>{priority.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Lokasi
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Alamat atau lokasi event"
              className="bg-white border-gray-300"
            />
          </div>

          {/* Attendees */}
          <div>
            <Label className="text-gray-700 flex items-center mb-2">
              <Users className="h-4 w-4 mr-1" />
              Peserta
            </Label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  placeholder="Email peserta"
                  className="flex-1 bg-white border-gray-300"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAttendee())}
                />
                <Button
                  type="button"
                  onClick={addAttendee}
                  variant="outline"
                  className="border-gray-300 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.attendees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.attendees.map((email) => (
                    <Badge key={email} variant="secondary" className="bg-gray-100 text-gray-700">
                      {email}
                      <button type="button" onClick={() => removeAttendee(email)} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reminders */}
          <div>
            <Label className="text-gray-700 flex items-center mb-2">
              <Bell className="h-4 w-4 mr-1" />
              Pengingat
            </Label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Select value={newReminderMinutes} onValueChange={setNewReminderMinutes}>
                  <SelectTrigger className="flex-1 bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="15">15 menit sebelum</SelectItem>
                    <SelectItem value="30">30 menit sebelum</SelectItem>
                    <SelectItem value="60">1 jam sebelum</SelectItem>
                    <SelectItem value="1440">1 hari sebelum</SelectItem>
                    <SelectItem value="10080">1 minggu sebelum</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={addReminder}
                  variant="outline"
                  className="border-gray-300 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.reminders.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.reminders.map((reminder) => (
                    <Badge key={reminder.id} variant="secondary" className="bg-blue-100 text-blue-700">
                      <Bell className="h-3 w-3 mr-1" />
                      {formatReminderTime(reminder.minutesBefore)}
                      <button
                        type="button"
                        onClick={() => removeReminder(reminder.id)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-amber-600 hover:bg-amber-700 text-white">
              {isLoading ? "Menyimpan..." : event ? "Update Event" : "Buat Event"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
