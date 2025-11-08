export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      games: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          game_id: string;
          question_text: string;
          created_at: string;
          order: number;
        };
        Insert: {
          id?: string;
          game_id: string;
          question_text: string;
          created_at?: string;
          order?: number;
        };
        Update: {
          id?: string;
          game_id?: string;
          question_text?: string;
          created_at?: string;
          order?: number;
        };
      };
      answers: {
        Row: {
          id: string;
          question_id: string;
          answer_text: string;
          is_correct: boolean;
          order: number;
        };
        Insert: {
          id?: string;
          question_id: string;
          answer_text: string;
          is_correct: boolean;
          order?: number;
        };
        Update: {
          id?: string;
          question_id?: string;
          answer_text?: string;
          is_correct?: boolean;
          order?: number;
        };
      };
      game_sessions: {
        Row: {
          id: string;
          game_id: string;
          team1_name: string;
          team2_name: string;
          team1_score: number;
          team2_score: number;
          current_turn: number;
          used_questions: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          team1_name?: string;
          team2_name?: string;
          team1_score?: number;
          team2_score?: number;
          current_turn?: number;
          used_questions?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          team1_name?: string;
          team2_name?: string;
          team1_score?: number;
          team2_score?: number;
          current_turn?: number;
          used_questions?: Json;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
