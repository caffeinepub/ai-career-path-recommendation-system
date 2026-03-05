import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import type { Sector } from "../backend";
import { useGetAvailableSectors } from "../hooks/useQueries";

// Extended sectors with icons and colors (supplement backend data)
const SECTOR_META: Record<string, { icon: string; color: string }> = {
  Technology: { icon: "💻", color: "from-blue-500 to-purple-600" },
  Healthcare: { icon: "🏥", color: "from-green-500 to-teal-600" },
  Commercial: { icon: "📈", color: "from-orange-500 to-amber-600" },
  Commerce: { icon: "📈", color: "from-orange-500 to-amber-600" },
  Arts: { icon: "🎨", color: "from-pink-500 to-rose-600" },
  Business: { icon: "💼", color: "from-indigo-500 to-blue-600" },
  Engineering: { icon: "⚙️", color: "from-gray-500 to-slate-600" },
  Finance: { icon: "💰", color: "from-yellow-500 to-orange-600" },
  Education: { icon: "📚", color: "from-cyan-500 to-blue-600" },
  Marketing: { icon: "📣", color: "from-purple-500 to-pink-600" },
  Law: { icon: "⚖️", color: "from-slate-500 to-gray-600" },
  Science: { icon: "🔬", color: "from-teal-500 to-green-600" },
};

// Fallback sectors if backend returns limited data
const FALLBACK_SECTORS: Sector[] = [
  {
    id: BigInt(1),
    name: "Technology",
    description: "Software, AI, cybersecurity, and digital innovation",
  },
  {
    id: BigInt(2),
    name: "Healthcare",
    description: "Medicine, nursing, public health, and wellness",
  },
  {
    id: BigInt(3),
    name: "Commerce",
    description: "Trade, retail, e-commerce, and supply chain",
  },
  {
    id: BigInt(4),
    name: "Arts",
    description: "Design, media, entertainment, and creative fields",
  },
  {
    id: BigInt(5),
    name: "Business",
    description: "Management, entrepreneurship, and strategy",
  },
  {
    id: BigInt(6),
    name: "Engineering",
    description: "Civil, mechanical, electrical, and chemical engineering",
  },
  {
    id: BigInt(7),
    name: "Finance",
    description: "Banking, investment, accounting, and economics",
  },
  {
    id: BigInt(8),
    name: "Education",
    description: "Teaching, training, curriculum design, and research",
  },
  {
    id: BigInt(9),
    name: "Marketing",
    description: "Branding, digital marketing, PR, and advertising",
  },
  {
    id: BigInt(10),
    name: "Science",
    description: "Research, biology, chemistry, and environmental science",
  },
];

export default function SectorSelectionPage() {
  const { data: backendSectors, isLoading } = useGetAvailableSectors();
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

  // Merge backend sectors with fallback
  const sectors =
    backendSectors && backendSectors.length > 0
      ? backendSectors
      : FALLBACK_SECTORS;

  const handleContinue = () => {
    if (selectedSector !== null) {
      const params = new URLSearchParams({
        sectorId: selectedSector.id.toString(),
        sectorName: selectedSector.name,
        sectorDescription: selectedSector.description,
      });
      window.location.href = `/quiz/questions?${params.toString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            Step 1 of 2 — Choose Your Sector
          </div>
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-foreground mb-3">
            Which sector interests you?
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Select the broad field that excites you most. This helps us tailor
            your quiz questions and career recommendations.
          </p>
        </div>

        {/* Sector Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }, (_, i) => `skeleton-${i}`).map((key) => (
              <Skeleton key={key} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {sectors.map((sector) => {
              const meta = SECTOR_META[sector.name] || {
                icon: "🌟",
                color: "from-purple-500 to-indigo-600",
              };
              const isSelected = selectedSector?.id === sector.id;

              return (
                <Card
                  key={sector.id.toString()}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    isSelected
                      ? "border-primary shadow-purple bg-primary/5"
                      : "border-border hover:border-primary/40 hover:shadow-sm"
                  }`}
                  onClick={() => setSelectedSector(sector)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-xl shrink-0 shadow-sm`}
                      >
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-foreground text-sm">
                            {sector.name}
                          </h3>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                          {sector.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              window.location.href = "/career-kickstart";
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={selectedSector === null}
            className="gradient-purple text-white font-semibold px-8 h-11 shadow-purple hover:shadow-purple-lg transition-all rounded-xl disabled:opacity-50"
          >
            Continue to Quiz
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
