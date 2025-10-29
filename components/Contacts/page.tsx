"use client";

import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Header } from "../ui/header";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Mail, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";

export default function Contacts() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then(setContacts)
      .catch((err) => console.error("Erreur chargement contacts :", err));
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function handleCreateContact() {
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la création du contact");

      const newContact = await response.json();
      setContacts((prev) => [newContact, ...prev]);

      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        type: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
      });

      setIsDialogOpen(false);
    } catch (err) {
      console.error("Erreur création contact :", err);
    }
  }

  const stats = useMemo(
    () => [
      { title: "Total Contacts", value: contacts.length, sub: "+100% ce mois" },
      {
        title: "Clients Actifs",
        value: contacts.filter((c) => c.type === "client").length,
        sub: "+100% ce mois",
      },
      {
        title: "Prospects",
        value: contacts.filter((c) => c.type === "prospect").length,
        sub: "+100% ce mois",
      },
      { title: "Valeur Totale", value: "0€", sub: "0% ce mois" },
    ],
    [contacts]
  );

  return (
    <>
      <Header
        title="Contacts"
        description="Gérez tous vos contacts clients et prospects"
        action={{
          label: "Nouveau contact",
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <div className="p-8 space-y-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Liste des contacts</CardTitle>
            <CardDescription>
              Vue d'ensemble de tous vos contacts et leur statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Adresse</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => { setSelectedContact(contact)
                    router.push(`/clients/${contact.id}`)                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                          {contact.fullName
                            ? contact.fullName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                            : "?"}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {contact.fullName || contact.name}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{contact.company || "—"}</TableCell>
                    <TableCell>{contact.type || "—"}</TableCell>
                    <TableCell>{contact.city || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouveau contact</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau contact à votre CRM
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                placeholder="Jean Dupont"
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean.dupont@example.com"
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            {/* Téléphone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            {/* Entreprise */}
            <div className="grid gap-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="Nom de l'entreprise"
              />
            </div>

            {/* Type de client */}
            <div className="grid gap-2">
              <Label htmlFor="type">Type de client</Label>
              <select
                id="type"
                className="border border-input rounded-md p-2 text-sm"
                defaultValue=""
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <option value="" disabled>
                  Sélectionnez un type
                </option>
                <option value="client">Client</option>
                <option value="prospect">Prospect</option>
                <option value="partenaire">Partenaire</option>
              </select>
            </div>

            {/* Adresse */}
            <div className="grid gap-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="12 rue des Lilas"
              />
            </div>

            {/* Ville, Code postal et Pays en ligne */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  placeholder="Paris"
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  placeholder="75001"
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  placeholder="France"
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => handleCreateContact()}>
              Créer le contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
