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
    <div className="card-elevated card-orange-hover p-6 group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building className="text-primary" size={24} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              {isNew && (
                <span className="badge-primary text-[10px]">NEW</span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{company}</p>
          </div>
        </div>
        <button className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          Apply
          <ExternalLink size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          <MapPin size={12} />
          {location}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          <Clock size={12} />
          {type}
        </div>
        {salary && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            <DollarSign size={12} />
            {salary}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Posted by <span className="text-primary font-semibold">{postedBy}</span>
        </p>
        <p className="text-xs text-muted-foreground">{postedDate}</p>
      </div>
    </div>
  );
};

export default JobCard;