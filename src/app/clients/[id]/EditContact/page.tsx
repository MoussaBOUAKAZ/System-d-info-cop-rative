"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../../components/ui/select";
import { Loader2 } from "lucide-react";

export default function EditContactDialog({ contactId, onClose }: { contactId: number; onClose?: () => void }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    type: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const [open, setOpen] = useState(true); // ✅ Le dialog s’ouvre par défaut
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔄 Charger les données du contact
  useEffect(() => {
    if (!contactId || !open) return;

    const fetchContact = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/contacts/${contactId}`);
        const data = await res.json();
        setForm({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          company: data.company || "",
          type: data.type || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          postalCode: data.postalCode || "",
        });
      } catch (error) {
        console.error("Erreur chargement contact:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [contactId, open]);

  // 🟢 Gestion du changement
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🟢 Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      alert("✅ Contact mis à jour avec succès !");
      setOpen(false); // ✅ Ferme le dialog après mise à jour
      if (onClose) onClose(); // callback facultatif
    } catch (error) {
      console.error("Erreur update contact:", error);
      alert("❌ Impossible de mettre à jour le contact");
    } finally {
      setSaving(false);
    }
  };

  // 🟢 Si l’utilisateur ferme manuellement le dialog
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onClose) onClose(); // ✅ Appelle la fermeture parent
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier le contact</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>Nom complet</Label>
              <Input name="fullName" value={form.fullName} onChange={handleChange} />
            </div>

            <div>
              <Label>Email</Label>
              <Input name="email" value={form.email} onChange={handleChange} />
            </div>

            <div>
              <Label>Téléphone</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div>
              <Label>Entreprise</Label>
              <Input name="company" value={form.company} onChange={handleChange} />
            </div>

            <div>
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm({ ...form, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="partenaire">Partenaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Adresse</Label>
              <Input name="address" value={form.address} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ville</Label>
                <Input name="city" value={form.city} onChange={handleChange} />
              </div>
              <div>
                <Label>Pays</Label>
                <Input name="country" value={form.country} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label>Code postal</Label>
              <Input name="postalCode" value={form.postalCode} onChange={handleChange} />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? "Mise à jour..." : "Mettre à jour"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
