import { Users, Briefcase, GraduationCap } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { icon: Users, value: "200+", label: "Alumni" },
    { icon: Briefcase, value: "50+", label: "Job Posts" },
    { icon: GraduationCap, value: "8", label: "Years" },
  ];

  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-primary mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            BRACU Mars Rover Team
          </div>

          {/* Main Heading */}
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-foreground">Connect with </span>
            <span className="text-gradient">Mongol-Tori</span>
            <br />
            <span className="text-foreground">Alumni Network</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            A powerful platform connecting past and present members of BRACU's 
            pioneering Mars Rover team. Find opportunities, share experiences, 
            and build the future together.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <button className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg w-full sm:w-auto">
              Explore Alumni
            </button>
            <button className="glass-card px-8 py-4 rounded-xl font-semibold text-lg border border-border hover:border-primary/50 transition-all w-full sm:w-auto">
              View Job Board
            </button>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="text-primary" size={24} />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
