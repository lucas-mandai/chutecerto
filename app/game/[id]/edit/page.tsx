import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameForm } from "@/components/game/game-form";
import { getGameById, updateGame } from "@/lib/actions/games";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGameById(id);

  if (!game) {
    notFound();
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    return updateGame(id, formData);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>

        <GameForm game={game} onSubmit={handleUpdate} submitLabel="Atualizar Jogo" />

        <div className="max-w-2xl mx-auto mt-6">
          <Button asChild variant="outline" className="w-full">
            <Link href={`/game/${id}/questions`}>
              Gerenciar Perguntas
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
