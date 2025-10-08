import { Card, CardHeader } from "../ui/card";

const pages = [
  { label: "Clients", value: "Clients" },
  { label: "Produits & Services", value: "Produits & Services" },
  { label: "Calendrier", value: "Calendrier" },
  { label: "Rapports", value: "Rapportes" },
  { label: "Paramètres", value: "Paramètres" },
  { label: "Mon Compte", value: "monCompte" },
  { label: "Discussion", value: "Discusion" },
  { label: "Interactions", value: "interaction" },
];

export default function TableauDeBord({ onNavigate }: { onNavigate?: (value: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {pages.map((page) => (
        <Card
          key={page.value}
          className="cursor-pointer hover:shadow-lg transition"
          onClick={() => onNavigate && onNavigate(page.value)}
        >
          <CardHeader className="text-xl font-semibold text-center">
            {page.label}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}