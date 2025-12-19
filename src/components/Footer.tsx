import { Mail, MapPin, Globe } from "lucide-react";
import logo from "@/assets/mongol-tori-logo.png";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Mongol-Tori" className="h-10 w-10 object-contain" />
              <span className="font-bold text-xl text-gradient">Mongol-Tori</span>
            </div>
            <p className="text-muted-foreground text-sm">
              BRAC University's Mars Rover Team connecting alumni and current members 
              to build the future of space exploration together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#alumni" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Alumni Directory
                </a>
              </li>
              <li>
                <a href="#jobs" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Job Board
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail size={16} className="text-primary" />
                mongoltori@bracu.ac.bd
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin size={16} className="text-primary" />
                BRAC University, Dhaka
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Globe size={16} className="text-primary" />
                www.mongoltori.com
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Mongol-Tori Alumni Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
