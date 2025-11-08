import { QuestionWithAnswers } from "./game";

export type TrickCardType = "BONUS_1" | "BONUS_2" | "PENALTY_1" | "PENALTY_2";

export interface TrickCard {
  type: TrickCardType;
  points: number;
  message: string;
}

export type CardContent =
  | { type: 'question'; data: QuestionWithAnswers }
  | { type: 'trick'; data: TrickCard };

export interface GameState {
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  currentTurn: 1 | 2;
  usedQuestions: Set<number>;
  questions: QuestionWithAnswers[];
  trickCards: Map<number, TrickCard>;
  gameOver: boolean;
}

export interface GameResult {
  winner: "team1" | "team2" | "tie";
  team1Score: number;
  team2Score: number;
  team1Name: string;
  team2Name: string;
}
