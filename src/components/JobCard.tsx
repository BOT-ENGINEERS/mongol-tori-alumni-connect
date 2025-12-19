import { MapPin, Clock, DollarSign, Building, ExternalLink } from "lucide-react";

interface JobProps {
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedBy: string;
  postedDate: string;
  isNew?: boolean;
}

const JobCard = ({
  title,
  company,
  location,
  type,
  salary,
  postedBy,
  postedDate,
  isNew,
}: JobProps) => {
  return (
    <div className="glass-card rounded-xl p-6 hover:scale-[1.01] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Building className="text-primary" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              {isNew && (
                <span className="px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                  NEW
                </span>
              )}
            </div>
            <p className="text-muted-foreground">{company}</p>
          </div>
        </div>
        <button className="btn-primary px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Apply
          <ExternalLink size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} />
          {location}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={14} />
          {type}
        </div>
        {salary && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign size={14} />
            {salary}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Posted by <span className="text-primary font-medium">{postedBy}</span>
        </p>
        <p className="text-xs text-muted-foreground">{postedDate}</p>
      </div>
    </div>
  );
};

export default JobCard;
