import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Pencil, Trash, Plus } from "lucide-react";

type Job = Database["public"]["Tables"]["jobs"]["Row"];

const fetchJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Job[];
};

const JobsAdmin = () => {
  const qc = useQueryClient();
  const { data: jobs, isLoading } = useQuery(["jobs"], fetchJobs);
  const [editing, setEditing] = useState<Job | null>(null);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  const createMutation = useMutation(async (payload: Partial<Job>) => {
    const { error } = await supabase.from("jobs").insert(payload);
    if (error) throw error;
  }, { onSuccess: () => qc.invalidateQueries(["jobs"]) });

  const updateMutation = useMutation(async ({ id, payload }: { id: string; payload: Partial<Job> }) => {
    const { error } = await supabase.from("jobs").update(payload).eq("id", id);
    if (error) throw error;
  }, { onSuccess: () => qc.invalidateQueries(["jobs"]) });

  const deleteMutation = useMutation(async (id: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) throw error;
  }, { onSuccess: () => qc.invalidateQueries(["jobs"]) });

  const startEdit = (job: Job) => {
    setEditing(job);
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location || "");
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload: { title, company, location } });
      setEditing(null);
    } else {
      await createMutation.mutateAsync({ title, company, location, is_active: true, created_at: new Date().toISOString() });
    }
    setTitle("");
    setCompany("");
    setLocation("");
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Jobs — Admin</h2>
          <button className="btn" onClick={() => { setEditing(null); setTitle(""); setCompany(""); setLocation(""); }}>
            <Plus size={16} className="mr-2" /> New
          </button>
        </div>

        <form onSubmit={submit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="input" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
          <input className="input" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <div className="md:col-span-3 flex gap-2">
            <button type="submit" className="btn btn-primary">{editing ? "Update" : "Create"}</button>
            {editing && <button type="button" className="btn" onClick={() => { setEditing(null); setTitle(""); setCompany(""); setLocation(""); }}>Cancel</button>}
          </div>
        </form>

        <div className="card p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-muted-foreground">
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={4}>Loading...</td></tr>}
              {jobs?.map((job) => (
                <tr key={job.id} className="border-t">
                  <td className="py-3">{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.location}</td>
                  <td className="text-right">
                    <button className="btn btn-ghost mr-2" onClick={() => startEdit(job)}><Pencil size={14} /></button>
                    <button className="btn btn-ghost text-red-500" onClick={() => deleteMutation.mutate(job.id)}><Trash size={14} /></button>
                  </td>
                </tr>
              ))}
              {jobs && jobs.length === 0 && <tr><td colSpan={4}>No jobs found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobsAdmin;
