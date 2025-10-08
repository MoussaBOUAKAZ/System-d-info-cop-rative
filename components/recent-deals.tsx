import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

const deals = [
  {
    id: 1,
    company: "Acme Corp",
    contact: "Marie Laurent",
    value: "€45,000",
    stage: "Négociation",
    status: "hot",
  },
  {
    id: 2,
    company: "TechStart SAS",
    contact: "Pierre Martin",
    value: "€32,000",
    stage: "Proposition",
    status: "warm",
  },
  {
    id: 3,
    company: "Global Industries",
    contact: "Sophie Dubois",
    value: "€78,000",
    stage: "Découverte",
    status: "cold",
  },
  {
    id: 4,
    company: "Innovation Labs",
    contact: "Luc Bernard",
    value: "€25,000",
    stage: "Négociation",
    status: "hot",
  },
]

const statusColors = {
  hot: "bg-chart-3 text-white",
  warm: "bg-chart-4 text-foreground",
  cold: "bg-chart-2 text-white",
}

export function RecentDeals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deals récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deals.map((deal) => (
            <div key={deal.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
                <AvatarFallback>
                  {deal.contact
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{deal.company}</p>
                <p className="text-sm text-muted-foreground truncate">{deal.contact}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{deal.value}</p>
                <Badge variant="secondary" className={statusColors[deal.status as keyof typeof statusColors]}>
                  {deal.stage}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
