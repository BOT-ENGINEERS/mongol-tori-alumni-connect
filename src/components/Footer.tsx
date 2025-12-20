import { Mail, MapPin, Globe } from "lucide-react";
import logo from "@/assets/mongol-tori-logo.png";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Mongol-Tori" className="h-10 w-10 object-contain" />
              <span className="font-black text-xl">MONGOL-TORI</span>
            </div>
            <p className="text-background/70 text-sm">
              BRAC University's Mars Rover Team connecting alumni and current members.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#alumni" className="hover:text-primary transition-colors">Alumni</a></li>
              <li><a href="#jobs" className="hover:text-primary transition-colors">Jobs</a></li>
              <li><a href="#shop" className="hover:text-primary transition-colors">Shop</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-3"><Mail size={16} className="text-primary" />mongoltori@bracu.ac.bd</li>
              <li className="flex items-center gap-3"><MapPin size={16} className="text-primary" />BRAC University, Dhaka</li>
              <li className="flex items-center gap-3"><Globe size={16} className="text-primary" />www.mongoltori.com</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-background/20 text-center">
          <p className="text-background/50 text-sm">© {new Date().getFullYear()} Mongol-Tori Alumni Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;