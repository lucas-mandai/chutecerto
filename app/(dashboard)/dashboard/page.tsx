import Link from "next/link";
import { Plus, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/game/game-card";
import { EmptyState } from "@/components/common/empty-state";
import { getUserGames } from "@/lib/actions/games";

export default async function DashboardPage() {
  const games = await getUserGames();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Meus Jogos</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie e jogue seus jogos de perguntas e respostas
          </p>
        </div>
        <Button asChild>
          <Link href="/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Jogo
          </Link>
        </Button>
      </div>

      {games.length === 0 ? (
        <EmptyState
          icon={<Gamepad2 className="h-12 w-12" />}
          title="Nenhum jogo criado ainda"
          description="Comece criando seu primeiro jogo de perguntas e respostas"
          action={
            <Button asChild>
              <Link href="/create">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Jogo
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
