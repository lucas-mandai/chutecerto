"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TeamScoreboard } from "@/components/play/team-scoreboard";
import { QuestionCardGrid } from "@/components/play/question-card-grid";
import { QuestionModal } from "@/components/play/question-modal";
import { TrickCardModal } from "@/components/play/trick-card-modal";
import { EndGameScreen } from "@/components/play/end-game-screen";
import { QuestionWithAnswers } from "@/types/game";
import { TrickCard, GameResult, CardContent } from "@/types/gameplay";
import { generateTrickCards, applyTrickPoints } from "@/lib/utils/trick-cards";
import { shuffleArray } from "@/lib/utils/shuffle";
import { getQuestionsByGameId } from "@/lib/actions/questions";
import { getGameById } from "@/lib/actions/games";
import { toast } from "sonner";

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  const [gameName, setGameName] = useState("");
  const [cards, setCards] = useState<CardContent[]>([]);
  const [team1Name, setTeam1Name] = useState("Time 1");
  const [team2Name, setTeam2Name] = useState("Time 2");
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [usedQuestionIndices, setUsedQuestionIndices] = useState<Set<number>>(new Set());
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [currentTrick, setCurrentTrick] = useState<TrickCard | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showTrickModal, setShowTrickModal] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGame() {
      try {
        const [game, fetchedQuestions] = await Promise.all([
          getGameById(gameId),
          getQuestionsByGameId(gameId),
        ]);

        if (!game) {
          toast.error("Jogo não encontrado");
          router.push("/dashboard");
          return;
        }

        if (fetchedQuestions.length === 0) {
          toast.error("Este jogo não tem perguntas cadastradas");
          router.push(`/game/${gameId}/questions`);
          return;
        }

        setGameName(game.title);

        // Generate trick cards (same quantity as questions)
        const tricks = generateTrickCards(fetchedQuestions.length);

        // Create card array mixing questions and tricks
        const questionCards: CardContent[] = fetchedQuestions.map(q => ({
          type: 'question' as const,
          data: q
        }));
        const trickCardContents: CardContent[] = tricks.map(t => ({
          type: 'trick' as const,
          data: t
        }));

        // Shuffle all cards together
        const allCards = shuffleArray([...questionCards, ...trickCardContents]);
        setCards(allCards);

        setLoading(false);
      } catch (error) {
        toast.error("Erro ao carregar jogo");
        router.push("/dashboard");
      }
    }

    loadGame();
  }, [gameId, router]);

  // Check if game is over when all cards are used
  useEffect(() => {
    if (usedQuestionIndices.size === cards.length && cards.length > 0) {
      setTimeout(() => {
        const result: GameResult = {
          winner:
            team1Score > team2Score
              ? "team1"
              : team2Score > team1Score
              ? "team2"
              : "tie",
          team1Score,
          team2Score,
          team1Name,
          team2Name,
        };
        setGameResult(result);
      }, 500);
    }
  }, [usedQuestionIndices.size, cards.length, team1Score, team2Score, team1Name, team2Name]);

  function handleCardClick(index: number) {
    setSelectedCardIndex(index);

    const card = cards[index];

    if (card.type === 'trick') {
      // Show trick card
      setCurrentTrick(card.data);
      setShowTrickModal(true);
    } else {
      // Show question
      setShowQuestionModal(true);
    }
  }

  function handleTrickClose() {
    if (currentTrick && selectedCardIndex !== null) {
      // Apply trick points
      if (currentTurn === 1) {
        setTeam1Score(prev => applyTrickPoints(prev, currentTrick.type));
      } else {
        setTeam2Score(prev => applyTrickPoints(prev, currentTrick.type));
      }

      // Mark card as used
      setUsedQuestionIndices(prev => new Set(prev).add(selectedCardIndex));

      // Switch turn
      setCurrentTurn(prev => (prev === 1 ? 2 : 1));
    }

    setShowTrickModal(false);
    setCurrentTrick(null);
    setSelectedCardIndex(null);
  }

  function handleCorrectAnswer() {
    if (selectedCardIndex !== null) {
      // Add point to current team
      if (currentTurn === 1) {
        setTeam1Score(prev => prev + 1);
      } else {
        setTeam2Score(prev => prev + 1);
      }

      finishTurn();
    }
  }

  function handleWrongAnswer() {
    if (selectedCardIndex !== null) {
      finishTurn();
    }
  }

  function finishTurn() {
    if (selectedCardIndex === null) return;

    // Mark card as used
    const newUsedIndices = new Set(usedQuestionIndices).add(selectedCardIndex);
    setUsedQuestionIndices(newUsedIndices);

    // Switch turn
    setCurrentTurn(prev => (prev === 1 ? 2 : 1));

    // Close modal
    setShowQuestionModal(false);
    setSelectedCardIndex(null);
  }

  function handlePlayAgain() {
    setTeam1Score(0);
    setTeam2Score(0);
    setCurrentTurn(1);
    setUsedQuestionIndices(new Set());
    setGameResult(null);

    // Re-shuffle cards
    setCards(prev => shuffleArray([...prev]));
  }

  function handleTeamNamesUpdate(name1: string, name2: string) {
    setTeam1Name(name1);
    setTeam2Name(name2);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando jogo...</p>
      </div>
    );
  }

  // Get selected question (only if selected card is a question)
  const selectedQuestion =
    selectedCardIndex !== null && cards[selectedCardIndex]?.type === 'question'
      ? cards[selectedCardIndex].data
      : null;
  const currentTeamName = currentTurn === 1 ? team1Name : team2Name;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Container principal */}
      <div className="flex-1 flex flex-col overflow-hidden container mx-auto">
        {/* Scoreboard fixo */}
        <div className="flex-shrink-0 px-4 pt-4">
          <TeamScoreboard
            team1Name={team1Name}
            team2Name={team2Name}
            team1Score={team1Score}
            team2Score={team2Score}
            currentTurn={currentTurn}
            onTeamNamesUpdate={handleTeamNamesUpdate}
          />
        </div>

        {/* Cards com scroll se necessário */}
        <div className="flex-1 overflow-hidden px-6 pt-6 pb-6 sm:px-8 md:px-12">
          <QuestionCardGrid
            questionCount={cards.length}
            usedQuestionIndices={usedQuestionIndices}
            onCardClick={handleCardClick}
          />
        </div>
      </div>

      {/* Modals */}
      <QuestionModal
        open={showQuestionModal}
        question={selectedQuestion}
        currentTeamName={currentTeamName}
        onCorrect={handleCorrectAnswer}
        onWrong={handleWrongAnswer}
        onClose={() => setShowQuestionModal(false)}
      />

      <TrickCardModal
        open={showTrickModal}
        trick={currentTrick}
        onClose={handleTrickClose}
      />

      <EndGameScreen
        open={gameResult !== null}
        result={gameResult}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}
