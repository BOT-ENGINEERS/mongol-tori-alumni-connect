import { Briefcase, Plus } from "lucide-react";
import JobCard from "./JobCard";

const mockJobs = [
  {
    title: "Robotics Engineer",
    company: "TechCorp Bangladesh",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    salary: "80k-120k BDT",
    postedBy: "Rafiul Islam",
    postedDate: "2 days ago",
    isNew: true,
  },
  {
    title: "Software Developer",
    company: "Startup Hub BD",
    location: "Remote",
    type: "Full-time",
    salary: "60k-90k BDT",
    postedBy: "Tasnim Ahmed",
    postedDate: "5 days ago",
    isNew: true,
  },
  {
    title: "Mechanical Design Intern",
    company: "AutoParts Ltd",
    location: "Chittagong, Bangladesh",
    type: "Internship",
    salary: "15k BDT",
    postedBy: "Karim Rahman",
    postedDate: "1 week ago",
  },
  {
    title: "Embedded Systems Engineer",
    company: "IoT Solutions BD",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    salary: "70k-100k BDT",
    postedBy: "Nadia Sultana",
    postedDate: "1 week ago",
  },
];

const JobsSection = () => {
  return (
    <section id="jobs" className="py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <Briefcase size={16} />
              Career Opportunities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Alumni <span className="text-gradient">Job Board</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Exclusive opportunities posted by our alumni network for current members
            </p>
          </div>
          <button className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mt-6 md:mt-0">
            <Plus size={18} />
            Post a Job
          </button>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockJobs.map((job, index) => (
            <div
              key={`${job.title}-${job.company}`}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <JobCard {...job} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="glass-card px-8 py-3 rounded-xl font-semibold border border-border hover:border-primary/50 hover:text-primary transition-all">
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobsSection;
