"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Game } from "@/types/game";

interface GameFormProps {
  game?: Game;
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  submitLabel?: string;
}

export function GameForm({ game, onSubmit, submitLabel = "Criar Jogo" }: GameFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const result = await onSubmit(formData);
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
      } else if (result?.success) {
        toast.success("Jogo atualizado com sucesso");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao salvar jogo");
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{game ? "Editar Jogo" : "Novo Jogo"}</CardTitle>
        <CardDescription>
          {game
            ? "Atualize as informações do seu jogo"
            : "Preencha os dados para criar um novo jogo"}
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Nome do jogo"
              required
              minLength={3}
              maxLength={100}
              defaultValue={game?.title}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descrição do jogo (opcional)"
              maxLength={500}
              rows={4}
              defaultValue={game?.description || ""}
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
