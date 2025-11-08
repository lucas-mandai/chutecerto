"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestionCardGridProps {
  questionCount: number;
  usedQuestionIndices: Set<number>;
  onCardClick: (index: number) => void;
}

// Calcular número ideal de colunas baseado na quantidade de cards
// Objetivo: maximizar uso horizontal e minimizar scroll (máximo 2-3 linhas em desktop)
function getGridCols(count: number): number {
  if (count <= 4) return 2;    // 2×2 = 4 cards
  if (count <= 6) return 3;    // 3×2 = 6 cards
  if (count <= 8) return 4;    // 4×2 = 8 cards
  if (count <= 10) return 5;   // 5×2 = 10 cards
  if (count <= 12) return 6;   // 6×2 = 12 cards
  if (count <= 18) return 6;   // 6×3 = 18 cards
  return 6;                    // 6×N para 19+ cards
}

export function QuestionCardGrid({
  questionCount,
  usedQuestionIndices,
  onCardClick,
}: QuestionCardGridProps) {
  const cols = getGridCols(questionCount);

  return (
    <div
      className={cn(
        "grid gap-3 sm:gap-4 md:gap-6 auto-rows-fr w-full h-full",
        cols === 2 && "grid-cols-2",
        cols === 3 && "grid-cols-2 sm:grid-cols-3",
        cols === 4 && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
        cols === 5 && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
        cols === 6 && "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
      )}
    >
      {Array.from({ length: questionCount }, (_, index) => {
        const isUsed = usedQuestionIndices.has(index);

        return (
          <Card
            key={index}
            className={cn(
              "flex items-center justify-center cursor-pointer transition-all hover:shadow-lg hover:scale-105",
              "min-w-32 sm:min-w-40 md:min-w-48 lg:min-w-56",
              isUsed
                ? "opacity-30 cursor-not-allowed bg-muted"
                : ""
            )}
            style={!isUsed ? {
              background: 'linear-gradient(to right, #6dd5ed, #2193b0)'
            } : undefined}
            onClick={() => !isUsed && onCardClick(index)}
          >
            <span className={cn(
              "text-2xl sm:text-3xl md:text-6xl font-bold",
              isUsed ? "text-muted-foreground" : "text-white"
            )}>
              {index + 1}
            </span>
          </Card>
        );
      })}
    </div>
  );
}
