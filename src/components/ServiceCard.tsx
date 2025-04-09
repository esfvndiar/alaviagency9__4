
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  icon: Icon,
  delay = 0
}) => {
  return (
    <div 
      className="card-hover p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 relative group"
      style={{ 
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyberblue/10 to-mintgreen/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
      
      <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-cyberblue to-mintgreen text-white">
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-gradient transition-all duration-300">
        {title}
      </h3>
      
      <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
        {description}
      </p>
      
      <div className="h-1.5 w-0 bg-gradient-to-r from-cyberblue to-mintgreen mt-5 group-hover:w-full transition-all duration-500 rounded-full" />
    </div>
  );
};

export default ServiceCard;
