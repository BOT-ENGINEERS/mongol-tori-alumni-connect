import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNews, createNews, updateNews, deleteNews } from "@/integrations/api/client";
import type { News } from "@/integrations/mysql/types";
import { Pencil, Trash, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NewsAdmin = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<News | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isExternal, setIsExternal] = useState(false);

  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async (): Promise<News[]> => {
      return await getNews();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: NewsInsert) => {
      await createNews(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
      toast({ title: "News created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<NewsInsert> }) => {
      await updateNews(id, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
      toast({ title: "News updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteNews(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
      toast({ title: "News deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const startEdit = (item: News) => {
    setEditing(item);
    setTitle(item.title);
    setContent(item.content || "");
    setSource(item.source || "");
    setSourceUrl(item.source_url || "");
    setImageUrl(item.image_url || "");
    setIsExternal(item.is_external || false);
  };

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setContent("");
    setSource("");
    setSourceUrl("");
    setImageUrl("");
    setIsExternal(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        payload: { title, content, source, source_url: sourceUrl, image_url: imageUrl, is_external: isExternal },
      });
    } else {
      await createMutation.mutateAsync({
        title,
        content,
        source,
        source_url: sourceUrl,
        image_url: imageUrl,
        is_external: isExternal,
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
          <h2 className="text-2xl font-bold">News Management</h2>
        </div>

        <form onSubmit={submit} className="card-elevated p-6 mb-8">
          <h3 className="font-bold mb-4">{editing ? "Edit News" : "Publish New Article"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              className="md:col-span-2 px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Source (e.g., The Daily Star)"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
            <input
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Source URL"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
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
            placeholder="Content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={isExternal}
              onChange={(e) => setIsExternal(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">External Media Coverage</span>
          </label>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary px-6 py-2 rounded-lg">
              {editing ? "Update" : "Publish"}
            </button>
            {editing && (
              <button type="button" onClick={resetForm} className="btn-outline px-6 py-2 rounded-lg">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-4">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {news?.map((item) => (
            <div key={item.id} className="card-elevated p-4 flex gap-4">
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_external ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                    {item.is_external ? "Media" : "Update"}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.source}</span>
                </div>
                <h3 className="font-bold truncate">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{item.content}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
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
          {news && news.length === 0 && (
            <p className="text-muted-foreground">No news yet. Publish your first article above.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsAdmin;
