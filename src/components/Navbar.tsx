import { useState } from "react";
import { Menu, X, Users, Briefcase, Home } from "lucide-react";
import logo from "@/assets/mongol-tori-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home", icon: Home },
    { name: "Alumni", href: "#alumni", icon: Users },
    { name: "Jobs", href: "#jobs", icon: Briefcase },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Mongol-Tori" className="h-10 w-10 object-contain" />
            <span className="font-bold text-xl text-gradient">Mongol-Tori</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                <link.icon size={18} />
                {link.name}
              </a>
            ))}
            <button className="btn-primary px-5 py-2 rounded-lg font-semibold">
              Join Network
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 py-3 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <link.icon size={18} />
                {link.name}
              </a>
            ))}
            <button className="btn-primary w-full mt-4 py-3 rounded-lg font-semibold">
              Join Network
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
