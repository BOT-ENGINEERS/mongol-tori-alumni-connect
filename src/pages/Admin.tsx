import { Link } from "react-router-dom";
import { Shield, Users, Briefcase, Trophy, Newspaper, ShoppingBag, ArrowLeft } from "lucide-react";

const Admin = () => {
  const sections = [
    { name: "Members", icon: Users, description: "Add/remove current members", path: "/admin/members" },
    { name: "Alumni", icon: Users, description: "Manage alumni profiles", path: "/admin/alumni" },
    { name: "Jobs", icon: Briefcase, description: "Manage job postings", path: "/admin/jobs" },
    { name: "Achievements", icon: Trophy, description: "Update achievements", path: "/admin/achievements" },
    { name: "News", icon: Newspaper, description: "Publish news articles", path: "/admin/news" },
    { name: "Merchandise", icon: ShoppingBag, description: "Manage products & orders", path: "/admin/merchandise" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="text-muted-foreground hover:text-primary"><ArrowLeft size={24} /></Link>
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={28} />
            <h1 className="text-2xl font-black">Admin Panel</h1>
          </div>
        </div>
        <p className="text-muted-foreground mb-8">Sign in as admin to manage content. Full CRUD functionality coming soon.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <Link key={section.name} to={section.path} className="card-elevated card-orange-hover p-6">
              <section.icon className="text-primary mb-3" size={28} />
              <h3 className="font-bold text-lg">{section.name}</h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;