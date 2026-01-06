import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfiles, updateProfile, deleteProfile } from "@/integrations/api/client";
import type { Profile } from "@/integrations/mysql/types";
import { Pencil, Trash, ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AlumniAdmin = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isAdvisor, setIsAdvisor] = useState(false);

  const { data: alumni, isLoading } = useQuery({
    queryKey: ["profiles", "alumni"],
    queryFn: async (): Promise<(Profile & { user_type?: string })[]> => {
      const allProfiles = await getProfiles();
      return allProfiles.filter(p => p.user_type === 'alumni');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<ProfileInsert> }) => {
      await updateProfile(id, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profiles"] });
      toast({ title: "Alumni updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteProfile(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profiles"] });
      toast({ title: "Alumni deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleAdvisor = async (profile: Profile) => {
    await updateMutation.mutateAsync({ id: profile.id, payload: { is_advisor: !profile.is_advisor } });
    toast({ title: profile.is_advisor ? "Removed from advisors" : "Added as advisor" });
  };

  const startEdit = (item: Profile) => {
    setEditing(item);
    setFullName(item.full_name);
    setEmail(item.email || "");
    setPhone(item.phone || "");
    setCompany(item.company || "");
    setPosition(item.position || "");
    setBio(item.bio || "");
    setPhotoUrl(item.photo_url || "");
    setIsAdvisor(item.is_advisor || false);
  };

  const resetForm = () => {
    setEditing(null);
    setFullName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setPosition("");
    setBio("");
    setPhotoUrl("");
    setIsAdvisor(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        payload: { full_name: fullName, email, phone, company, position, bio, photo_url: photoUrl, is_advisor: isAdvisor },
      });
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="text-muted-foreground hover:text-primary">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-2xl font-bold">Alumni Management</h2>
        </div>

        {editing && (
          <form onSubmit={submit} className="card-elevated p-6 mb-8">
            <h3 className="font-bold mb-4">Edit Alumni</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <input
                className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <input
                className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                placeholder="Photo URL"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none mb-4"
              placeholder="Bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdvisor}
                onChange={(e) => setIsAdvisor(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">Mark as Faculty Advisor</span>
            </label>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary px-6 py-2 rounded-lg">Update</button>
              <button type="button" onClick={resetForm} className="btn-outline px-6 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        )}

        <div className="card-elevated overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-secondary">
              <tr className="text-sm text-muted-foreground">
                <th className="p-4">Alumni</th>
                <th className="p-4">Company</th>
                <th className="p-4">Position</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">Loading...</td>
                </tr>
              )}
              {alumni?.map((profile) => (
                <tr key={profile.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {profile.photo_url ? (
                        <img src={profile.photo_url} alt={profile.full_name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {profile.full_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {profile.full_name}
                          {profile.is_advisor && <Star size={14} className="text-primary fill-primary" />}
                        </p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{profile.company}</td>
                  <td className="p-4">{profile.position}</td>
                  <td className="p-4 text-right">
                    <button
                      className="p-2 hover:bg-secondary rounded-lg mr-1"
                      onClick={() => startEdit(profile)}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className={`p-2 rounded-lg mr-1 ${profile.is_advisor ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                      onClick={() => toggleAdvisor(profile)}
                      title={profile.is_advisor ? "Remove from Advisors" : "Add as Advisor"}
                    >
                      <Star size={16} className={profile.is_advisor ? "fill-current" : ""} />
                    </button>
                    <button
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                      onClick={() => deleteMutation.mutate(profile.id)}
                      title="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {alumni && alumni.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    No alumni found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlumniAdmin;
