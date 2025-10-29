"use client"

import { Card, CardContent } from "../../components/ui/card"
import { Users, Package, Calendar, BarChart3, Settings, User, MessageSquare, Zap } from "lucide-react"

const pages = [
  {
    label: "Clients",
    value: "Clients",
    icon: Users,
    description: "Manage your client relationships",
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Produits & Services",
    value: "Produits & Services",
    icon: Package,
    description: "View and manage your offerings",
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Calendrier",
    value: "Calendrier",
    icon: Calendar,
    description: "Schedule and organize events",
    color: "from-orange-500 to-red-500",
  },
  {
    label: "Rapports",
    value: "Rapportes",
    icon: BarChart3,
    description: "View detailed analytics",
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Paramètres",
    value: "Paramètres",
    icon: Settings,
    description: "Configure your preferences",
    color: "from-slate-500 to-gray-500",
  },
  {
    label: "Mon Compte",
    value: "monCompte",
    icon: User,
    description: "Manage your profile",
    color: "from-indigo-500 to-blue-500",
  },
  {
    label: "Discussion",
    value: "Discusion",
    icon: MessageSquare,
    description: "Chat and communicate",
    color: "from-teal-500 to-cyan-500",
  },
  {
    label: "Interactions",
    value: "interaction",
    icon: Zap,
    description: "Track user interactions",
    color: "from-yellow-500 to-orange-500",
  },
]

export default function TableauDeBord({ onNavigate }: { onNavigate?: (value: string) => void }) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Tableau de Bord</h1>
        <p className="text-muted-foreground">Accédez à tous vos outils et fonctionnalités en un seul endroit</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pages.map((page) => {
          const IconComponent = page.icon
          return (
            <div key={page.value} onClick={() => onNavigate && onNavigate(page.value)} className="group cursor-pointer">
              <Card className="h-full overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div
                  className={`h-24 bg-gradient-to-br ${page.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Animated background elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full blur-sm group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-3 left-3 w-6 h-6 bg-white/10 rounded-full blur-sm group-hover:scale-125 transition-transform duration-500"></div>
                  </div>

                  {/* Icon with animation */}
                  <IconComponent className="w-12 h-12 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>

                <CardContent className="pt-6 pb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                    {page.label}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{page.description}</p>
                </CardContent>

                <div className="px-6 pb-4 flex items-center justify-between">
                  <div className="h-1 w-8 bg-gradient-to-r from-primary/50 to-primary/0 rounded-full group-hover:w-12 transition-all duration-300"></div>
                  <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1 duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
