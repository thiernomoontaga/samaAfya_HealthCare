import React from "react";
import { Heart } from "lucide-react";

interface DashboardHeroProps {
  title: string;
  subtitle: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
  patientName?: string;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  title,
  subtitle,
  stats,
  patientName,
}) => {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h2 className="text-4xl font-bold text-foreground">
            {title} {patientName && patientName}
          </h2>
          <p className="text-muted-foreground text-xl">
            {subtitle}
          </p>
          <div className="flex items-center gap-6 mt-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-foreground font-medium">{stat.label}: {stat.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-16 w-16 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};
