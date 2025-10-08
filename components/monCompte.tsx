"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {  useMemo } from "react";
import {
  Group,
  User2,
  UserPlus,
  Plus,
  MoreVertical,
  Edit,
  ArrowLeft,
  Search,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Pencil, Check, Trash2, X } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import bcrypt from "bcryptjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
type User = {
  id: string;
  name: string | null;
  email: string | null;
  role?: "USER" | "ADMIN";
};
type Group = {
  id: string;
  name: string | null;
  participants: { user: User }[];
};

export function Compte({ onBack }: { onBack: () => void }) {
  const { data: session } = useSession();
  const user = session?.user;
  const role = session?.user?.role;
  const { toast } = useToast();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [newName, setNewName] = useState(user?.name || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");

  const handleNameSave = async () => {
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) throw new Error("Erreur de mise à jour du nom");

      toast({
        title: "Nom mis à jour ✅",
        description: "Votre nom a été enregistré avec succès.",
        variant: "default",
      });
      setIsEditingName(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur ❌",
        description: "Impossible de mettre à jour le nom.",
        variant: "destructive",
      });
    }
  };

  const handleEmailSave = async () => {
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!res.ok) throw new Error("Erreur de mise à jour de l’email");

      toast({
        title: "Email mis à jour ✅",
        description: "Votre adresse email a été enregistrée avec succès.",
        variant: "default",
      });
      setIsEditingEmail(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur ❌",
        description: "Impossible de mettre à jour l’email.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSave = async () => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: hashedPassword,
          userId: (user as any)?.id,
        }),
      });

      if (!res.ok)
        throw new Error("Erreur lors de la mise à jour du mot de passe");

      toast({
        title: "Mot de passe mis à jour 🔐",
        description: "Votre mot de passe a été modifié avec succès.",
        variant: "default",
      });

      setIsEditingPassword(false);
      setNewPassword("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur ❌",
        description: "Impossible de mettre à jour le mot de passe.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="text-gray-700 flex flex-col   gap-10 justify-around flex-wrap">
      <Card className="flex flex-col justify-start  border roubded-lg p-6 w-200">
        <CardHeader className="flex flex-col  items-start ">
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← retour
          </button>
          <CardTitle>Paramètres du compte</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 w-100">
          <div className="space-y-2">
            <Label>Photo de profil</Label>
            <div className="flex items-center gap-4">
              <img
                src={user?.image || "/placeholder.svg"}
                alt="Photo de profil"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <Button disabled>Changer la photo</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nom</Label>
            <div className="flex items-center gap-2">
              <Input
                value={isEditingName ? newName : user?.name || ""}
                onChange={(e) => setNewName(e.target.value)}
                disabled={!isEditingName}
                className={`w-80 ${
                  isEditingName ? "bg-white" : "bg-gray-100 text-gray-500"
                } border-none focus:ring-0`}
              />
              {isEditingName ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleNameSave}
                    className="h-8 w-8 text-green-500 hover:scale-110"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditingName(false)}
                    className="h-8 w-8 text-red-500 hover:scale-110"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditingName(true)}
                  className="h-8 w-8 text-muted-foreground hover:scale-110 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <div className="flex items-center gap-2">
              <Input
                value={isEditingEmail ? newEmail : user?.email || ""}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={!isEditingEmail}
                className={`w-80 ${
                  isEditingEmail ? "bg-white" : "bg-gray-100 text-gray-500"
                } border-none focus:ring-0`}
              />
              {isEditingEmail ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleEmailSave}
                    className="h-8 w-8 text-green-500 hover:scale-110"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditingEmail(false)}
                    className="h-8 w-8 text-red-500 hover:scale-110"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditingEmail(true)}
                  className="h-8 w-8 text-muted-foreground hover:scale-110 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Rôle */}
          <div className="space-y-2">
            <Label>Rôle</Label>
            <Input value={(user as any)?.role || ""} disabled />
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <Label>Mot de passe</Label>
            {!isEditingPassword ? (
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  value="********"
                  disabled
                  className="w-80 bg-gray-100 text-gray-500 border-none focus:ring-0"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditingPassword(true)}
                  className="h-8 w-8 text-muted-foreground hover:scale-110 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-80"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handlePasswordSave}
                  className="h-8 w-8 text-green-500 hover:scale-110"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditingPassword(false)}
                  className="h-8 w-8 text-red-500 hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function Groupes({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: "",
    selectedUsers: [] as string[],
  });
  const [editparam, setEditParam] = useState(false);

  async function loadUsers() {
    const res = await fetch("/api/users", {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  }

  async function loadGroups() {
    const res = await fetch("/api/messages/groups", {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    const data = await res.json();
    setGroups(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadUsers();
    loadGroups();
  }, []);

  async function createGroup() {
    if (!groupForm.name.trim() || groupForm.selectedUsers.length < 2) {
      alert("Nom requis et au moins 2 membres");
      return;
    }

    try {
      const res = await fetch("/api/messages/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupForm.name.trim(),
          userIds: groupForm.selectedUsers,
        }),
        cache: "no-store",
        next: { revalidate: 0 },
      });

      if (res.ok) {
        setGroupForm({ name: "", selectedUsers: [] });
        setShowCreateGroup(false);
        await loadGroups();
        alert("Groupe créé avec succès!");
      } else {
        alert("Erreur lors de la création du groupe");
      }
    } catch (error) {
      alert("Erreur lors de la création du groupe");
    }
  }

  function toggleUser(userId: string) {
    setGroupForm((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter((id) => id !== userId)
        : [...prev.selectedUsers, userId],
    }));
  }

  const filteredGroups = groups.filter(
    (group) =>
      (group.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.participants.some(
        (p) =>
          (p.user.name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (p.user.email || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="h-full flex flex-col p-0">
      {/* Header */}

      <header className="border-b border-border bg-card">
        <div className="pl-6 pb-6">
          <div className="flex gap-6 items-center ">
            <button
              onClick={onBack}
              className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← retour
            </button>
            <h3 className="text-xl font-bold mb-4">Gestion des groupes</h3>
          </div>

          {/* Recherche + Bouton alignés */}
          <div className="flex items-center gap-3 max-w-2xl">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Rechercher un groupe ou un membre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full"
              />
            </div>
            <Button className="gap-2" onClick={() => setShowCreateGroup(true)}>
              <Plus className="h-4 w-4" />
              Nouveau groupe
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <User2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun groupe trouvé</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchQuery
                ? "Essayez de modifier votre recherche"
                : "Commencez par créer votre premier groupe"}
            </p>
            {!searchQuery && (
              <Button
                className="gap-2"
                onClick={() => setShowCreateGroup(true)}
              >
                <Plus className="h-4 w-4" />
                Créer un groupe
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onUpdate={loadGroups}
                users={users}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowCreateGroup(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 shadow-2xl">
              <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Créer un nouveau groupe
                  </h2>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowCreateGroup(false)}
                    className="h-8 w-8 text-muted-foreground transition-all hover:rotate-90 hover:text-foreground"
                  >
                    <Plus className="h-4 w-4 rotate-45" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label htmlFor="groupName" className="text-sm font-medium">
                    Nom du groupe
                  </Label>
                  <Input
                    id="groupName"
                    value={groupForm.name}
                    onChange={(e) =>
                      setGroupForm({ ...groupForm, name: e.target.value })
                    }
                    placeholder="Ex: Marketing, Développement..."
                    className="transition-all focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Membres ({groupForm.selectedUsers.length})
                  </Label>
                  <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={groupForm.selectedUsers.includes(user.id)}
                          onChange={() => toggleUser(user.id)}
                          className="rounded border-border"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User2 className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {user.name ?? "Utilisateur"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-border/50 bg-muted/20 px-6 py-4">
                <Button
                  onClick={createGroup}
                  className="flex-1 transition-all hover:scale-105"
                  disabled={
                    groupForm.name.trim().length === 0 ||
                    groupForm.selectedUsers.length < 2
                  }
                >
                  Créer le groupe
                </Button>
                <Button
                  onClick={() => setShowCreateGroup(false)}
                  variant="outline"
                  className="flex-1 transition-all hover:scale-105 bg-transparent"
                >
                  Annuler
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function GroupCard({
  group,
  onUpdate,
  users,
}: {
  group: Group;
  onUpdate: () => void;
  users: User[];
}) {
  const [editingGroup, setEditingGroup] = useState<{
    id: string;
    name: string;
    members: string[];
  } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  async function deleteGroup() {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
      await fetch(`/api/messages/groups/${group.id}`, {
        method: "DELETE",
        cache: "no-store",
        next: { revalidate: 0 },
      });
      onUpdate();
    }
  }

  async function updateGroup() {
    if (!editingGroup) return;
    await fetch(`/api/messages/groups/${group.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editingGroup.name,
        userIds: editingGroup.members,
      }),
      cache: "no-store",
      next: { revalidate: 0 },
    });
    setEditingGroup(null);
    onUpdate();
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {group.name || "Groupe"}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {group.participants.length}{" "}
                {group.participants.length === 1 ? "membre" : "membres"}
              </CardDescription>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowMenu((prev) => !prev)} // toggle uniquement pour cette carte
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50">
                <div
                  className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent gap-2"
                  onClick={() => {
                    setEditingGroup({
                      id: group.id,
                      name: group.name || "",
                      members: group.participants.map((p) => p.user.id),
                    });
                    setShowMenu(false);
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </div>
                <div className="-mx-1 my-1 h-px bg-muted" />
                <div
                  className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-destructive gap-2"
                  onClick={() => {
                    deleteGroup();
                    setShowMenu(false);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {editingGroup ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Nom du groupe</Label>
              <Input
                value={editingGroup.name}
                onChange={(e) =>
                  setEditingGroup({ ...editingGroup, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Membres</Label>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-2 bg-muted/30">
                {users.map((u) => (
                  <label
                    key={u.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={editingGroup.members.includes(u.id)}
                      onChange={() => {
                        setEditingGroup((prev) => {
                          if (!prev) return prev;
                          const present = prev.members.includes(u.id);
                          return {
                            ...prev,
                            members: present
                              ? prev.members.filter((id) => id !== u.id)
                              : [...prev.members, u.id],
                          };
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {u.name ?? u.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {u.email}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={updateGroup} size="sm">
                Enregistrer
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingGroup(null)}
                size="sm"
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Membres</span>
            </div>
            <div className="max-h-64 overflow-y-auto pr-1 space-y-2">
              {group.participants.map((participant) => (
                <div
                  key={participant.user.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/40 transition-colors border border-border/40"
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {participant.user.name || "Utilisateur"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {participant.user.email}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors border-transparent bg-secondary text-secondary-foreground">
                    {participant.user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Users({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as "USER" | "ADMIN",
  });

  async function downloadCSV() {
    try {
      const res = await fetch("/api/users/export", {
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "utilisateurs.csv";
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
    } catch {}
    const csv = [
      ["Nom", "Email", "Rôle"],
      ...users.map((u) => [u.name ?? "", u.email ?? "", u.role ?? "USER"]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "utilisateurs.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function loadUsers() {
    setLoading(true);
    const res = await fetch("/api/users", { cache: "no-store" });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleDelete(userId: string) {
    await fetch(`/api/users/${userId}`, { method: "DELETE" });
    await loadUsers();
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setIsCreating(false);
    setFormData({
      name: user.name ?? "",
      email: user.email ?? "",
      password: "",
      role: (user.role ?? "USER") as "USER" | "ADMIN",
    });
  }

  async function handleSave() {
    const body: any = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };
    if (formData.password) body.password = formData.password;

    if (isCreating) {
      await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else if (editingUser) {
      await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setEditingUser(null);
    setIsCreating(false);
    setFormData({ name: "", email: "", password: "", role: "USER" });
    await loadUsers();
  }

  function handleCancel() {
    setEditingUser(null);
    setIsCreating(false);
    setFormData({ name: "", email: "", password: "", role: "USER" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={onBack}
              className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← retour
            </button>
            <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
            <p className="mt-2 text-muted-foreground">
              Gérez les utilisateurs de votre application
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setIsCreating(true);
                setEditingUser(null);
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  role: "USER",
                });
              }}
            >
              Ajouter
            </Button>
            <Button variant="outline" onClick={downloadCSV}>
              Télécharger CSV
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-[2fr_3fr_1.5fr] gap-4 border-b border-border/50 bg-muted/30 px-6 py-4 text-sm font-semibold text-muted-foreground">
                <div>Nom</div>
                <div>Email</div>
                <div>Rôle</div>
              </div>
              <div className="divide-y divide-border/30">
                {users.map((user, index) => (
                  <div
                    key={user.id}
                    className="group relative grid grid-cols-[2fr_3fr_1.5fr] gap-4 px-6 py-4 transition-all duration-300 hover:bg-accent/50 animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center font-medium text-foreground">
                      {user.name ?? "—"}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      {user.email ?? "—"}
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          (user.role ?? "USER") === "ADMIN"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.role ?? "USER"}
                      </span>
                      <div className="flex gap-2  duration-200 ">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8 text-muted-foreground transition-all hover:scale-110 hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(user.id)}
                          className="h-8 w-8 text-muted-foreground transition-all hover:scale-110 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(editingUser || isCreating) && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={handleCancel}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 shadow-2xl">
                <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                      {isCreating
                        ? "Ajouter un utilisateur"
                        : "Modifier l'utilisateur"}
                    </h2>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCancel}
                      className="h-8 w-8 text-muted-foreground transition-all hover:rotate-90 hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-6 p-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nom
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="transition-all focus:scale-[1.02]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="transition-all focus:scale-[1.02]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Mot de passe
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Laisser vide pour ne pas changer
                    </p>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="transition-all focus:scale-[1.02]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Rôle
                    </Label>
                    <select
                      id="role"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm transition-all focus:scale-[1.02]"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as "USER" | "ADMIN",
                        })
                      }
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 border-t border-border/50 bg-muted/20 px-6 py-4">
                  <Button
                    onClick={handleSave}
                    className="flex-1 transition-all hover:scale-105"
                  >
                    {isCreating ? "Ajouter" : "Mettre à jour"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 transition-all hover:scale-105 bg-transparent"
                  >
                    Annuler
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function Paramtres() {
  const { data: session } = useSession();
  const role = session?.user?.role || "USER";
  const [pageDisplay, setPageDisplay] = useState("");
  const handleBack = () => {
    setPageDisplay("");
  };
  if (pageDisplay === "Compte") {
    return <Compte onBack={() => handleBack()} />;
  }
  if (pageDisplay === "Users") {
    return <Users onBack={() => handleBack()} />;
  }
  if (pageDisplay === "Groupes") {
    return <Groupes onBack={() => handleBack()} />;
  }
  return (
    <div className="text-gray-700 flex flex-col gap-10 justify-around flex-wrap">
      <Card className="flex flex-col justify-start border rounded-lg p-6 w-200">
        <CardHeader>
          <CardTitle>Paramètres du profil</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Modifiez vos informations personnelles et mettez à jour votre mot
              de passe.
            </p>

            <button
              onClick={() => setPageDisplay("Compte")}
              className="flex items-center gap-1 text-primary font-medium hover:underline hover:text-primary/80 transition"
            >
              <span>Accéder</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
      {role === "ADMIN" && (
        <>
          <Card className="flex flex-col justify-start border rounded-lg p-6 w-200">
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Consultez la liste des utilisateurs, créez de nouveaux comptes
                  ou supprimez-en si nécessaire.
                </p>

                <button
                  onClick={() => setPageDisplay("Users")}
                  className="flex items-center gap-1 text-primary font-medium hover:underline hover:text-primary/80 transition"
                >
                  <span>Accéder</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-start border rounded-lg p-6 w-200">
            <CardHeader>
              <CardTitle>Gestion des groupes</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Créez et gérez des groupes de discussion pour faciliter la
                  communication entre utilisateurs.
                </p>

                <button
                  onClick={() => setPageDisplay("Groupes")}
                  className="flex items-center gap-1 text-primary font-medium hover:underline hover:text-primary/80 transition"
                >
                  <span>Accéder</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}




export  function ClientCRMPanel({ initialClients = null, onSaveClient = null }) {
  // sample mock data if none passed
  const sampleClients = [
    {
      id: "1",
      name: "Amine Benali",
      company: "TechCorp",
      email: "amine.benali@example.com",
      phone: "+213661234567",
      notes: "Client important - interessé par la formation",
      contacts: [
        { id: "c1", name: "Amine Benali", role: "Decision-maker", phone: "+213661234567", email: "amine.benali@example.com" },
      ],
      emails: [
        { id: "e1", subject: "Proposition commerciale", date: "2025-09-20", snippet: "Bonjour Amine..." },
      ],
      calls: [
        { id: "call1", date: "2025-09-22", duration: "00:12:23", notes: "Appel de qualification" },
      ],
      purchases: [
        { id: "p1", date: "2025-08-15", item: "Formation JS avancé", amount: 1200 },
      ],
    },
    {
      id: "2",
      name: "Sofia Haddad",
      company: "ÉduPlus",
      email: "sofia.h@eduplus.com",
      phone: "+213670000000",
      notes: "A suivre pour la solution e-learning",
      contacts: [],
      emails: [],
      calls: [],
      purchases: [],
    },
  ]

  const [clients, setClients] = useState(initialClients ?? sampleClients)
  const [selectedId, setSelectedId] = useState(clients[0]?.id ?? null)
  const [query, setQuery] = useState("")
  const [showNewModal, setShowNewModal] = useState(false)

  const selectedClient = useMemo(() => clients.find((c) => c.id === selectedId) ?? null, [clients, selectedId])

  // CRUD helpers (local only) - adapt to call API if needed
  function addClient(payload) {
    const id = Date.now().toString()
    const newClient = { id, ...payload, contacts: payload.contacts || [], emails: [], calls: [], purchases: [] }
    const next = [newClient, ...clients]
    setClients(next)
    setSelectedId(id)
    if (onSaveClient) onSaveClient(newClient)
  }

  function updateClient(id, patch) {
    const next = clients.map((c) => (c.id === id ? { ...c, ...patch } : c))
    setClients(next)
  }

  function removeClient(id) {
    const next = clients.filter((c) => c.id !== id)
    setClients(next)
    if (next.length) setSelectedId(next[0].id)
    else setSelectedId(null)
  }

  // Add note example for calls / emails / purchases
  function addEmail(clientId, email) {
    updateClient(clientId, { emails: [ ...(clients.find(c=>c.id===clientId).emails||[]), { id: Date.now().toString(), ...email } ] })
  }

  function addCall(clientId, call) {
    updateClient(clientId, { calls: [ ...(clients.find(c=>c.id===clientId).calls||[]), { id: Date.now().toString(), ...call } ] })
  }

  function addPurchase(clientId, purchase) {
    updateClient(clientId, { purchases: [ ...(clients.find(c=>c.id===clientId).purchases||[]), { id: Date.now().toString(), ...purchase } ] })
  }

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.company?.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="h-full min-h-[520px] grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-4 p-4">
      {/* Sidebar: clients list */}
      <aside className="border border-gray-200 rounded-lg p-3 h-[calc(100vh-6rem)] overflow-y-auto bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Clients</h3>
          <div className="flex gap-2">
            <button onClick={() => setShowNewModal(true)} className="px-3 py-1 rounded-md bg-sky-600 text-white text-sm">Nouveau</button>
            <button onClick={() => { setClients(sampleClients); setQuery(""); }} className="px-2 py-1 rounded-md border text-sm">Reset</button>
          </div>
        </div>

        <div className="mb-3">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Rechercher..." className="w-full px-3 py-2 border rounded-md text-sm" />
        </div>

        <div>
          {filtered.length === 0 && <div className="text-sm text-muted-foreground">Aucun client</div>}
          <ul className="space-y-2">
            {filtered.map((c) => (
              <li key={c.id} className={`p-2 rounded-md cursor-pointer hover:bg-slate-50 ${c.id === selectedId ? 'bg-slate-100 border-l-4 border-sky-500' : ''}`} onClick={() => setSelectedId(c.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.company} • {c.email}</div>
                  </div>
                  <div className="text-xs text-gray-400">{c.purchases?.length || 0} achats</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main: detail + tabs */}
      <main className="border border-gray-200 rounded-lg p-4 h-[calc(100vh-6rem)] overflow-y-auto bg-white">
        {!selectedClient ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Aucun client sélectionné</p>
            <button onClick={()=>setShowNewModal(true)} className="mt-3 px-4 py-2 rounded-md bg-sky-600 text-white">Créer un client</button>
          </div>
        ) : (
          <ClientDetail
            client={selectedClient}
            onEdit={(patch)=>updateClient(selectedClient.id, patch)}
            onDelete={()=>removeClient(selectedClient.id)}
            onAddEmail={(email)=>addEmail(selectedClient.id, email)}
            onAddCall={(call)=>addCall(selectedClient.id, call)}
            onAddPurchase={(p)=>addPurchase(selectedClient.id, p)}
          />
        )}
      </main>

      {showNewModal && (
        <Modal onClose={()=>setShowNewModal(false)}>
          <NewClientForm onCancel={()=>setShowNewModal(false)} onCreate={(data)=>{ addClient(data); setShowNewModal(false); }} />
        </Modal>
      )}
    </div>
  )
}

function ClientDetail({ client , onEdit, onDelete, onAddEmail, onAddCall, onAddPurchase }){
  const [tab, setTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ name: client.name, company: client.company, email: client.email, phone: client.phone, notes: client.notes })

  // sync if client changes
  useEffect(()=>{
    setForm({ name: client.name, company: client.company, email: client.email, phone: client.phone, notes: client.notes })
  }, [client])

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{client.name}</h2>
          <div className="text-sm text-gray-500">{client.company} • {client.email} • {client.phone}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setIsEditing(!isEditing)} className="px-3 py-1 rounded border">{isEditing ? 'Annuler' : 'Modifier'}</button>
          <button onClick={onDelete} className="px-3 py-1 rounded border text-red-600">Supprimer</button>
        </div>
      </div>

      {isEditing ? (
        <div className="border p-3 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="p-2 border rounded" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
            <input className="p-2 border rounded" value={form.company} onChange={(e)=>setForm({...form, company:e.target.value})} />
            <input className="p-2 border rounded" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
            <input className="p-2 border rounded" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
            <textarea className="p-2 border rounded md:col-span-2" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={()=>{ onEdit(form); setIsEditing(false); }} className="px-3 py-1 rounded bg-green-600 text-white">Enregistrer</button>
            <button onClick={()=>{ setForm({ name: client.name, company: client.company, email: client.email, phone: client.phone, notes: client.notes }); setIsEditing(false); }} className="px-3 py-1 rounded border">Annuler</button>
          </div>
        </div>
      ) : (
        <div className="border p-3 rounded">
          <p className="text-sm whitespace-pre-wrap">{client.notes || 'Aucune note'}</p>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <TabButton label="Overview" active={tab==='overview'} onClick={()=>setTab('overview')} />
        <TabButton label={`Contacts (${client.contacts?.length||0})`} active={tab==='contacts'} onClick={()=>setTab('contacts')} />
        <TabButton label={`Emails (${client.emails?.length||0})`} active={tab==='emails'} onClick={()=>setTab('emails')} />
        <TabButton label={`Appels (${client.calls?.length||0})`} active={tab==='calls'} onClick={()=>setTab('calls')} />
        <TabButton label={`Achats (${client.purchases?.length||0})`} active={tab==='purchases'} onClick={()=>setTab('purchases')} />
      </div>

      <div>
        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border p-3 rounded">
              <h4 className="font-medium">Informations</h4>
              <div className="text-sm text-gray-600 mt-2">
                <div><strong>Email:</strong> {client.email}</div>
                <div><strong>Téléphone:</strong> {client.phone}</div>
                <div><strong>Entreprise:</strong> {client.company}</div>
              </div>
            </div>
            <div className="border p-3 rounded">
              <h4 className="font-medium">Résumé</h4>
              <div className="text-sm text-gray-600 mt-2">{client.contacts?.length || 0} contacts • {client.emails?.length || 0} emails • {client.calls?.length || 0} appels • {client.purchases?.length || 0} achats</div>
            </div>
          </div>
        )}

        {tab === 'contacts' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Contacts</h4>
              {/* Add contact - for simplicity it's a quick inline form */}
            </div>

            {client.contacts?.length === 0 && <div className="text-sm text-gray-500">Aucun contact</div>}
            <ul className="space-y-2">
              {client.contacts?.map((ct) => (
                <li key={ct.id} className="p-2 border rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{ct.name}</div>
                      <div className="text-xs text-gray-500">{ct.role} • {ct.email} • {ct.phone}</div>
                    </div>
                    <div className="text-sm text-gray-400">—</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'emails' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Emails</h4>
              <QuickEmail onSend={(e)=>onAddEmail(e)} />
            </div>
            <ul className="space-y-2">
              {client.emails?.map((em) => (
                <li key={em.id} className="p-2 border rounded">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{em.subject}</div>
                      <div className="text-xs text-gray-500">{em.date} · {em.snippet}</div>
                    </div>
                    <div className="text-xs text-gray-400">{em.id}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'calls' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Appels</h4>
              <QuickCall onAdd={(c)=>onAddCall(c)} />
            </div>
            <ul className="space-y-2">
              {client.calls?.map((call) => (
                <li key={call.id} className="p-2 border rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{call.date} — {call.duration}</div>
                      <div className="text-xs text-gray-500">{call.notes}</div>
                    </div>
                    <div className="text-xs text-gray-400">{call.id}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'purchases' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Achats</h4>
              <QuickPurchase onAdd={(p)=>onAddPurchase(p)} />
            </div>
            <ul className="space-y-2">
              {client.purchases?.map((p) => (
                <li key={p.id} className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{p.item}</div>
                    <div className="text-xs text-gray-500">{p.date} • {p.amount} DA</div>
                  </div>
                  <div className="text-xs text-gray-400">{p.id}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({ label, active, onClick }){
  return (
    <button onClick={onClick} className={`px-3 py-1 rounded ${active ? 'bg-sky-600 text-white' : 'border'}`}>{label}</button>
  )
}

function QuickEmail({ onSend }){
  const [subject, setSubject] = useState("")
  const [snippet, setSnippet] = useState("")
  return (
    <div className="flex items-center gap-2">
      <input value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Objet" className="px-2 py-1 border rounded text-sm" />
      <input value={snippet} onChange={(e)=>setSnippet(e.target.value)} placeholder="Bref extrait" className="px-2 py-1 border rounded text-sm" />
      <button onClick={()=>{ if(subject) { onSend({ subject, snippet, date: new Date().toISOString().split('T')[0] }); setSubject(''); setSnippet('') } }} className="px-3 py-1 rounded bg-sky-600 text-white text-sm">Envoyer</button>
    </div>
  )
}

function QuickCall({ onAdd }){
  const [notes, setNotes] = useState("")
  const [duration, setDuration] = useState("")
  return (
    <div className="flex items-center gap-2">
      <input value={duration} onChange={(e)=>setDuration(e.target.value)} placeholder="durée (mm:ss)" className="px-2 py-1 border rounded text-sm w-32" />
      <input value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes" className="px-2 py-1 border rounded text-sm" />
      <button onClick={()=>{ if(duration) { onAdd({ date: new Date().toISOString().split('T')[0], duration, notes }); setDuration(''); setNotes('') } }} className="px-3 py-1 rounded bg-sky-600 text-white text-sm">Ajouter</button>
    </div>
  )
}

function QuickPurchase({ onAdd }){
  const [item, setItem] = useState("")
  const [amount, setAmount] = useState("")
  return (
    <div className="flex items-center gap-2">
      <input value={item} onChange={(e)=>setItem(e.target.value)} placeholder="Produit / Service" className="px-2 py-1 border rounded text-sm" />
      <input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Montant" className="px-2 py-1 border rounded text-sm w-24" />
      <button onClick={()=>{ if(item && amount) { onAdd({ date: new Date().toISOString().split('T')[0], item, amount: parseFloat(amount) }); setItem(''); setAmount('') } }} className="px-3 py-1 rounded bg-sky-600 text-white text-sm">Ajouter</button>
    </div>
  )
}

// Simple modal
function Modal({ children, onClose }){
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500">Fermer</button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}

function NewClientForm({ onCancel, onCreate }){
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', notes: '' })
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Créer un client</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input placeholder="Nom" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="p-2 border rounded" />
        <input placeholder="Entreprise" value={form.company} onChange={(e)=>setForm({...form, company:e.target.value})} className="p-2 border rounded" />
        <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="p-2 border rounded" />
        <input placeholder="Téléphone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} className="p-2 border rounded" />
        <textarea placeholder="Notes" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} className="p-2 border rounded md:col-span-2" />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-3 py-1 rounded border">Annuler</button>
        <button onClick={()=>{ if(!form.name) return alert('Nom requis'); onCreate(form) }} className="px-3 py-1 rounded bg-sky-600 text-white">Créer</button>
      </div>
    </div>
  )
}




export function Pipeline() {
  return <div>Pipeline</div>;
}



type Conversation = {
  id: string;
  isGroup: boolean;
  name: string | null;
  participants: Array<{
    user: { id: string; name: string | null; email: string | null };
  }>;
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; name: string | null; email: string | null };
};

export function Discussion() {
  const [showSearch, setShowSearch] = useState(false)
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "group" | "friend">("all");
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [messagesCache, setMessagesCache] = useState<Record<string, Message[]>>(
    {}
  );
  const pollRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState(""); 
    const [searchMessege, setSearchMessege] = useState(""); 

  const currentUserId = (session?.user as any)?.id;

  async function loadConversations() {
    const res = await fetch("/api/messages/conversations", {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    const data = await res.json();
    setConversations(Array.isArray(data) ? data : []);
  }

  async function loadMessages(id: string) {
    setLoadingMessages(true);
    const res = await fetch(`/api/messages/${id}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    setMessages(list);
    setMessagesCache((prev) => ({ ...prev, [id]: list }));
    setLoadingMessages(false);
  }

  useEffect(() => {
    loadConversations();
  }, []);
  useEffect(() => {
    if (!activeId) return;
    if (messagesCache[activeId]) {
      setMessages(messagesCache[activeId]);
    } else {
      loadMessages(activeId);
    }
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = window.setInterval(() => loadMessages(activeId), 3000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!activeId || input.trim().length === 0) return;
    const res = await fetch(`/api/messages/${activeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim() }),
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (res.ok) {
      setInput("");
      await loadMessages(activeId);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  function getConversationName(conversation: Conversation) {
    if (conversation.isGroup) {
      return conversation.name ?? "Groupe";
    }
    const otherParticipant = conversation.participants.find(
      (p) => p.user.id !== currentUserId
    );
    return (
      otherParticipant?.user?.name ??
      otherParticipant?.user?.email ??
      "Utilisateur"
    );
  }
  const filteredConversations = conversations
    .filter((c) =>
      filter === "all" ? true : filter === "group" ? c.isGroup : !c.isGroup
    )
    .filter((c) =>
      getConversationName(c).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredMessages = searchMessege
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchMessege.toLowerCase())
      )
    : messages;
 return (
    <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr] h-[calc(100vh-12rem)]">
      {/* Liste des conversations */}
      <CardContent className="border-r border-border/50 overflow-y-auto h-full">
        <div className="sticky top-0 bg-background z-10 py-2 space-y-2">
          <div className="flex items-center gap-2">
            {["all", "group", "friend"].map((type) => (
              <button
                key={type}
                className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  filter === type
                    ? "bg-accent border-border"
                    : "border-transparent hover:bg-accent"
                }`}
                onClick={() => setFilter(type as any)}
              >
                {type === "all"
                  ? "Tout"
                  : type === "group"
                  ? "Groupe"
                  : "Ami"}
              </button>
            ))}
          </div>
          <Input
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm"
          />
        </div>

        <div className="space-y-1 pb-10 mt-2">
          {filteredConversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors ${
                activeId === c.id ? "bg-accent" : ""
              }`}
            >
              <div className="text-sm font-medium truncate">
                {getConversationName(c)}
              </div>
              {c.isGroup && (
                <div className="text-[11px] text-muted-foreground">Groupe</div>
              )}
            </button>
          ))}
          {filteredConversations.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Aucun résultat trouvé
            </p>
          )}
        </div>
      </CardContent>

      {/* Zone de messages */}
      <CardContent className="flex flex-col h-full overflow-y-auto">
        {activeId ? (
          (() => {
            const activeConversation = conversations.find(
              (c) => c.id === activeId
            )

            return (
              <>
                {/* En-tête (comme Telegram) */}
                <div className="flex items-center justify-between border-b pb-3 mb-3 sticky top-0 bg-background z-10">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveId(null)}
                      className="md:hidden"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                      <h2 className="font-semibold text-sm">
                        {activeConversation?.isGroup
                          ? activeConversation.name
                          : activeConversation?.participants?.find(
                              (p) => p.user.id !== currentUserId
                            )?.user.name || "Utilisateur"}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {activeConversation?.isGroup
                          ? `${activeConversation.participants.length} membres`
                          : "en ligne"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSearch(!showSearch)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Barre de recherche (affichée quand showSearch = true) */}
                {showSearch && (
                  <div className="p-2 border-b bg-muted/20 rounded-md mb-2">
                    <Input
                      placeholder="Rechercher un mot dans la conversation..."
                      value={searchMessege}
                      onChange={(e) => setSearchMessege(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                )}

                {/* Liste des messages */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                  {loadingMessages && !messages.length && (
                    <div className="text-xs text-muted-foreground">
                      Chargement…
                    </div>
                  )}

                  {filteredMessages.map((m) => {
                    const isCurrentUser = m.senderId === currentUserId
                    return (
                      <div
                        key={m.id}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            isCurrentUser ? "order-2" : "order-1"
                          }`}
                        >
                          {!isCurrentUser && (
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <User2 className="w-3 h-3 text-primary" />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground">
                                {m.sender.name ??
                                  m.sender.email ??
                                  "Utilisateur"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(m.createdAt)}
                              </span>
                            </div>
                          )}
                          <div
                            className={`rounded-lg px-3 py-2 text-sm ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {m.content}
                          </div>
                          {isCurrentUser && (
                            <div className="text-right mt-1">
                              <span className="text-xs text-muted-foreground">
                                {formatDate(m.createdAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie */}
                <div className="flex gap-2 sticky bottom-0 bg-background pt-2">
                  <Input
                    placeholder="Votre message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                  />
                  <Button onClick={send} disabled={input.trim().length === 0}>
                    Envoyer
                  </Button>
                </div>
              </>
            )
          })()
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <User2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  )
}

