import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Pencil, Trash, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type Merchandise = Tables<"merchandise">;

const MerchandiseAdmin = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Merchandise | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("0");
  const [isDigital, setIsDigital] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const { data: merchandise, isLoading } = useQuery({
    queryKey: ["merchandise"],
    queryFn: async (): Promise<Merchandise[]> => {
      const { data, error } = await supabase
        .from("merchandise")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: TablesInsert<"merchandise">) => {
      const { error } = await supabase.from("merchandise").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["merchandise"] });
      toast({ title: "Product created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Merchandise> }) => {
      const { error } = await supabase.from("merchandise").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["merchandise"] });
      toast({ title: "Product updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("merchandise").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["merchandise"] });
      toast({ title: "Product deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const startEdit = (item: Merchandise) => {
    setEditing(item);
    setName(item.name);
    setDescription(item.description || "");
    setPrice(String(item.price));
    setCategory(item.category || "");
    setImageUrl(item.image_url || "");
    setStock(String(item.stock || 0));
    setIsDigital(item.is_digital || false);
    setIsActive(item.is_active !== false);
  };

  const resetForm = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImageUrl("");
    setStock("0");
    setIsDigital(false);
    setIsActive(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      price: parseFloat(price),
      category,
      image_url: imageUrl,
      stock: parseInt(stock),
      is_digital: isDigital,
      is_active: isActive,
    };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="text-muted-foreground hover:text-primary">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-2xl font-bold">Merchandise Management</h2>
        </div>

        <form onSubmit={submit} className="card-elevated p-6 mb-8">
          <h3 className="font-bold mb-4">{editing ? "Edit Product" : "Add New Product"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <input
              type="number"
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Price (BDT)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <input
              type="number"
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            <input
              className="md:col-span-2 px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none mb-4"
            placeholder="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDigital}
                onChange={(e) => setIsDigital(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">Digital Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">Active (Visible in Shop)</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary px-6 py-2 rounded-lg">
              {editing ? "Update" : "Create"}
            </button>
            {editing && (
              <button type="button" onClick={resetForm} className="btn-outline px-6 py-2 rounded-lg">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {merchandise?.map((item) => (
            <div key={item.id} className="card-elevated overflow-hidden">
              {item.image_url && (
                <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{item.category}</span>
                  {item.is_digital && <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">Digital</span>}
                  {!item.is_active && <span className="text-xs px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground">Inactive</span>}
                </div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-primary font-bold">৳{item.price}</p>
                <p className="text-xs text-muted-foreground">Stock: {item.stock}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => startEdit(item)} className="p-2 hover:bg-secondary rounded-lg">
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {merchandise && merchandise.length === 0 && (
            <p className="text-muted-foreground">No products yet. Add your first product above.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchandiseAdmin;
