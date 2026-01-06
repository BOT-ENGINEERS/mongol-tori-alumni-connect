import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJobs, createJob, deleteJob } from "@/integrations/api/client";
import { getCurrentUser } from "@/integrations/api/client";
import { Briefcase, ArrowLeft, Trash, Plus, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobPosting {
  id?: string;
  title: string;
  company: string;
  workingHours: string;
  salary: string;
  qualifications: string;
}

const Jobs = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const isAlumni = currentUser?.userType === "alumni";

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<JobPosting>({
    title: "",
    company: "",
    workingHours: "",
    salary: "",
    qualifications: "",
  });

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      return await getJobs();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      await createJob(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job posted successfully!" });
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteJob(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      workingHours: "",
      salary: "",
      qualifications: "",
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to post a job",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!isAlumni) {
      toast({
        title: "Alumni Only",
        description: "Only alumni members can post job opportunities",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        company: formData.company,
        type: formData.workingHours,
        salary_range: formData.salary,
        requirements: formData.qualifications,
        description: `${formData.company} is hiring for ${formData.title} position. Required qualifications: ${formData.qualifications}`,
        location: "",
        is_active: true,
      });
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="text-muted-foreground hover:text-primary">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Briefcase className="text-primary" />
              Job Opportunities
            </h1>
            <p className="text-muted-foreground mt-2">
              {isAlumni ? "Post a job opportunity for the network" : "Explore job opportunities posted by alumni"}
            </p>
          </div>
        </div>

        {/* Post Job Button (Alumni Only) */}
        {isAlumni && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 mb-8"
          >
            <Plus size={20} />
            Post a Job
          </button>
        )}

        {/* Job Posting Form (Alumni Only) */}
        {showForm && isAlumni && (
          <div className="bg-card rounded-lg border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Position Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineer"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g., Tech Company Ltd"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Working Hours</label>
                  <input
                    type="text"
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleInputChange}
                    placeholder="e.g., Full-time, Part-time, Contract"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., 50,000 - 80,000 BDT/month"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Required Qualifications</label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  placeholder="List the required qualifications and skills..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="btn-primary px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {createMutation.isPending ? "Posting..." : "Post Job"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-outline px-6 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Not Alumni Warning */}
        {!isAlumni && !currentUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex items-center gap-4">
            <Lock size={24} className="text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Want to Post a Job?</h3>
              <p className="text-blue-800">
                <Link to="/auth" className="underline font-semibold hover:text-blue-900">
                  Sign in as an alumni
                </Link>
                {" "}to post job opportunities for the network.
              </p>
            </div>
          </div>
        )}

        {!isAlumni && currentUser && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 flex items-center gap-4">
            <Lock size={24} className="text-amber-600" />
            <div>
              <h3 className="font-semibold text-amber-900">Alumni Only Feature</h3>
              <p className="text-amber-800">
                Only alumni members can post job opportunities. Browse available opportunities below.
              </p>
            </div>
          </div>
        )}

        {/* Jobs List */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold">
              Available Opportunities ({jobs?.length || 0})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground">Loading jobs...</div>
          ) : jobs && jobs.length > 0 ? (
            <div className="divide-y divide-border">
              {jobs.map((job: any) => (
                <div key={job.id} className="p-6 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                      <p className="text-lg text-primary font-semibold">{job.company}</p>
                    </div>
                    {isAlumni && (
                      <button
                        onClick={() => deleteMutation.mutate(job.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                      >
                        <Trash size={20} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Working Hours</p>
                      <p className="font-semibold">{job.type || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salary Range</p>
                      <p className="font-semibold">{job.salary_range || "Negotiable"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Posted</p>
                      <p className="font-semibold">
                        {job.created_at
                          ? new Date(job.created_at).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>

                  {job.requirements && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">Required Qualifications</p>
                      <p className="text-sm whitespace-pre-wrap">{job.requirements}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No job opportunities available yet.</p>
              {isAlumni && (
                <p className="text-sm mt-2">Be the first to post a job opportunity!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
