"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "./auth";

export async function getUserGames() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching games:", error);
    return [];
  }

  return data;
}

export async function getGameById(id: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching game:", error);
    return null;
  }

  return data;
}

export async function createGame(formData: FormData) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: "Não autenticado" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || title.trim().length < 3) {
    return { error: "O título deve ter pelo menos 3 caracteres" };
  }

  const { data, error } = await supabase
    .from("games")
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating game:", error);
    return { error: "Erro ao criar jogo" };
  }

  revalidatePath("/dashboard");
  redirect(`/game/${data.id}/questions`);
}

export async function updateGame(id: string, formData: FormData) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: "Não autenticado" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || title.trim().length < 3) {
    return { error: "O título deve ter pelo menos 3 caracteres" };
  }

  const { error } = await supabase
    .from("games")
    .update({
      title: title.trim(),
      description: description?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating game:", error);
    return { error: "Erro ao atualizar jogo" };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/game/${id}`);
  return { success: true };
}

export async function deleteGame(id: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: "Não autenticado" };
  }

  const { error } = await supabase
    .from("games")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting game:", error);
    return { error: "Erro ao deletar jogo" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
