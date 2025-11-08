import { Database } from "./database";

export type Game = Database["public"]["Tables"]["games"]["Row"];
export type GameInsert = Database["public"]["Tables"]["games"]["Insert"];
export type GameUpdate = Database["public"]["Tables"]["games"]["Update"];

export interface GameWithQuestions extends Game {
  questions: QuestionWithAnswers[];
}

export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type QuestionInsert = Database["public"]["Tables"]["questions"]["Insert"];
export type QuestionUpdate = Database["public"]["Tables"]["questions"]["Update"];

export type Answer = Database["public"]["Tables"]["answers"]["Row"];
export type AnswerInsert = Database["public"]["Tables"]["answers"]["Insert"];
export type AnswerUpdate = Database["public"]["Tables"]["answers"]["Update"];

export interface QuestionWithAnswers extends Question {
  answers: Answer[];
}

export interface CreateQuestionData {
  question_text: string;
  answers: {
    answer_text: string;
    is_correct: boolean;
  }[];
}
