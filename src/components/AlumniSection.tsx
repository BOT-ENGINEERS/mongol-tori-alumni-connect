import ProfileCard from "./ProfileCard";

const mockProfiles = [
  {
    name: "Rafiul Islam",
    role: "Alumni" as const,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    email: "rafiul.islam@gmail.com",
    phone: "+880 1712-345678",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    company: "SpaceX Bangladesh",
    position: "Senior Engineer",
    currentEducation: {
      institution: "BRAC University",
      degree: "BSc in EEE",
      year: "2018-2022",
    },
    pastEducation: [
      {
        institution: "Notre Dame College",
        degree: "HSC",
        year: "2016-2018",
      },
    ],
  },
  {
    name: "Tasnim Ahmed",
    role: "Alumni" as const,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    email: "tasnim.ahmed@outlook.com",
    phone: "+880 1819-876543",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    company: "Google",
    position: "Software Engineer",
    currentEducation: {
      institution: "BRAC University",
      degree: "BSc in CSE",
      year: "2017-2021",
    },
    pastEducation: [
      {
        institution: "Viqarunnisa Noon College",
        degree: "HSC",
        year: "2015-2017",
      },
    ],
  },
  {
    name: "Mehedi Hasan",
    role: "Member" as const,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    email: "mehedi.hasan@g.bracu.ac.bd",
    phone: "+880 1678-234567",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    semester: "7th Semester",
    teamRole: "Mechanical Lead",
    currentEducation: {
      institution: "BRAC University",
      degree: "BSc in ME",
      year: "2021-Present",
    },
    pastEducation: [
      {
        institution: "Dhaka College",
        degree: "HSC",
        year: "2019-2021",
      },
    ],
  },
  {
    name: "Fatima Khan",
    role: "Member" as const,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces",
    email: "fatima.khan@g.bracu.ac.bd",
    phone: "+880 1556-789012",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    semester: "5th Semester",
    teamRole: "Software Developer",
    currentEducation: {
      institution: "BRAC University",
      degree: "BSc in CSE",
      year: "2022-Present",
    },
    pastEducation: [
      {
        institution: "Holy Cross College",
        degree: "HSC",
        year: "2020-2022",
      },
    ],
  },
];

const AlumniSection = () => {
  return (
    <section id="alumni" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Network
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Meet the <span className="text-gradient">Community</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Connect with alumni and current members of the Mongol-Tori Mars Rover team
          </p>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProfiles.map((profile, index) => (
            <div
              key={profile.email}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProfileCard {...profile} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="glass-card px-8 py-3 rounded-xl font-semibold border border-border hover:border-primary/50 hover:text-primary transition-all">
            View All Members
          </button>
        </div>
      </div>
    </section>
  );
};

export default AlumniSection;
