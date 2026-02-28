import React from 'react';

interface RoadmapTimelineProps {
  steps: string[];
  title?: string;
}

export default function RoadmapTimeline({ steps, title }: RoadmapTimelineProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No roadmap steps available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {title && (
        <h4 className="font-semibold text-foreground mb-4">{title}</h4>
      )}
      <div className="relative">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4 group">
            {/* Timeline connector */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm transition-all ${
                  index === 0
                    ? 'gradient-purple text-white shadow-purple'
                    : 'bg-primary/10 text-primary border-2 border-primary/20'
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 h-8 bg-gradient-to-b from-primary/40 to-primary/10 my-1" />
              )}
            </div>

            {/* Step content */}
            <div className={`pb-6 flex-1 ${index === steps.length - 1 ? 'pb-0' : ''}`}>
              <div
                className={`p-3.5 rounded-xl border transition-all group-hover:shadow-sm ${
                  index === 0
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-white border-border hover:border-primary/30'
                }`}
              >
                <p className="text-sm font-medium text-foreground">{step}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
