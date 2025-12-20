import { Newspaper, Calendar, ExternalLink, ArrowRight } from "lucide-react";

interface NewsItem {
  title: string;
  excerpt: string;
  source: string;
  date: string;
  image: string;
  isExternal: boolean;
  url?: string;
}

const newsItems: NewsItem[] = [
  {
    title: "Mongol-Tori Wins URC 2023",
    excerpt: "BRACU's Mars Rover team secures historic victory at University Rover Challenge in Utah, making Bangladesh proud on the global stage.",
    source: "The Daily Star",
    date: "June 15, 2023",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=250&fit=crop",
    isExternal: true,
    url: "#",
  },
  {
    title: "Team Expands Research Lab",
    excerpt: "New robotics research facility inaugurated at BRACU campus to support advanced rover development and student innovation.",
    source: "Mongol-Tori",
    date: "August 20, 2023",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=250&fit=crop",
    isExternal: false,
  },
  {
    title: "Partnership with NASA JPL",
    excerpt: "Mongol-Tori announces collaboration with NASA's Jet Propulsion Laboratory for autonomous navigation research.",
    source: "Prothom Alo",
    date: "October 5, 2023",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
    isExternal: true,
    url: "#",
  },
  {
    title: "Alumni Reunion 2023",
    excerpt: "Over 100 alumni gathered for the annual reunion, sharing experiences and mentoring current team members.",
    source: "Mongol-Tori",
    date: "December 1, 2023",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=250&fit=crop",
    isExternal: false,
  },
];

const NewsSection = () => {
  return (
    <section id="news" className="section-alt py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-3">
            <Newspaper size={16} />
            Latest Updates
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground">
            News & <span className="text-gradient">Media</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Stay updated with our latest achievements and media coverage
          </p>
        </div>

        {/* Featured Article */}
        <div className="mb-10">
          <div className="card-elevated card-orange-hover overflow-hidden group">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img
                  src={newsItems[0].image}
                  alt={newsItems[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge-primary">{newsItems[0].isExternal ? "Media" : "Update"}</span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar size={12} />
                    {newsItems[0].date}
                  </span>
                </div>
                <h3 className="font-bold text-2xl md:text-3xl text-foreground mb-3 group-hover:text-primary transition-colors">
                  {newsItems[0].title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {newsItems[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Source: <span className="font-semibold text-foreground">{newsItems[0].source}</span>
                  </span>
                  <button className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    Read More
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.slice(1).map((news, index) => (
            <div
              key={news.title}
              className="card-elevated card-orange-hover overflow-hidden group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={news.isExternal ? "badge-primary" : "badge-black"}>
                    {news.isExternal ? "Media" : "Update"}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <Calendar size={10} />
                  {news.date}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {news.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {news.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{news.source}</span>
                  <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
                    Read
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;