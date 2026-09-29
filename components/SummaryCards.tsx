import { Crosshair, Gauge, Goal, Target, Zap } from "lucide-react";
import { SummaryMetrics } from "@/lib/analytics";

interface SummaryCardsProps {
  metrics: SummaryMetrics;
}

export default function SummaryCards({ metrics }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Goals",
      value: metrics.totalGoals,
      icon: Goal,
      accent: true,
    },
    {
      label: "Total Shots",
      value: metrics.totalShots,
      icon: Target,
    },
    {
      label: "Avg Shot Speed",
      value: `${metrics.avgSpeed}`,
      suffix: "km/h",
      icon: Gauge,
    },
    {
      label: "Max Shot Speed",
      value: `${metrics.maxSpeed}`,
      suffix: "km/h",
      icon: Zap,
    },
    {
      label: "Goal Conversion",
      value: `${metrics.conversionRate}`,
      suffix: "%",
      icon: Crosshair,
      accent: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="card card-hover animate-in flex flex-col gap-3 p-4 sm:p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                {card.label}
              </span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  card.accent ? "bg-accent-soft text-accent" : "bg-surface-light text-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-white sm:text-3xl">
                {card.value}
              </span>
              {card.suffix && (
                <span className="text-sm font-medium text-muted">{card.suffix}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
