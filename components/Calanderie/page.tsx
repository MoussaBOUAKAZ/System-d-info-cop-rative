"use client"

import { FormEvent, useEffect, useState, useRef } from "react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { ChevronLeft, ChevronRight, Plus, Clock, Users, Video, MapPin } from "lucide-react"
import { MultiSelect } from "../ui/multiselect" // Utilise un composant MultiSelect si tu en as un, sinon voir plus bas

const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
]

type User = {
  id: string
  name: string
  email: string
}

type Event = {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  type: "meeting" | "call" | "task" | "event"
  participants: User[]
  location?: string
  description?: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week">("month")
  const [events, setEvents] = useState<Event[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "",
    participants: [] as string[], // tableau d'IDs
    location: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1
  const daysInMonth = lastDayOfMonth.getDate()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventDate = event.date
      return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year
    })
  }

  const getEventColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-chart-1/20 text-chart-1 border-chart-1/30"
      case "call":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30"
      case "task":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "event":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
    }
  }

  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return <Users className="h-3 w-3" />
      case "call":
        return <Clock className="h-3 w-3" />
      case "event":
        return <Video className="h-3 w-3" />
      default:
        return null
    }
  }

  const calendarDays = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="min-h-24 border border-border bg-muted/30" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day)
    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()

    calendarDays.push(
      <div key={day} className="min-h-24 border border-border bg-card p-2 hover:bg-secondary/50 transition-colors">
        <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
          {isToday && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">
              {day}
            </span>
          )}
          {!isToday && day}
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 2).map((event) => (
            <div
              key={event.id}
              className={`text-xs p-1 rounded border ${getEventColor(event.type)} truncate flex items-center gap-1`}
            >
              {getEventIcon(event.type)}
              <span className="truncate">
                {event.startTime} {event.title}
              </span>
            </div>
          ))}
          {dayEvents.length > 2 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} autres</div>}
        </div>
      </div>,
    )
  }

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        // Adapter si nécessaire pour transformer les dates en objets Date
        setEvents(
          data.map((event: any) => ({
            ...event,
            date: new Date(event.date),
          }))
        )
      })
  }, [])

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setAllUsers(data))
  }, [])

  // Ajoute cette fonction pour gérer la soumission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          type: form.type,
          location: form.location,
          description: form.description,
          participantIds: form.participants,
        }),
      })
      if (res.ok) {
        setIsDialogOpen(false)
        setForm({
          title: "",
          date: "",
          startTime: "",
          endTime: "",
          type: "",
          participants: [],
          location: "",
          description: "",
        })
        // Recharge les events
        const eventsRes = await fetch("/api/events")
        const data = await eventsRes.json()
        setEvents(
          data.map((event: any) => ({
            ...event,
            date: new Date(event.date),
          }))
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // Calcul des statistiques réelles
  const meetingCount = events.filter((e) => e.type === "meeting").length
  const callCount = events.filter((e) => e.type === "call").length
  const eventCount = events.filter((e) => e.type === "event").length
  const taskCount = events.filter((e) => e.type === "task").length
  const thisMonthCount = events.filter(
    (e) => e.date.getMonth() === month && e.date.getFullYear() === year
  ).length

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendrier</h1>
          <p className="text-muted-foreground">Planification globale et collaborative</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvel événement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un événement</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Réunion d'équipe..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) => setForm({ ...form, type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Réunion</SelectItem>
                      <SelectItem value="call">Appel</SelectItem>
                      <SelectItem value="task">Tâche</SelectItem>
                      <SelectItem value="event">Événement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Heure de début</Label>
                  <Input
                    id="start"
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">Heure de fin</Label>
                  <Input
                    id="end"
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="participants">Participants</Label>
                <select
                  id="participants"
                  multiple
                  className="w-full border rounded p-2"
                  value={form.participants}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value)
                    setForm({ ...form, participants: selected })
                  }}
                >
                  {allUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Salle de conférence, lien visio..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Détails de l'événement..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Création..." : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20">
              <Users className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Réunions</p>
              <p className="text-2xl font-bold text-foreground">{meetingCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/20">
              <Clock className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Appels</p>
              <p className="text-2xl font-bold text-foreground">{callCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/20">
              <Video className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Événements</p>
              <p className="text-2xl font-bold text-foreground">{eventCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/20">
              <MapPin className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ce mois</p>
              <p className="text-2xl font-bold text-foreground">{thisMonthCount}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-foreground">
              {months[month]} {year}
            </h2>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            {/* <Button variant={view === "month" ? "default" : "outline"} onClick={() => setView("month")}>
              Mois
            </Button>
            <Button variant={view === "week" ? "default" : "outline"} onClick={() => setView("week")}>
              Semaine
            </Button> */}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border">
          {daysOfWeek.map((day) => (
            <div key={day} className="bg-secondary p-2 text-center text-sm font-medium text-foreground">
              {day}
            </div>
          ))}
          {calendarDays}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Événements à venir</h3>
        <div className="space-y-3">
          {events.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">{event.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {event.type === "meeting" && "Réunion"}
                    {event.type === "call" && "Appel"}
                    {event.type === "task" && "Tâche"}
                    {event.type === "event" && "Événement"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{event.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</span>
                  <span>
                    {event.startTime} - {event.endTime}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {event.participants.slice(0, 3).map((participant, i) => (
                    <div
                      key={i}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium"
                      title={participant.name}
                    >
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  ))}
                  {event.participants.length > 3 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs">
                      +{event.participants.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
