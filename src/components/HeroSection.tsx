import { Users, Briefcase, GraduationCap, Trophy } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { icon: Users, value: "200+", label: "Alumni" },
    { icon: Briefcase, value: "50+", label: "Job Posts" },
    { icon: Trophy, value: "15+", label: "Awards" },
    { icon: GraduationCap, value: "8", label: "Years" },
  ];

  return (
    <section id="home" className="hero-bg pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-semibold text-primary mb-8 animate-fade-in"
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            BRACU Mars Rover Team
          </div>

          {/* Main Heading */}
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-foreground">Connect with</span>
            <br />
            <span className="text-gradient">Mongol-Tori</span>
            <span className="text-foreground"> Alumni</span>
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
            <a href="#alumni">
              <button className="btn-primary px-8 py-4 rounded-xl text-lg w-full sm:w-auto">
                Explore Alumni
              </button>
            </a>
            <a href="#jobs">
              <button className="btn-outline px-8 py-4 rounded-xl text-lg w-full sm:w-auto">
                View Job Board
              </button>
            </a>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="card-elevated p-4 md:p-6 text-center card-orange-hover"
              >
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="text-primary" size={20} />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;