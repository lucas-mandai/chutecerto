"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Play, Trash2, Loader2 } from "lucide-react";
import { Game } from "@/types/game";
import { deleteGame } from "@/lib/actions/games";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteGame(game.id);

    if (result.error) {
      toast.error(result.error);
      setDeleting(false);
    } else {
      toast.success("Jogo deletado com sucesso");
      setShowDeleteDialog(false);
    }
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{game.title}</CardTitle>
          {game.description && (
            <CardDescription>{game.description}</CardDescription>
          )}
        </CardHeader>
        <CardFooter className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/game/${game.id}/play`}>
              <Play className="mr-2 h-4 w-4" />
              Jogar
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/game/${game.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar jogo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar "{game.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Deletar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
