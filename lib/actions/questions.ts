"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "./auth";
import { CreateQuestionData } from "@/types/game";

export async function getQuestionsByGameId(gameId: string) {
  const supabase = await createClient();

  const { data: questions, error } = await supabase
    .from("questions")
    .select(`
      *,
      answers (*)
    `)
    .eq("game_id", gameId)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }

  return questions;
}

export async function createQuestion(gameId: string, questionData: CreateQuestionData) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: "Não autenticado" };
  }

  // Verify user owns the game
  const { data: game } = await supabase
    .from("games")
    .select("id")
    .eq("id", gameId)
    .eq("user_id", user.id)
    .single();

  if (!game) {
    return { error: "Jogo não encontrado" };
  }

  // Validate question data
  if (!questionData.question_text || questionData.question_text.trim().length === 0) {
    return { error: "A pergunta não pode estar vazia" };
  }

  if (!questionData.answers || questionData.answers.length < 2) {
    return { error: "A pergunta deve ter pelo menos 2 respostas" };
  }

  const correctAnswersCount = questionData.answers.filter(a => a.is_correct).length;
  if (correctAnswersCount !== 1) {
    return { error: "A pergunta deve ter exatamente 1 resposta correta" };
  }

  // Get current question count to set order
  const { count } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("game_id", gameId);

  // Create question
  const { data: question, error: questionError } = await supabase
    .from("questions")
    .insert({
      game_id: gameId,
      question_text: questionData.question_text.trim(),
      order: count || 0,
    })
    .select()
    .single();

  if (questionError) {
    console.error("Error creating question:", questionError);
    return { error: "Erro ao criar pergunta" };
  }

  // Create answers
  const answersToInsert = questionData.answers.map((answer, index) => ({
    question_id: question.id,
    answer_text: answer.answer_text.trim(),
    is_correct: answer.is_correct,
    order: index,
  }));

  const { error: answersError } = await supabase
    .from("answers")
    .insert(answersToInsert);

  if (answersError) {
    console.error("Error creating answers:", answersError);
    // Rollback: delete the question
    await supabase.from("questions").delete().eq("id", question.id);
    return { error: "Erro ao criar respostas" };
  }

  revalidatePath(`/game/${gameId}/questions`);
  return { success: true };
}

export async function deleteQuestion(questionId: string, gameId: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: "Não autenticado" };
  }

  // Verify user owns the game
  const { data: game } = await supabase
    .from("games")
    .select("id")
    .eq("id", gameId)
    .eq("user_id", user.id)
    .single();

  if (!game) {
    return { error: "Jogo não encontrado" };
  }

  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId)
    .eq("game_id", gameId);

  if (error) {
    console.error("Error deleting question:", error);
    return { error: "Erro ao deletar pergunta" };
  }

  revalidatePath(`/game/${gameId}/questions`);
  return { success: true };
}
