import { Trophy, Calendar, ExternalLink } from "lucide-react";

interface Achievement {
  title: string;
  description: string;
  date: string;
  image: string;
}

const achievements: Achievement[] = [
  {
    title: "1st Place - URC 2023",
    description: "Won first place in the University Rover Challenge held in Utah, USA, competing against 100+ teams worldwide.",
    date: "June 2023",
    image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&h=250&fit=crop",
  },
  {
    title: "Best Design Award - IRC 2022",
    description: "Received the prestigious Best Rover Design Award at the Indian Rover Challenge for innovative suspension system.",
    date: "January 2022",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
  },
  {
    title: "NASA Recognition",
    description: "Acknowledged by NASA for outstanding contribution to Mars exploration research and autonomous navigation.",
    date: "March 2023",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=250&fit=crop",
  },
];

const AchievementsSection = () => {
  return (
    <section id="achievements" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-3">
            <Trophy size={16} />
            Our Achievements
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground">
            Milestones & <span className="text-gradient">Awards</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Celebrating our team's journey of excellence and innovation
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.title}
              className="card-elevated card-orange-hover overflow-hidden group animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="badge-primary inline-flex items-center gap-1.5">
                    <Calendar size={12} />
                    {achievement.date}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {achievement.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="btn-outline px-8 py-3 rounded-xl inline-flex items-center gap-2">
            View All Achievements
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;