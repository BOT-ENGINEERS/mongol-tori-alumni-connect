import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Users, Briefcase, Home, Trophy, Newspaper, ShoppingBag, Shield } from "lucide-react";
import logo from "@/assets/mongol-tori-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Alumni", href: "#alumni", icon: Users },
    { name: "Jobs", href: "#jobs", icon: Briefcase },
    { name: "Achievements", href: "#achievements", icon: Trophy },
    { name: "News", href: "#news", icon: Newspaper },
    { name: "Shop", href: "#shop", icon: ShoppingBag },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Mongol-Tori" className="h-10 w-10 object-contain" />
            <span className="font-black text-xl tracking-tight">
              <span className="text-foreground">MONGOL</span>
              <span className="text-primary">-TORI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav-link flex items-center gap-1.5 text-sm"
              >
                <link.icon size={16} />
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              to="/admin" 
              className="flex items-center gap-1.5 text-sm nav-link"
            >
              <Shield size={16} />
              Admin
            </Link>
            <Link to="/auth">
              <button className="btn-primary px-5 py-2 rounded-lg text-sm">
                Join Network
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 py-3 nav-link"
                onClick={() => setIsOpen(false)}
              >
                <link.icon size={18} />
                {link.name}
              </a>
            ))}
            <div className="flex gap-3 mt-4 pt-4 border-t border-border">
              <Link to="/admin" className="flex-1" onClick={() => setIsOpen(false)}>
                <button className="btn-outline w-full py-3 rounded-lg text-sm">
                  Admin
                </button>
              </Link>
              <Link to="/auth" className="flex-1" onClick={() => setIsOpen(false)}>
                <button className="btn-primary w-full py-3 rounded-lg text-sm">
                  Join
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;