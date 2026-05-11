import React from "react";
import { CheckCircle, Clock, Flame, Target } from "lucide-react";

const ProductivityStats = ({ stats, weeklyStats }) => {
  const statCards = [
    {
      label: "Filled Slots",
      value: stats?.filledSlots || 0,
      icon: CheckCircle,
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      label: "Productivity",
      value: `${stats?.productivity || 0}%`,
      icon: Target,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      label: "Total Slots",
      value: stats?.totalSlots || 48,
      icon: Clock,
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      label: "Week Productivity",
      value: `${weeklyStats?.weekProductivity || 0}%`,
      icon: Flame,
      color:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`rounded-lg p-4 ${card.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium opacity-75">{card.label}</p>
                <p className="mt-2 text-2xl font-bold">{card.value}</p>
              </div>
              <Icon className="h-8 w-8 opacity-50" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductivityStats;
