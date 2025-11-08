"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuestionWithAnswers } from "@/types/game";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionModalProps {
  open: boolean;
  question: QuestionWithAnswers | null;
  currentTeamName: string;
  onCorrect: () => void;
  onWrong: () => void;
  onClose?: () => void;
}

export function QuestionModal({
  open,
  question,
  currentTeamName,
  onCorrect,
  onWrong,
  onClose,
}: QuestionModalProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  // Reset showAnswer when modal opens with a new question
  useEffect(() => {
    if (open) {
      setShowAnswer(false);
    }
  }, [open]);

  function handleClose() {
    setShowAnswer(false);
  }

  if (!question) return null;

  const sortedAnswers = [...question.answers].sort((a, b) => a.order - b.order);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
          onClose?.();
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-2">
            <Badge>Vez de: {currentTeamName}</Badge>
          </div>
          <DialogTitle className="text-xl">{question.question_text}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-6">
          {sortedAnswers.map((answer, index) => (
            <div
              key={answer.id}
              className={`p-4 rounded-lg border-2 transition-colors ${
                showAnswer && answer.is_correct
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "border-border bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className={showAnswer && answer.is_correct ? "font-semibold" : ""}>
                  {answer.answer_text}
                </span>
                {showAnswer && answer.is_correct && (
                  <CheckCircle2 className="ml-auto h-5 w-5 text-green-600 dark:text-green-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!showAnswer ? (
            <Button onClick={() => setShowAnswer(true)} className="w-full">
              Mostrar Resposta
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onWrong}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Errou
              </Button>
              <Button
                onClick={onCorrect}
                className="flex-1"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Acertou
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
