"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TeamNameEditorProps {
  open: boolean;
  onClose: () => void;
  team1Name: string;
  team2Name: string;
  onSave: (team1: string, team2: string) => void;
}

export function TeamNameEditor({
  open,
  onClose,
  team1Name,
  team2Name,
  onSave,
}: TeamNameEditorProps) {
  const [name1, setName1] = useState(team1Name);
  const [name2, setName2] = useState(team2Name);

  function handleSave() {
    onSave(name1.trim() || "Time 1", name2.trim() || "Time 2");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Nomes dos Times</DialogTitle>
          <DialogDescription>
            Personalize os nomes das equipes
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="team1">Time 1</Label>
            <Input
              id="team1"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="Nome do Time 1"
              maxLength={30}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team2">Time 2</Label>
            <Input
              id="team2"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Nome do Time 2"
              maxLength={30}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
