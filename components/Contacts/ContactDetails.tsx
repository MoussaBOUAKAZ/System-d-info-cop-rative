"use client";

import { Mail, Phone, Building2, MapPin } from "lucide-react";

interface ContactDetailsProps {
  contact: any;
}

export default function ContactDetails({ contact }: ContactDetailsProps) {
  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground border rounded-lg p-10">
        <p>Sélectionnez un contact pour afficher les détails</p>
      </div>
    );
  }
  const handleSendEmail = () => {
    const subject = encodeURIComponent("Bonjour " + contact.name);
    const body = encodeURIComponent("Bonjour " + contact.name + ",\n\n");
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };
  return (
    <div className="flex-1 border rounded-lg bg-card text-card-foreground p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{contact.name}</h2>
        <span className="text-sm text-muted-foreground">
          Détails complets du contact
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 🧍 Informations principales */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Informations principales</h3>
          <p>
            <strong>Type :</strong> {contact.type}
          </p>
          <p>
            <strong>Entreprise :</strong> {contact.company}
          </p>
          <p>
            <strong>Poste :</strong> {contact.position}
          </p>
          <p>
            <strong>Statut :</strong> {contact.status}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Coordonnées</h3>
          <p className="flex items-center gap-2"  onClick={handleSendEmail}>
            <Mail className="h-4 w-4" /> {contact.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> {contact.phone}
          </p>
          <p className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> {contact.address}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {contact.city}, {contact.country}
          </p>
        </div>

        {/* 💰 Informations commerciales */}
        <div className="col-span-2 space-y-2">
          <h3 className="font-semibold text-lg">Informations commerciales</h3>
          <p>
            <strong>Valeur potentielle :</strong> {contact.value}
          </p>
          <p>
            <strong>Cycle de vente :</strong> {contact.salesStage}
          </p>
          <p>
            <strong>Responsable :</strong> {contact.accountManager}
          </p>
        </div>

        {/* 🛍️ Historique */}
        <div className="col-span-2 space-y-2">
          <h3 className="font-semibold text-lg">Historique</h3>
          <ul className="list-disc ml-5 text-sm text-muted-foreground">
            {contact.history?.length > 0 ? (
              contact.history.map((item: any, i: number) => (
                <li key={i}>{item}</li>
              ))
            ) : (
              <li>Aucune interaction enregistrée.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
