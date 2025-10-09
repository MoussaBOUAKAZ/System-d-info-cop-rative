"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Package,
  Plus,
  Search,
  TrendingUp,
  DollarSign,
  Layers,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  type: "PRODUCT" | "SERVICE"; // <-- majuscules comme dans Prisma
  category: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  stock?: number;
  description: string;
  clientsCount?: number; // nombre de contacts liés (via relation)
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "PRODUCT" | "SERVICE">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Ajoute les états pour le formulaire
  const [form, setForm] = useState({
    name: "",
    type: "" as "PRODUCT" | "SERVICE" | "",
    category: "",
    price: "",
    stock: "",
    description: "",
    status: true,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    type: "" as "PRODUCT" | "SERVICE" | "",
    category: "",
    price: "",
    stock: "",
    description: "",
    status: true,
  });

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || product.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    totalProducts: products.filter((p) => p.type === "PRODUCT").length,
    totalServices: products.filter((p) => p.type === "SERVICE").length,
    activeItems: products.filter((p) => p.status === "ACTIVE").length,
    totalRevenue: products.reduce((sum, p) => sum + p.price * (p.clientsCount || 0), 0),
  };

  const openEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditForm({
      name: product.name,
      type: product.type,
      category: product.category,
      price: String(product.price ?? ""),
      stock: product.stock != null ? String(product.stock) : "",
      description: product.description ?? "",
      status: product.status === "ACTIVE",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProductId) return;
    const payload = {
      name: editForm.name,
      type: editForm.type as "PRODUCT" | "SERVICE",
      category: editForm.category,
      price: Number(editForm.price),
      status: editForm.status ? "ACTIVE" : "INACTIVE",
      stock: editForm.type === "PRODUCT" ? (editForm.stock !== "" ? Number(editForm.stock) : null) : null,
      description: editForm.description,
    };
    const res = await fetch(`/api/products/${editingProductId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
    setIsEditDialogOpen(false);
    setEditingProductId(null);
  };

  const handleAddProduct = async () => {
    const payload = {
      name: form.name,
      type: form.type as "PRODUCT" | "SERVICE",
      category: form.category,
      price: Number(form.price),
      status: form.status ? "ACTIVE" : "INACTIVE",
      stock: form.type === "PRODUCT" ? Number(form.stock) : undefined,
      description: form.description,
    };
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setProducts((prev) => [...prev, data]);
    setIsAddDialogOpen(false);
    setForm({
      name: "",
      type: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      status: true,
    });
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Produits & Services
          </h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits et services
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un produit ou service</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau produit ou
                service
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Consultation Premium" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as "PRODUCT" | "SERVICE" }))}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRODUCT">Produit</SelectItem>
                      <SelectItem value="SERVICE">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conseil">Conseil</SelectItem>
                      <SelectItem value="logiciel">Logiciel</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€)</Label>
                  <Input id="price" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
                </div>
              </div>
              {form.type === "PRODUCT" && (
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock (pour produits uniquement)</Label>
                  <Input id="stock" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Décrivez le produit ou service..." rows={3} />
              </div>
              {/* clients supprimé: relation Contact[] désormais */}
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label>Statut</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer ce produit/service
                  </p>
                </div>
                <Switch checked={form.status} onCheckedChange={v => setForm(f => ({ ...f, status: v }))} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddProduct}>
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Articles physiques/numériques
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Prestations de service
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeItems}</div>
            <p className="text-xs text-muted-foreground">
              Disponibles à la vente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString()}€
            </div>
            <p className="text-xs text-muted-foreground">
              Tous les produits/services
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le produit/service</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations du produit/service
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom</Label>
                <Input id="edit-name" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select value={editForm.type} onValueChange={v => setEditForm(f => ({ ...f, type: v as "PRODUCT" | "SERVICE" }))}>
                  <SelectTrigger id="edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRODUCT">Produit</SelectItem>
                    <SelectItem value="SERVICE">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Catégorie</Label>
                <Input id="edit-category" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Prix (€)</Label>
                <Input id="edit-price" type="number" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} />
              </div>
            </div>
            {editForm.type === "PRODUCT" && (
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input id="edit-stock" type="number" value={editForm.stock} onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label>Statut</Label>
                <p className="text-sm text-muted-foreground">Activer ce produit/service</p>
              </div>
              <Switch checked={editForm.status} onCheckedChange={v => setEditForm(f => ({ ...f, status: v }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdateProduct}>Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Catalogue</CardTitle>
              <CardDescription>
                Liste complète de vos produits et services
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-9 w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs
                value={filterType}
                onValueChange={(v) => setFilterType(v as any)}
              >
                <TabsList>
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="PRODUCT">Produits</TabsTrigger>
                  <TabsTrigger value="SERVICE">Services</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">
                        {product.name}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {product.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.type === "PRODUCT" ? "default" : "secondary"
                      }
                    >
                      {product.type === "PRODUCT" ? "Produit" : "Service"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.category}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.price}€
                  </TableCell>
                  <TableCell>
                    {product.type === "PRODUCT" ? (
                      <span className="text-muted-foreground">
                        {product.stock} unités
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.clientsCount ?? 0}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "ACTIVE" ? "default" : "outline"
                      }
                    >
                      {product.status === "ACTIVE" ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
                          setProducts((prev) => prev.filter((p) => p.id !== product.id))
                        }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
