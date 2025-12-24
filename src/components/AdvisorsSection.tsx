import { Star, GraduationCap } from "lucide-react";
import ProfileCard from "./ProfileCard";

const advisors = [
  {
    name: "Dr. Rahman Khan",
    role: "Advisor" as const,
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces",
    email: "dr.rahman@bracu.ac.bd",
    phone: "+880 1711-111111",
    linkedin: "https://linkedin.com",
    position: "Faculty Advisor - EEE Department",
    bio: "15+ years in robotics research. Leading BRACU's autonomous systems research lab.",
    currentEducation: {
      institution: "MIT",
      degree: "PhD in Robotics",
      year: "2005-2010",
    },
    pastEducation: [
      { institution: "BUET", degree: "BSc EEE", year: "1998-2003" },
    ],
  },
  {
    name: "Prof. Nameera Amin",
    role: "Advisor" as const,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
    email: "ayesha.siddiqua@bracu.ac.bd",
    linkedin: "https://linkedin.com",
    position: "Technical Advisor - CSE Department",
    bio: "Specializing in autonomous navigation and computer vision for mobile robots.",
    currentEducation: {
      institution: "Stanford University",
      degree: "PhD in Computer Science",
      year: "2008-2013",
    },
    pastEducation: [
      { institution: "DU", degree: "BSc CSE", year: "2002-2006" },
    ],
  },
];

const AdvisorsSection = () => {
  return (
    <section className="section-alt py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-3">
            <Star size={16} />
            Our Mentors
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground">
            Faculty <span className="text-gradient">Advisors</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            The brilliant minds guiding our team to excellence
          </p>
        </div>

        {/* Advisors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {advisors.map((advisor, index) => (
            <div
              key={advisor.email}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <ProfileCard {...advisor} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvisorsSection;