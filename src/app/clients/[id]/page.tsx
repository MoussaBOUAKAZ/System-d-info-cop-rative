"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "../../../../components/ui/header";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import {
  Mail,
  Phone,
  Building2,
  MapPin,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import EditContactForm from "./EditContact/page";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(`/api/contacts/${params.id}`);
        if (!res.ok) throw new Error("Erreur API");
        const data = await res.json();
        setContact(data);
      } catch (error) {
        console.error("Erreur chargement contact:", error);
      }
    };

    fetchContact();
  }, [params.id]);
  const onClose= ()=>{
    setShowEditForm(false);
  } 
  const handleDelete = async () => {
  const id1 = String(params.id);
  try {
    const res = await fetch(`/api/contacts/${id1}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erreur suppression contact");

    alert("✅ Contact supprimé avec succès !");
    // Tu peux ensuite rafraîchir la liste :
    // router.refresh() ou recharger les données
  } catch (error) {
    console.error(error);
    alert("❌ Impossible de supprimer le contact");
  }
};

  return (
    <>
      <Header
        title={contact?.fullName}
        description={
          contact?.position || contact?.company
            ? `${contact.position} chez ${contact.company}`
            : "Individuelle"
        }
        action={{
          label: "Modifier",
          onClick: () => setShowEditForm(true),
          icon: Edit,
        }}
      />

      <div className="p-8 space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux contacts
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations principales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{contact?.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <Badge
                      variant={
                        contact?.status === "active"
                          ? "default"
                          : contact?.status === "prospect"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {contact?.status === "active" && "Actif"}
                      {contact?.status === "prospect" && "Prospect"}
                      {contact?.status === "inactive" && "Inactif"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entreprise</p>
                    <p className="font-medium">{contact?.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Poste</p>
                    <p className="font-medium">{contact?.position}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coordonnées */}
            <Card>
              <CardHeader>
                <CardTitle>Coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{contact?.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{contact?.phone}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">{contact?.address}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ville / Pays
                    </p>
                    <p className="font-medium">
                      {contact?.city}, {contact?.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historique */}
            <Card>
              <CardHeader>
                <CardTitle>Historique des interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contact &&
                    contact?.interactions.map((item: any, index: any) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          {index !== contact?.interactions.length - 1 && (
                            <div className="w-px h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline">{item.type}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {item.date}
                            </span>
                          </div>
                          <p className="text-sm">{item.subject}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Commercial Info */}
          <div className="space-y-6">
            {/* Informations commerciales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations commerciales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Valeur potentielle
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {contact?.value}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Cycle de vente
                  </p>
                  <p className="font-medium">{contact?.salesStage}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Responsable de compte
                  </p>
                  <p className="font-medium">{contact?.accountManager}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Dernier contact?
                  </p>
                  <p className="font-medium">{contact?.lastContact}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer un email
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={() => setShowEditForm(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button className="w-full" variant="destructive" onClick={()=> handleDelete()} >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </CardContent>
            </Card>
            {showEditForm && contact && (
              <EditContactForm contactId={contact.id} onClose={onClose} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
