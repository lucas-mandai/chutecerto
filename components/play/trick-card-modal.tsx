"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrickCard } from "@/types/gameplay";
import { Sparkles, Zap } from "lucide-react";

interface TrickCardModalProps {
  open: boolean;
  trick: TrickCard | null;
  onClose: () => void;
}

export function TrickCardModal({ open, trick, onClose }: TrickCardModalProps) {
  if (!trick) return null;

  const isBonus = trick.points > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {isBonus ? (
              <Sparkles className="h-16 w-16 text-yellow-500" />
            ) : (
              <Zap className="h-16 w-16 text-red-500" />
            )}
          </div>
          <DialogTitle className="text-center text-2xl">
            {isBonus ? "Carta Bônus!" : "Carta Pegadinha!"}
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <p className="text-lg font-medium">{trick.message}</p>
          <p className="text-4xl font-bold mt-4">
            {trick.points > 0 ? "+" : ""}
            {trick.points} ponto{Math.abs(trick.points) !== 1 ? "s" : ""}
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
