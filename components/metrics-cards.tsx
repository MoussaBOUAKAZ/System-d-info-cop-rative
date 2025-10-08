import { TrendingUp, TrendingDown, Users, Briefcase, DollarSign, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

const metrics = [
  {
    title: "Revenu total",
    value: "€284,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Deals actifs",
    value: "47",
    change: "+8",
    trend: "up",
    icon: Briefcase,
  },
  {
    title: "Nouveaux clients",
    value: "23",
    change: "+3",
    trend: "up",
    icon: Users,
  },
  {
    title: "Taux de conversion",
    value: "32.8%",
    change: "-2.4%",
    trend: "down",
    icon: Target,
  },
]

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {metric.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-chart-3" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={metric.trend === "up" ? "text-chart-3" : "text-destructive"}>{metric.change}</span>
              <span className="text-muted-foreground text-sm ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
