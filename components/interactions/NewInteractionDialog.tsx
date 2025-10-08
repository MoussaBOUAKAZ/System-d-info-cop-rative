"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// 🧩 Types
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
}

interface NewInteractionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (interaction: Interaction) => void;
}

export function NewInteractionDialog({
  isOpen,
  onClose,
  onCreated,
}: NewInteractionDialogProps) {
  const [interactionType, setInteractionType] = useState<string>("email");
  const [interactionStatus, setInteractionStatus] = useState<string>("completed");
  const [contactId, setContactId] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);

  // 🧠 Charger les contacts
  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data: Contact[]) => setContacts(data))
      .catch((err) => console.error("Erreur chargement contacts :", err));
  }, []);

  // 💾 Enregistrement
  async function handleSave() {
    try {
      // 🕒 Vérifie la date
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        alert("Veuillez saisir une date valide.");
        return;
      }

      const res = await fetch("/api/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: interactionType,
          contactId: Number(contactId),
          subject,
          content: notes,
          date: parsedDate.toISOString(),
          duration,
          status: interactionStatus,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création");

      const newInteraction: Interaction = await res.json();

      // Rafraîchir la liste
      onCreated?.(newInteraction);

      // Reset du formulaire
      setInteractionType("email");
      setInteractionStatus("completed");
      setContactId("");
      setSubject("");
      setDate("");
      setDuration("");
      setNotes("");

      onClose();
    } catch (err) {
      console.error("Erreur :", err);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle interaction</DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle interaction avec un client
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Type */}
          <div className="grid gap-2">
            <Label htmlFor="type">Type d'interaction</Label>
            <Select value={interactionType} onValueChange={setInteractionType}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="call">Appel téléphonique</SelectItem>
                <SelectItem value="meeting">Réunion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact */}
          <div className="grid gap-2">
            <Label htmlFor="contact">Contact</Label>
            <Select value={contactId} onValueChange={setContactId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.length > 0 ? (
                  contacts.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.fullName} — {c.company || "—"}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Aucun contact trouvé
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Sujet */}
          <div className="grid gap-2">
            <Label htmlFor="subject">Sujet</Label>
            <Input
              id="subject"
              placeholder="Objet de l'interaction"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="grid gap-2">
            <Label htmlFor="date">Date et heure</Label>
            <Input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Durée */}
          {interactionType !== "email" && (
            <div className="grid gap-2">
              <Label htmlFor="duration">Durée</Label>
              <Input
                id="duration"
                placeholder="ex: 30 min"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          )}

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Détails de l'interaction..."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Statut */}
          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={interactionStatus} onValueChange={setInteractionStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Complété</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
                <SelectItem value="planned">Planifié</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
