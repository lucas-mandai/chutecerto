"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Home, RotateCcw } from "lucide-react";
import { GameResult } from "@/types/gameplay";
import { useRouter } from "next/navigation";

interface EndGameScreenProps {
  open: boolean;
  result: GameResult | null;
  onPlayAgain: () => void;
}

export function EndGameScreen({ open, result, onPlayAgain }: EndGameScreenProps) {
  const router = useRouter();

  if (!result) return null;

  const getWinnerMessage = () => {
    if (result.winner === "tie") {
      return "Empate!";
    }
    return result.winner === "team1"
      ? `${result.team1Name} Venceu!`
      : `${result.team2Name} Venceu!`;
  };

  const getWinnerColor = () => {
    if (result.winner === "tie") return "text-yellow-500";
    return "text-primary";
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Trophy className={`h-20 w-20 ${getWinnerColor()}`} />
          </div>
          <DialogTitle className={`text-center text-3xl ${getWinnerColor()}`}>
            {getWinnerMessage()}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{result.team1Name}</p>
                <p className="text-5xl font-bold">{result.team1Score}</p>
                <p className="text-sm text-muted-foreground mt-1">pontos</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{result.team2Name}</p>
                <p className="text-5xl font-bold">{result.team2Score}</p>
                <p className="text-sm text-muted-foreground mt-1">pontos</p>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex-1"
          >
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>
          <Button onClick={onPlayAgain} className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" />
            Jogar Novamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
