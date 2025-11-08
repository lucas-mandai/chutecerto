"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { QuestionWithAnswers } from "@/types/game";
import { deleteQuestion } from "@/lib/actions/questions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuestionPreviewProps {
  questions: QuestionWithAnswers[];
  gameId: string;
}

export function QuestionPreview({ questions, gameId }: QuestionPreviewProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<QuestionWithAnswers | null>(null);

  async function handleDelete(questionId: string) {
    setDeletingId(questionId);
    const result = await deleteQuestion(questionId, gameId);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pergunta deletada");
    }

    setDeletingId(null);
    setShowDeleteDialog(false);
    setQuestionToDelete(null);
  }

  function confirmDelete(question: QuestionWithAnswers) {
    setQuestionToDelete(question);
    setShowDeleteDialog(true);
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Cadastradas</CardTitle>
          <CardDescription>
            Nenhuma pergunta criada ainda. Adicione sua primeira pergunta acima.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Perguntas Cadastradas ({questions.length})
        </h3>
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </div>
                  <CardTitle className="text-base">{question.question_text}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => confirmDelete(question)}
                  disabled={deletingId === question.id}
                >
                  {deletingId === question.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {question.answers
                  .sort((a, b) => a.order - b.order)
                  .map((answer) => (
                    <div
                      key={answer.id}
                      className={`flex items-center gap-2 p-2 rounded-md ${
                        answer.is_correct ? "bg-green-50 dark:bg-green-950" : "bg-muted"
                      }`}
                    >
                      {answer.is_correct && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                      <span className={answer.is_correct ? "font-medium" : ""}>
                        {answer.answer_text}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar pergunta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar esta pergunta? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setQuestionToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => questionToDelete && handleDelete(questionToDelete.id)}
              disabled={deletingId !== null}
            >
              {deletingId !== null ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Deletar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
