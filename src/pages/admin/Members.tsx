import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfiles, updateProfile, deleteProfile } from "@/integrations/api/client";
import type { Profile } from "@/integrations/mysql/types";
import { Pencil, Trash, ArrowLeft, UserCheck, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const MembersAdmin = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [semester, setSemester] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles", "members"],
    queryFn: async (): Promise<Profile[]> => {
      const allProfiles = await getProfiles();
      return allProfiles.filter(p => !p.is_alumni && !p.is_advisor);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<ProfileInsert> }) => {
      await updateProfile(id, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profiles"] });
      toast({ title: "Member updated successfully" });
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
      toast({ title: "Member deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const promoteToAlumni = async (profile: Profile) => {
    await updateMutation.mutateAsync({ id: profile.id, payload: { is_alumni: true } });
    toast({ title: `${profile.full_name} promoted to Alumni` });
  };

  const startEdit = (item: Profile) => {
    setEditing(item);
    setFullName(item.full_name);
    setEmail(item.email || "");
    setPhone(item.phone || "");
    setSemester(item.semester || "");
    setTeamRole(item.team_role || "");
    setBio(item.bio || "");
    setPhotoUrl(item.photo_url || "");
  };

  const resetForm = () => {
    setEditing(null);
    setFullName("");
    setEmail("");
    setPhone("");
    setSemester("");
    setTeamRole("");
    setBio("");
    setPhotoUrl("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        payload: { full_name: fullName, email, phone, semester, team_role: teamRole, bio, photo_url: photoUrl },
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
          <h2 className="text-2xl font-bold">Current Members</h2>
        </div>

        {editing && (
          <form onSubmit={submit} className="card-elevated p-6 mb-8">
            <h3 className="font-bold mb-4">Edit Member</h3>
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
                placeholder="Semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
              <input
                className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                placeholder="Team Role"
                value={teamRole}
                onChange={(e) => setTeamRole(e.target.value)}
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
                <th className="p-4">Member</th>
                <th className="p-4">Semester</th>
                <th className="p-4">Team Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">Loading...</td>
                </tr>
              )}
              {profiles?.map((profile) => (
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
                        <p className="font-medium">{profile.full_name}</p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{profile.semester}</td>
                  <td className="p-4">{profile.team_role}</td>
                  <td className="p-4 text-right">
                    <button
                      className="p-2 hover:bg-secondary rounded-lg mr-1"
                      onClick={() => startEdit(profile)}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="p-2 hover:bg-primary/10 text-primary rounded-lg mr-1"
                      onClick={() => promoteToAlumni(profile)}
                      title="Promote to Alumni"
                    >
                      <UserCheck size={16} />
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
              {profiles && profiles.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    No current members found.
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

export default MembersAdmin;
