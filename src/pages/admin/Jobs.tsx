import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { Pencil, Trash, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type Job = Tables<"jobs">;

const JobsAdmin = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Job | null>(null);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async (): Promise<Job[]> => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: TablesInsert<"jobs">) => {
      const { error } = await supabase.from("jobs").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Job> }) => {
      const { error } = await supabase.from("jobs").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const startEdit = (job: Job) => {
    setEditing(job);
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location || "");
    setType(job.type || "");
    setSalary(job.salary_range || "");
    setDescription(job.description || "");
    setRequirements(job.requirements || "");
  };

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setCompany("");
    setLocation("");
    setType("");
    setSalary("");
    setDescription("");
    setRequirements("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        payload: { title, company, location, type, salary_range: salary, description, requirements },
      });
    } else {
      await createMutation.mutateAsync({
        title,
        company,
        location,
        type,
        salary_range: salary,
        description,
        requirements,
        is_active: true,
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
          <h2 className="text-2xl font-bold">Jobs Management</h2>
        </div>

        <form onSubmit={submit} className="card-elevated p-6 mb-8">
          <h3 className="font-bold mb-4">{editing ? "Edit Job" : "Create New Job"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <input
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Type (Full-time, Part-time, etc.)"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <input
              className="px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Salary Range"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none mb-4"
            placeholder="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none mb-4"
            placeholder="Requirements"
            rows={3}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
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

        <div className="card-elevated overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-secondary">
              <tr className="text-sm text-muted-foreground">
                <th className="p-4">Title</th>
                <th className="p-4">Company</th>
                <th className="p-4">Location</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              )}
              {jobs?.map((job) => (
                <tr key={job.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="p-4 font-medium">{job.title}</td>
                  <td className="p-4">{job.company}</td>
                  <td className="p-4">{job.location}</td>
                  <td className="p-4">{job.type}</td>
                  <td className="p-4 text-right">
                    <button
                      className="p-2 hover:bg-secondary rounded-lg mr-2"
                      onClick={() => startEdit(job)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                      onClick={() => deleteMutation.mutate(job.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {jobs && jobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No jobs found. Create your first job posting above.
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

export default JobsAdmin;
