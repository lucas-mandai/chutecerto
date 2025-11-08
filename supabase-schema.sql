-- Chute Certo Database Schema
-- Execute este arquivo no SQL Editor do Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) >= 3),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER DEFAULT 0 NOT NULL
);

-- Create game_sessions table (optional - for saving game state)
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  team1_name TEXT DEFAULT 'Time 1' NOT NULL,
  team2_name TEXT DEFAULT 'Time 2' NOT NULL,
  team1_score INTEGER DEFAULT 0 NOT NULL,
  team2_score INTEGER DEFAULT 0 NOT NULL,
  current_turn INTEGER DEFAULT 1 NOT NULL,
  used_questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Games policies
CREATE POLICY "Users can view their own games"
  ON games FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create games"
  ON games FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own games"
  ON games FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own games"
  ON games FOR DELETE
  USING (auth.uid() = user_id);

-- Questions policies
CREATE POLICY "Users can view questions of their games"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = questions.game_id
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create questions in their games"
  ON questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = questions.game_id
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions in their games"
  ON questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = questions.game_id
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions in their games"
  ON questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = questions.game_id
      AND games.user_id = auth.uid()
    )
  );

-- Answers policies
CREATE POLICY "Users can view answers of their questions"
  ON answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM questions
      JOIN games ON games.id = questions.game_id
      WHERE questions.id = answers.question_id
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create answers in their questions"
  ON answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM questions
      JOIN games ON games.id = questions.game_id
      WHERE questions.id = answers.question_id
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete answers in their questions"
  ON answers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM questions
      JOIN games ON games.id = questions.game_id
      WHERE questions.id = answers.question_id
      AND games.user_id = auth.uid()
    )
  );

-- Game sessions policies
CREATE POLICY "Users can view sessions of their games"
  ON game_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_sessions.game_id
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create sessions in their games"
  ON game_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_sessions.game_id
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sessions of their games"
  ON game_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_sessions.game_id
      AND games.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS games_user_id_idx ON games(user_id);
CREATE INDEX IF NOT EXISTS questions_game_id_idx ON questions(game_id);
CREATE INDEX IF NOT EXISTS answers_question_id_idx ON answers(question_id);
CREATE INDEX IF NOT EXISTS game_sessions_game_id_idx ON game_sessions(game_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
