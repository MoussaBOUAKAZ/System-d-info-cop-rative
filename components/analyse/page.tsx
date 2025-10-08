"use client"

import { Header } from "../ui/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Activity } from "lucide-react"

// Données de démonstration
const revenueData = [
  { month: "Jan", revenue: 45000, target: 50000 },
  { month: "Fév", revenue: 52000, target: 50000 },
  { month: "Mar", revenue: 48000, target: 50000 },
  { month: "Avr", revenue: 61000, target: 55000 },
  { month: "Mai", revenue: 58000, target: 55000 },
  { month: "Juin", revenue: 67000, target: 60000 },
]

const contactsGrowthData = [
  { month: "Jan", contacts: 850 },
  { month: "Fév", contacts: 920 },
  { month: "Mar", contacts: 1050 },
  { month: "Avr", contacts: 1180 },
  { month: "Mai", revenue: 1240 },
  { month: "Juin", contacts: 1284 },
]

const interactionsByTypeData = [
  { name: "Emails", value: 198, color: "hsl(var(--chart-1))" },
  { name: "Appels", value: 89, color: "hsl(var(--chart-2))" },
  { name: "Réunions", value: 55, color: "hsl(var(--chart-3))" },
]

const conversionData = [
  { stage: "Prospects", count: 234 },
  { stage: "Qualifiés", count: 156 },
  { stage: "Propositions", count: 89 },
  { stage: "Négociations", count: 45 },
  { stage: "Clients", count: 28 },
]

const topPerformers = [
  { name: "Marie Dubois", deals: 12, revenue: "245K €", conversion: 68 },
  { name: "Pierre Martin", deals: 10, revenue: "198K €", conversion: 62 },
  { name: "Sophie Laurent", deals: 8, revenue: "156K €", conversion: 58 },
  { name: "Thomas Bernard", deals: 7, revenue: "134K €", conversion: 54 },
]

export default function Rapports() {
  return (
    <>
      <Header title="Analytics" description="Vue d'ensemble des performances et statistiques" />

      <div className="p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenu Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2.4M €</div>
              <div className="flex items-center gap-1 text-xs text-chart-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+18.2% vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux de Conversion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12.8%</div>
              <div className="flex items-center gap-1 text-xs text-chart-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+2.4% vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nouveaux Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">28</div>
              <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                <TrendingDown className="h-3 w-3" />
                <span>-5.2% vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">342</div>
              <div className="flex items-center gap-1 text-xs text-chart-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+15.3% vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenus</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du chiffre d'affaires</CardTitle>
                  <CardDescription>Revenus mensuels vs objectifs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--chart-1))"
                        fill="url(#colorRevenue)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="hsl(var(--muted-foreground))"
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Meilleurs commerciaux du mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((performer, index) => (
                      <div key={performer.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                              #{index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{performer.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {performer.deals} deals • {performer.revenue}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">{performer.conversion}%</Badge>
                        </div>
                        <Progress value={performer.conversion} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Croissance des contacts</CardTitle>
                <CardDescription>Évolution du nombre de contacts sur 6 mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={contactsGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="contacts"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par type</CardTitle>
                  <CardDescription>Distribution des interactions ce mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={interactionsByTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {interactionsByTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {interactionsByTypeData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activité quotidienne</CardTitle>
                  <CardDescription>Nombre d'interactions par jour</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { day: "Lun", count: 45 },
                        { day: "Mar", count: 52 },
                        { day: "Mer", count: 48 },
                        { day: "Jeu", count: 61 },
                        { day: "Ven", count: 55 },
                        { day: "Sam", count: 12 },
                        { day: "Dim", count: 8 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conversion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tunnel de conversion</CardTitle>
                <CardDescription>Progression des prospects dans le pipeline de vente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {conversionData.map((stage, index) => {
                    const percentage = index === 0 ? 100 : (stage.count / conversionData[0].count) * 100
                    return (
                      <div key={stage.stage} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                              {index + 1}
                            </div>
                            <span className="font-medium text-foreground">{stage.stage}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</span>
                            <span className="text-lg font-bold text-foreground">{stage.count}</span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-3" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
