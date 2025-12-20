import { Mail, Phone, Linkedin, Facebook, Instagram, GraduationCap, Building, Star } from "lucide-react";

interface Education {
  institution: string;
  degree: string;
  year: string;
}

interface ProfileProps {
  name: string;
  role: "Alumni" | "Member" | "Advisor";
  photo: string;
  email: string;
  phone?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  currentEducation?: Education;
  pastEducation?: Education[];
  company?: string;
  position?: string;
  semester?: string;
  teamRole?: string;
  bio?: string;
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
  bio,
}: ProfileProps) => {
  const getRoleBadge = () => {
    switch (role) {
      case "Alumni":
        return "badge-primary";
      case "Advisor":
        return "bg-foreground text-background";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="card-elevated card-orange-hover p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="relative">
          <img
            src={photo}
            alt={name}
            className="w-16 h-16 rounded-full object-cover avatar-ring"
          />
          <span
            className={`absolute -bottom-1 -right-1 px-2 py-0.5 text-xs font-bold rounded-full ${getRoleBadge()}`}
          >
            {role === "Advisor" && <Star size={10} className="inline mr-0.5" />}
            {role}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground truncate">{name}</h3>
          {role === "Alumni" && company && (
            <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
              <Building size={12} />
              <span className="text-sm truncate">{position} at {company}</span>
            </div>
          )}
          {role === "Member" && semester && (
            <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
              <GraduationCap size={12} />
              <span className="text-sm truncate">{semester} • {teamRole}</span>
            </div>
          )}
          {role === "Advisor" && position && (
            <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
              <Star size={12} />
              <span className="text-sm truncate">{position}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bio}</p>
      )}

      {/* Contact Info */}
      <div className="space-y-2 mb-5">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors text-sm"
        >
          <Mail size={14} />
          <span className="truncate">{email}</span>
        </a>
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            <Phone size={14} />
            {phone}
          </a>
        )}
      </div>

      {/* Social Links */}
      <div className="flex gap-2 mb-5">
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Linkedin size={16} />
          </a>
        )}
        {facebook && (
          <a
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Facebook size={16} />
          </a>
        )}
        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Instagram size={16} />
          </a>
        )}
      </div>

      {/* Education Timeline */}
      <div className="border-t border-border pt-4">
        <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5 uppercase tracking-wide">
          <GraduationCap size={14} className="text-primary" />
          Education
        </h4>
        <div className="space-y-2.5">
          {currentEducation && (
            <div className="relative pl-3 border-l-2 border-primary">
              <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary" />
              <p className="text-sm font-semibold text-foreground">
                {currentEducation.institution}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentEducation.degree} • {currentEducation.year}
              </p>
            </div>
          )}
          {pastEducation?.slice(0, 1).map((edu, index) => (
            <div key={index} className="relative pl-3 border-l-2 border-border">
              <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">
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