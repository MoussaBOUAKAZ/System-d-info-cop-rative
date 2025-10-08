// "use client";

// import { useState, useEffect } from "react";
// import { Header } from "../ui/header";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { Textarea } from "../ui/textarea";
// import { Badge } from "../ui/badge";
// import { NewInteractionDialog } from "./NewInteractionDialog";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { Mail, Phone, Calendar, Clock, User } from "lucide-react";
// interface Contact {
//   id: number;
//   fullName: string;
//   company?: string;
// }

// interface Interaction {
//   id: number;
//   type: string;
//   contactId: number;
//   subject: string;
//   content: string;
//   date: string;
//   duration?: string;
//   status: string;
//   contact?: Contact;
// }

// // // Données de démonstration
// // const interactions = [
// //   {
// //     id: 1,
// //     type: "email",
// //     contact: "Marie Dubois",
// //     company: "TechCorp",
// //     subject: "Proposition commerciale Q1 2025",
// //     content:
// //       "Discussion sur les besoins en solutions CRM pour le premier trimestre...",
// //     date: "2025-01-06 14:30",
// //     status: "completed",
// //   },
// //   {
// //     id: 2,
// //     type: "call",
// //     contact: "Pierre Martin",
// //     company: "Innovate Solutions",
// //     subject: "Appel de suivi - Démo produit",
// //     content:
// //       "Retour positif sur la démonstration. Intéressé par l'offre Enterprise...",
// //     date: "2025-01-06 10:15",
// //     duration: "45 min",
// //     status: "completed",
// //   },
// //   {
// //     id: 3,
// //     type: "meeting",
// //     contact: "Sophie Laurent",
// //     company: "Digital Agency",
// //     subject: "Réunion de lancement projet",
// //     content: "Définition des objectifs et du périmètre du projet CRM...",
// //     date: "2025-01-05 16:00",
// //     duration: "1h 30min",
// //     status: "completed",
// //   },
// //   {
// //     id: 4,
// //     type: "email",
// //     contact: "Thomas Bernard",
// //     company: "Startup Inc",
// //     subject: "Relance - Proposition technique",
// //     content: "Envoi de la documentation technique et des tarifs...",
// //     date: "2025-01-04 09:20",
// //     status: "pending",
// //   },
// //   {
// //     id: 5,
// //     type: "call",
// //     contact: "Marie Dubois",
// //     company: "TechCorp",
// //     subject: "Appel de qualification",
// //     content: "Premier contact pour comprendre les besoins et le budget...",
// //     date: "2025-01-03 11:45",
// //     duration: "30 min",
// //     status: "completed",
// //   },
// // ];

// // const upcomingInteractions = [
// //   {
// //     id: 6,
// //     type: "meeting",
// //     contact: "Pierre Martin",
// //     company: "Innovate Solutions",
// //     subject: "Présentation finale",
// //     date: "2025-01-08 14:00",
// //     duration: "2h",
// //   },
// //   // ];

// export default function InteractionsPage() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [interactions, setInteractions] = useState<Interaction[]>([]);
//   const [contacts, setContacts] = useState<Contact[]>([]);

//   // Récupération des contacts depuis la base
//   useEffect(() => {
//     fetch("/api/contacts")
//       .then((res) => res.json())
//       .then(setContacts)
//       .catch((err) => console.error("Erreur chargement contacts :", err));
//   }, []);
//   useEffect(() => {
//     fetch("/api/interaction")
//       .then((res) => res.json())
//       .then(setInteractions);
//   }, []);

//   const getIcon = (type: string) => {
//     switch (type) {
//       case "email":
//         return <Mail className="h-4 w-4" />;
//       case "call":
//         return <Phone className="h-4 w-4" />;
//       case "meeting":
//         return <Calendar className="h-4 w-4" />;
//       default:
//         return <Mail className="h-4 w-4" />;
//     }
//   };

//   const getTypeLabel = (type: string) => {
//     switch (type) {
//       case "email":
//         return "Email";
//       case "call":
//         return "Appel";
//       case "meeting":
//         return "Réunion";
//       default:
//         return type;
//     }
//   };
//   const upcomingInteractions = interactions.filter(
//     (i) => i.status.toLowerCase() === "planifié" || i.status.toLowerCase() === "planifie"
//   );

//   return (
//     <>
//       <Header
//         title="Interactions"
//         description="Suivez tous vos échanges avec les clients"
//         action={{
//           label: "Nouvelle interaction",
//           onClick: () => setIsDialogOpen(true),
//         }}
//       />

//       <div className="p-8 space-y-6">
//         <div className="grid gap-4 md:grid-cols-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Total ce mois
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-foreground">342</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 +15% vs mois dernier
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Emails envoyés
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-foreground">198</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Taux de réponse: 68%
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Appels effectués
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-foreground">89</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Durée moyenne: 28 min
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Réunions
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-foreground">55</div>
//               <p className="text-xs text-muted-foreground mt-1">12 à venir</p>
//             </CardContent>
//           </Card>
//         </div>

//         <Tabs defaultValue="all" className="space-y-4">
//           <TabsList>
//             <TabsTrigger value="all">Toutes</TabsTrigger>
//             <TabsTrigger value="upcoming">À venir</TabsTrigger>
//             <TabsTrigger value="emails">Emails</TabsTrigger>
//             <TabsTrigger value="calls">Appels</TabsTrigger>
//             <TabsTrigger value="meetings">Réunions</TabsTrigger>
//           </TabsList>

//           <TabsContent value="all" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Historique des interactions</CardTitle>
//                 <CardDescription>
//                   Chronologie complète de tous vos échanges
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {interactions.map((interaction) => (
//                     <div
//                       key={interaction.id}
//                       className="flex gap-4 rounded-lg border border-border bg-card p-4 hover:bg-secondary/50 transition-colors"
//                     >
//                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
//                         {getIcon(interaction.type)}
//                       </div>
//                       <div className="flex-1 space-y-1">
//                         <div className="flex items-start justify-between gap-4">
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-2">
//                               <Badge variant="outline">
//                                 {getTypeLabel(interaction.type)}
//                               </Badge>
//                               <span className="font-medium text-foreground">
//                                 {interaction.subject}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                               <div className="flex items-center gap-1">
//                                 <User className="h-3 w-3" />
//                                 {interaction.contact ? interaction.contact.company : interaction.contactId}
//                               </div>
//                               <span>•</span>
//                               <span>{interaction.contact?.fullName}</span>
//                               <span>•</span>
//                               <div className="flex items-center gap-1">
//                                 <Clock className="h-3 w-3" />
//                                 {interaction.date}
//                               </div>
//                               {interaction.duration && (
//                                 <>
//                                   <span>•</span>
//                                   <span>{interaction.duration}</span>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                           {interaction.status === "pending" && (
//                             <Badge variant="secondary">En attente</Badge>
//                           )}
//                         </div>
//                         <p className="text-sm text-muted-foreground">
//                           {interaction.content}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="upcoming" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Interactions à venir</CardTitle>
//                 <CardDescription>
//                   Vos prochains rendez-vous et appels planifiés
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {upcomingInteractions.map((interaction) => (
//                     <div
//                       key={interaction.id}
//                       className="flex gap-4 rounded-lg border border-border bg-card p-4 hover:bg-secondary/50 transition-colors"
//                     >
//                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
//                         {getIcon(interaction.type)}
//                       </div>
//                       <div className="flex-1 space-y-1">
//                         <div className="flex items-start justify-between gap-4">
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-2">
//                               <Badge variant="outline">
//                                 {getTypeLabel(interaction.type)}
//                               </Badge>
//                               <span className="font-medium text-foreground">
//                                 {interaction.subject}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                               <div className="flex items-center gap-1">
//                                 <User className="h-3 w-3" />
//                                 {interaction.contact?.fullName || interaction.contactId}
//                               </div>
//                               <span>•</span>
//                               <span>{interaction.contact?.company}</span>
//                               <span>•</span>
//                               <div className="flex items-center gap-1">
//                                 <Clock className="h-3 w-3" />
//                                 {interaction.date}
//                               </div>
//                               <span>•</span>
//                               <span>{interaction.duration}</span>
//                             </div>
//                           </div>
//                           <Badge className="bg-chart-2 text-chart-2-foreground">
//                             Planifié
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="emails">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Emails</CardTitle>
//                 <CardDescription>
//                   Historique de vos échanges par email
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {interactions
//                     .filter((i) => i.type === "email")
//                     .map((interaction) => (
//                       <div
//                         key={interaction.id}
//                         className="flex gap-4 rounded-lg border border-border bg-card p-4"
//                       >
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
//                           <Mail className="h-4 w-4" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                           <div className="font-medium text-foreground">
//                             <Badge variant="outline">
//                                 {getTypeLabel(interaction.type)}
//                               </Badge>
//                             {interaction.subject}
//                           </div>
//                           <div className="text-sm text-muted-foreground">
//                             {interaction.contact?.fullName} • {interaction.date}
//                           </div>
//                           <p className="text-sm text-muted-foreground">
//                             {interaction.content}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="calls">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Appels téléphoniques</CardTitle>
//                 <CardDescription>Historique de vos appels</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {interactions
//                     .filter((i) => i.type === "call")
//                     .map((interaction) => (
//                       <div
//                         key={interaction.id}
//                         className="flex gap-4 rounded-lg border border-border bg-card p-4"
//                       >
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
//                           <Phone className="h-4 w-4" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                           <div className="font-medium text-foreground">
//                             {interaction.subject}
//                           </div>
//                           <div className="text-sm text-muted-foreground">
//                             {interaction.contact?.fullName} • {interaction.date} •{" "}
//                             {interaction.duration}
//                           </div>
//                           <p className="text-sm text-muted-foreground">
//                             {interaction.content}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="meetings">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Réunions</CardTitle>
//                 <CardDescription>Historique de vos réunions</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {interactions
//                     .filter((i) => i.type === "meeting")
//                     .map((interaction) => (
//                       <div
//                         key={interaction.id}
//                         className="flex gap-4 rounded-lg border border-border bg-card p-4"
//                       >
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
//                           <Calendar className="h-4 w-4" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                           <div className="font-medium text-foreground">
//                             {interaction.subject}
//                           </div>
//                           <div className="text-sm text-muted-foreground">
//                             {interaction.contact?.fullName} • {interaction.date} •{" "}
//                             {interaction.duration}
//                           </div>
//                           <p className="text-sm text-muted-foreground">
//                             {interaction.content}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       <NewInteractionDialog
//         isOpen={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         onCreated={(newInteraction) =>
//           setInteractions((prev: Interaction[]) => [newInteraction, ...prev])
//         }
//       />
//     </>
//   );
// }
"use client";

import { useState, useEffect,useMemo } from "react";
import { Header } from "../ui/header";
import { Badge } from "../ui/badge";
import { NewInteractionDialog } from "./NewInteractionDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Mail, Phone, Calendar, Clock, User } from "lucide-react";

interface Contact {
  id: number;
  fullName: string;
  company?: string;
}

interface Interaction {
  id: number;
  type: string;
  contactId: number;
  subject: string;
  content: string;
  date: string;
  duration?: string;
  status: string;
  contact?: Contact;
}

export default function InteractionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then(setContacts)
      .catch((err) => console.error("Erreur chargement contacts :", err));
  }, []);

  useEffect(() => {
    fetch("/api/interaction")
      .then((res) => res.json())
      .then(setInteractions)
      .catch((err) => console.error("Erreur chargement interactions :", err));
  }, []);

  // 🟣 Icones selon type
  const getIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  // 🟢 Badge Type (Email, Appel, Réunion)
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "email":
        return (
          <Badge className="bg-purple-500/10 text-purple-500 border border-purple-500/20">
            Email
          </Badge>
        );
      case "call":
        return (
          <Badge className="bg-orange-500/10 text-orange-500 border border-orange-500/20">
            Appel
          </Badge>
        );
      case "meeting":
        return (
          <Badge className="bg-teal-500/10 text-teal-500 border border-teal-500/20">
            Réunion
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // 🔵 Badge Statut
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "planifié":
      case "planifie":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20">
            Planifié
          </Badge>
        );
      case "completed":
      case "complete":
        return (
          <Badge className="bg-green-500/10 text-green-600 border border-green-500/20">
            Terminé
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
            En attente
          </Badge>
        );
      case "cancelled":
      case "annule":
        return (
          <Badge className="bg-red-500/10 text-red-500 border border-red-500/20">
            Annulé
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            {status}
          </Badge>
        );
    }
  };

  const upcomingInteractions = interactions.filter(
    (i) =>
      i.status.toLowerCase() === "planifié" ||
      i.status.toLowerCase() === "planifie"
  );
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Interactions du mois courant
    const thisMonth = interactions.filter((i) => {
      const date = new Date(i.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const total = thisMonth.length;
    const emails = thisMonth.filter((i) => i.type === "email").length;
    const calls = thisMonth.filter((i) => i.type === "call").length;
    const meetings = thisMonth.filter((i) => i.type === "meeting").length;

    return [
      {
        title: "Total ce mois",
        value: total,
        sub: `${total > 0 ? ((total / interactions.length) * 100).toFixed(1) : 0}% du total`,
      },
      {
        title: "Emails envoyés",
        value: emails,
        sub: `${emails > 0 ? ((emails / total) * 100).toFixed(1) : 0}% des interactions`,
      },
      {
        title: "Appels effectués",
        value: calls,
        sub: `${calls > 0 ? ((calls / total) * 100).toFixed(1) : 0}% des interactions`,
      },
      {
        title: "Réunions",
        value: meetings,
        sub: `${meetings > 0 ? ((meetings / total) * 100).toFixed(1) : 0}% des interactions`,
      },
    ];
  }, [interactions]);
  return (
    <>
      <Header
        title="Interactions"
        description="Suivez tous vos échanges avec les clients"
        action={{
          label: "Nouvelle interaction",
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <div className="p-8 space-y-6">
        {/* 🧮 Statistiques */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🗂️ Onglets */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="calls">Appels</TabsTrigger>
            <TabsTrigger value="meetings">Réunions</TabsTrigger>
          </TabsList>

          {/* 🔸 Toutes */}
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique des interactions</CardTitle>
                <CardDescription>
                  Chronologie complète de tous vos échanges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interactions.map((interaction) => (
                    <div
                      key={interaction.id}
                      className="flex gap-4 rounded-lg border border-border bg-card p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {getIcon(interaction.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getTypeBadge(interaction.type)}
                              <span className="font-medium text-foreground">
                                {interaction.subject}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {interaction.contact?.fullName ||
                                  interaction.contactId}
                              </div>
                              <span>•</span>
                              <span>{interaction.contact?.company}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {interaction.date}
                              </div>
                              {interaction.duration && (
                                <>
                                  <span>•</span>
                                  <span>{interaction.duration}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {getStatusBadge(interaction.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {interaction.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 🔸 À venir */}
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interactions à venir</CardTitle>
                <CardDescription>
                  Vos prochains rendez-vous et appels planifiés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingInteractions.map((interaction) => (
                    <div
                      key={interaction.id}
                      className="flex gap-4 rounded-lg border border-border bg-card p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {getIcon(interaction.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getTypeBadge(interaction.type)}
                              <span className="font-medium text-foreground">
                                {interaction.subject}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {interaction.contact?.fullName ||
                                  interaction.contactId}
                              </div>
                              <span>•</span>
                              <span>{interaction.contact?.company}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {interaction.date}
                              </div>
                              <span>•</span>
                              <span>{interaction.duration}</span>
                            </div>
                          </div>
                          {getStatusBadge(interaction.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 🔸 Emails */}
          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle>Emails</CardTitle>
                <CardDescription>
                  Historique de vos échanges par email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interactions
                    .filter((i) => i.type === "email")
                    .map((interaction) => (
                      <div
                        key={interaction.id}
                        className="flex gap-4 rounded-lg border border-border bg-card p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-foreground flex items-center gap-2">
                              {getTypeBadge(interaction.type)}
                              {interaction.subject}
                            </div>
                            {getStatusBadge(interaction.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {interaction.contact?.fullName} • {interaction.date}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {interaction.content}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 🔸 Appels */}
          <TabsContent value="calls">
            <Card>
              <CardHeader>
                <CardTitle>Appels téléphoniques</CardTitle>
                <CardDescription>Historique de vos appels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interactions
                    .filter((i) => i.type === "call")
                    .map((interaction) => (
                      <div
                        key={interaction.id}
                        className="flex gap-4 rounded-lg border border-border bg-card p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">
                              {interaction.subject}
                            </span>
                            {getStatusBadge(interaction.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {interaction.contact?.fullName} • {interaction.date} •{" "}
                            {interaction.duration}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {interaction.content}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 🔸 Réunions */}
          <TabsContent value="meetings">
            <Card>
              <CardHeader>
                <CardTitle>Réunions</CardTitle>
                <CardDescription>Historique de vos réunions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interactions
                    .filter((i) => i.type === "meeting")
                    .map((interaction) => (
                      <div
                        key={interaction.id}
                        className="flex gap-4 rounded-lg border border-border bg-card p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">
                              {interaction.subject}
                            </span>
                            {getStatusBadge(interaction.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {interaction.contact?.fullName} • {interaction.date} •{" "}
                            {interaction.duration}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {interaction.content}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 🆕 Dialog ajout interaction */}
      <NewInteractionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreated={(newInteraction) =>
          setInteractions((prev) => [newInteraction, ...prev])
        }
      />
    </>
  );
}
