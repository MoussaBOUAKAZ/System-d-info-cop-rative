import { Card, CardContent, CardHeader, CardTitle} from "../components/ui/card"
import { Phone, Mail, Calendar, FileText } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "call",
    icon: Phone,
    title: "Appel avec Marie Laurent",
    description: "Discussion sur la proposition commerciale",
    time: "Il y a 2 heures",
  },
  {
    id: 2,
    type: "email",
    icon: Mail,
    title: "Email envoyé à TechStart SAS",
    description: "Proposition de contrat annuel",
    time: "Il y a 4 heures",
  },
  {
    id: 3,
    type: "meeting",
    icon: Calendar,
    title: "Réunion planifiée",
    description: "Démo produit avec Global Industries",
    time: "Demain à 14h00",
  },
  {
    id: 4,
    type: "document",
    icon: FileText,
    title: "Contrat signé",
    description: "Innovation Labs - €25,000",
    time: "Il y a 1 jour",
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <activity.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
