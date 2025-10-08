"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";

/**
 * Mock types — adapte selon ton Prisma / API
 */
type EmailRecord = { id: string; subject: string; body: string; date: string };
type CallRecord = { id: string; direction: "in" | "out"; note?: string; date: string };
type Purchase = { id: string; item: string; amount: number; date: string };

type Contact = {
  id: string;
  name: string | null;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  emails?: EmailRecord[];
  calls?: CallRecord[];
  purchases?: Purchase[];
};

/**
 * Component
 */
export default function ContactsModule() {
  // UI state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "prospect" | "client">("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Form / edit state
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<Contact>>({});

  // Fetch contacts (replace with real API)
  useEffect(() => {
    async function load() {
      setLoading(true);
      // TODO: replace with `await fetch('/api/contacts')`
      await new Promise((r) => setTimeout(r, 250));
      setContacts(mockContacts);
      setLoading(false);
    }
    load();
  }, []);

  // Derived
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts
      .filter((c) =>
        filter === "all" ? true : filter === "client" ? !!c.purchases?.length : !c.purchases?.length
      )
      .filter((c) => {
        if (!q) return true;
        return (
          (c.name ?? "").toLowerCase().includes(q) ||
          (c.email ?? "").toLowerCase().includes(q) ||
          (c.company ?? "").toLowerCase().includes(q)
        );
      });
  }, [contacts, search, filter]);

  const active = contacts.find((c) => c.id === activeId) ?? null;

  // Handlers (replace internals with real API calls)
  async function handleSelect(id: string) {
    setActiveId(id);
    setIsEditing(false);
    setForm({});
    // could fetch detail here: await fetch(`/api/contacts/${id}`)
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce contact ?")) return;
    // TODO: call DELETE API
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function handleNew() {
    setIsEditing(true);
    setForm({ name: "", email: "", phone: "", company: "" });
    setActiveId(null);
  }

  async function handleSave() {
    // Basic validation
    if (!form.name || !form.email) {
      alert("Nom et email requis");
      return;
    }

    // TODO: POST/PUT to your API
    if (active) {
      // update
      setContacts((prev) => prev.map((c) => (c.id === active.id ? { ...c, ...form } as Contact : c)));
    } else {
      // create new
      const id = String(Math.random().toString(36).slice(2, 9));
      const newContact: Contact = {
        id,
        name: form.name ?? null,
        email: form.email ?? null,
        phone: form.phone ?? null,
        company: form.company ?? null,
        notes: form.notes ?? "",
        emails: [],
        calls: [],
        purchases: [],
      };
      setContacts((prev) => [newContact, ...prev]);
      setActiveId(id);
    }

    setIsEditing(false);
    setForm({});
  }

  function handleStartEdit(c?: Contact) {
    setIsEditing(true);
    if (c) setForm({ ...c });
    else setForm({ name: "", email: "", phone: "", company: "" });
    if (c) setActiveId(c.id);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[20rem_1fr] gap-6 h-[calc(100vh-10rem)]">
      {/* ========== LEFT: list ========== */}
      <Card className="h-full flex flex-col">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Contacts</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={handleNew}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="mb-3">
            <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="flex gap-2 mb-3">
            <button
              className={`px-2 py-1 rounded text-xs ${filter === "all" ? "bg-accent" : "hover:bg-accent/50"}`}
              onClick={() => setFilter("all")}
            >
              Tous
            </button>
            <button
              className={`px-2 py-1 rounded text-xs ${filter === "client" ? "bg-accent" : "hover:bg-accent/50"}`}
              onClick={() => setFilter("client")}
            >
              Clients
            </button>
            <button
              className={`px-2 py-1 rounded text-xs ${filter === "prospect" ? "bg-accent" : "hover:bg-accent/50"}`}
              onClick={() => setFilter("prospect")}
            >
              Prospects
            </button>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="text-sm text-muted-foreground">Chargement...</div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground">Aucun contact.</div>
            ) : (
              filtered.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-accent ${
                    activeId === c.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0" onClick={() => handleSelect(c.id)}>
                    <div className="font-medium truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.email}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.company}</div>
                  </div>
                  <div className="flex gap-1 ml-3">
                    <Button size="icon" variant="ghost" onClick={() => handleStartEdit(c)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* ========== RIGHT: detail ========== */}
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>{active ? active.name ?? "Détails" : "Fiche contact"}</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col">
          {/* if editing or creating show form */}
          {isEditing ? (
            <div className="space-y-4 max-w-2xl">
              <div>
                <Label>Nom</Label>
                <Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label>Entreprise</Label>
                <Input value={form.company ?? ""} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={handleSave}>Enregistrer</Button>
                <Button variant="outline" onClick={() => { setIsEditing(false); setForm({}); }}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : active ? (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{active.name}</div>
                    <div className="text-sm text-muted-foreground">{active.company}</div>
                    <div className="text-sm text-muted-foreground">{active.email} • {active.phone}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleStartEdit(active)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(active.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabs-like sections: Emails / Calls / Purchases */}
              <div className="space-y-6">
                <Section title="Emails">
                  {active.emails && active.emails.length > 0 ? (
                    active.emails.map((e) => (
                      <div key={e.id} className="p-2 rounded bg-muted/50">
                        <div className="font-medium text-sm">{e.subject}</div>
                        <div className="text-xs text-muted-foreground">{new Date(e.date).toLocaleString()}</div>
                        <div className="text-sm mt-1">{e.body}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Aucun email enregistré</div>
                  )}
                </Section>

                <Section title="Appels">
                  {active.calls && active.calls.length > 0 ? (
                    active.calls.map((c) => (
                      <div key={c.id} className="p-2 rounded bg-muted/50">
                        <div className="text-sm">{c.direction === "in" ? "Reçu" : "Émis"} • {new Date(c.date).toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{c.note}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Aucun appel enregistré</div>
                  )}
                </Section>

                <Section title="Achats">
                  {active.purchases && active.purchases.length > 0 ? (
                    active.purchases.map((p) => (
                      <div key={p.id} className="p-2 rounded bg-muted/50 flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">{p.item}</div>
                          <div className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString()}</div>
                        </div>
                        <div className="font-semibold">{p.amount.toFixed(2)} €</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Aucun achat</div>
                  )}
                </Section>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-xl font-medium mb-2">Sélectionnez un contact</div>
                <div className="text-sm">ou créez-en un nouveau.</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- small helpers & mock data ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

const mockContacts: Contact[] = [
  {
    id: "c_1",
    name: "Jean Dupont",
    company: "ACME Corp",
    email: "jean@acme.test",
    phone: "+33 6 12 34 56 78",
    notes: "Client important - préfère contact téléphonique",
    emails: [
      { id: "e1", subject: "Facture #101", body: "Merci pour votre achat...", date: new Date().toISOString() },
    ],
    calls: [{ id: "call1", direction: "in", note: "Demande de prix", date: new Date().toISOString() }],
    purchases: [{ id: "p1", item: "Licence Pro", amount: 499.0, date: new Date().toISOString() }],
  },
  {
    id: "c_2",
    name: "Marie Durant",
    company: "Startup X",
    email: "marie@startup.test",
    phone: "+33 6 98 76 54 32",
    notes: "",
    emails: [],
    calls: [],
    purchases: [],
  },
];
