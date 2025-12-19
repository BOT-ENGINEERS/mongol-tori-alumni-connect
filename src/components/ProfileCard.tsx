import { Mail, Phone, Linkedin, Facebook, Instagram, GraduationCap, Building } from "lucide-react";

interface Education {
  institution: string;
  degree: string;
  year: string;
}

interface ProfileProps {
  name: string;
  role: "Alumni" | "Member";
  photo: string;
  email: string;
  phone: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  currentEducation?: Education;
  pastEducation?: Education[];
  company?: string;
  position?: string;
  semester?: string;
  teamRole?: string;
}

const ProfileCard = ({
  name,
  role,
  photo,
  email,
  phone,
  linkedin,
  facebook,
  instagram,
  currentEducation,
  pastEducation,
  company,
  position,
  semester,
  teamRole,
}: ProfileProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative">
          <img
            src={photo}
            alt={name}
            className="w-20 h-20 rounded-full object-cover avatar-ring"
          />
          <span
            className={`absolute -bottom-1 -right-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
              role === "Alumni"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {role}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          {role === "Alumni" && company && (
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Building size={14} />
              <span className="text-sm">{position} at {company}</span>
            </div>
          )}
          {role === "Member" && semester && (
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <GraduationCap size={14} />
              <span className="text-sm">{semester} • {teamRole}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-6">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm"
        >
          <Mail size={16} />
          {email}
        </a>
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm"
        >
          <Phone size={16} />
          {phone}
        </a>
      </div>

      {/* Social Links */}
      <div className="flex gap-3 mb-6">
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Linkedin size={18} />
          </a>
        )}
        {facebook && (
          <a
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Facebook size={18} />
          </a>
        )}
        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Instagram size={18} />
          </a>
        )}
      </div>

      {/* Education Timeline */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <GraduationCap size={16} className="text-primary" />
          Education
        </h4>
        <div className="space-y-3">
          {currentEducation && (
            <div className="relative pl-4 border-l-2 border-primary">
              <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary" />
              <p className="text-sm font-medium text-foreground">
                {currentEducation.institution}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentEducation.degree} • {currentEducation.year}
              </p>
            </div>
          )}
          {pastEducation?.map((edu, index) => (
            <div key={index} className="relative pl-4 border-l-2 border-border">
              <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                {edu.institution}
              </p>
              <p className="text-xs text-muted-foreground">
                {edu.degree} • {edu.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
