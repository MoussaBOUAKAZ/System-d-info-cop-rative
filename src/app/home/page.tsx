"use client";

import { DashboardHeader } from "../../../components/dashboard-header";
import { DashboardSidebar } from "../../../components/dashboard-sidebar";
import { useState } from "react";
import {
  Compte,
  Paramtres,
  
  Pipeline,
  ClientCRMPanel,
} from "../../../components/monCompte";
import DiscussionPage from "../../../components/disscussion/page";
import ProductsPage from "../../../components/produit/page";
import ContactsModule from "../../../components/ContactsModule/page";
import Contacts from "../../../components/Contacts/page";
import InteractionsPage from "../../../components/interactions/page";
import Rapports from "../../../components/analyse/page";
import TableauDeBord from "../../../components/Dashbord/page";
import Calendrier from "../../../components/Calanderie/page";
export default function Home() {
  const [page, setPage] = useState("Tableau de bord");

  const handleButtonClick = (value: string) => {
    setPage(value);
  };
  const handleCompChange =(value:string) =>{
    setPage(value)
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar onButtonClick={handleButtonClick} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onButtonClick={handleButtonClick} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {page === "parametres" && <Paramtres />}
          {page === "Clients" && <Contacts />}
          {page === "Produits & Services" && <ProductsPage />}
          {page === "Calendrier" && <Calendrier />}
          {page === "Rapportes" && <Rapports />}
          {page === "Tableau de bord" && <TableauDeBord onNavigate={handleCompChange} />}
          {page === "Paramètres" && <Paramtres />}
          {page === "monCompte" && (
            <Compte
              onBack={() => {
                return;
              }}
            />
          )}
          {/* {page === "Discusion" && <Discussion />} */}
          {page === "Discussion" && <DiscussionPage />}
          {page === "interaction" && <InteractionsPage />}
        </main>
      </div>
    </div>
  );
}
