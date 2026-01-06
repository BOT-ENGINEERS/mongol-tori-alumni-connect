import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from "@/integrations/api/client";
import type { Achievement } from "@/integrations/mysql/types";
import { Pencil, Trash, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AchievementsAdmin = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: async (): Promise<Achievement[]> => {
      return await getAchievements();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: AchievementInsert) => {
      await createAchievement(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["achievements"] });
      toast({ title: "Achievement created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<AchievementInsert> }) => {
      await updateAchievement(id, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["achievements"] });
      toast({ title: "Achievement updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteAchievement(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["achievements"] });
      toast({ title: "Achievement deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const startEdit = (item: Achievement) => {
    setEditing(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setDate(item.date || "");
    setImageUrl(item.image_url || "");
  };

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setDescription("");
    setDate("");
    setImageUrl("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        payload: { title, description, date: date || null, image_url: imageUrl || null },
      });
    } else {
      await createMutation.mutateAsync({
        title,
        description,
        date: date || null,
        image_url: imageUrl || null,
      });
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
          <h2 className="text-2xl font-bold">Achievements Management</h2>
        </div>

        <form onSubmit={submit} className="card-elevated p-6 mb-8">
          <h3 className="font-bold mb-4">{editing ? "Edit Achievement" : "Add New Achievement"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="date"
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {achievements?.map((item) => (
            <div key={item.id} className="card-elevated p-4">
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />
              )}
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
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
          ))}
          {achievements && achievements.length === 0 && (
            <p className="text-muted-foreground">No achievements yet. Add your first one above.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsAdmin;
