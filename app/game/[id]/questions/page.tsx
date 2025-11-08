import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionForm } from "@/components/game/question-form";
import { QuestionPreview } from "@/components/game/question-preview";
import { getGameById } from "@/lib/actions/games";
import { getQuestionsByGameId } from "@/lib/actions/questions";
import { Separator } from "@/components/ui/separator";

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [game, questions] = await Promise.all([
    getGameById(id),
    getQuestionsByGameId(id),
  ]);

  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>

          {questions.length > 0 && (
            <Button asChild>
              <Link href={`/game/${id}/play`}>
                <Play className="mr-2 h-4 w-4" />
                Jogar
              </Link>
            </Button>
          )}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
          {game.description && (
            <p className="text-muted-foreground">{game.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <QuestionForm gameId={id} />
          </div>

          <div>
            <QuestionPreview questions={questions} gameId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
