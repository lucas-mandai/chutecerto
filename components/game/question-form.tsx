"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createQuestion } from "@/lib/actions/questions";
import { CreateQuestionData } from "@/types/game";

interface QuestionFormProps {
  gameId: string;
  onSuccess?: () => void;
}

interface Answer {
  id: string;
  text: string;
}

export function QuestionForm({ gameId, onSuccess }: QuestionFormProps) {
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
  ]);
  const [correctAnswerId, setCorrectAnswerId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function addAnswer() {
    if (answers.length >= 6) {
      toast.error("Máximo de 6 respostas permitidas");
      return;
    }
    setAnswers([...answers, { id: Date.now().toString(), text: "" }]);
  }

  function removeAnswer(id: string) {
    if (answers.length <= 2) {
      toast.error("Mínimo de 2 respostas necessárias");
      return;
    }
    setAnswers(answers.filter(a => a.id !== id));
    if (correctAnswerId === id) {
      setCorrectAnswerId("");
    }
  }

  function updateAnswerText(id: string, text: string) {
    setAnswers(answers.map(a => (a.id === id ? { ...a, text } : a)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!questionText.trim()) {
      toast.error("Digite a pergunta");
      return;
    }

    const filledAnswers = answers.filter(a => a.text.trim());
    if (filledAnswers.length < 2) {
      toast.error("Preencha pelo menos 2 respostas");
      return;
    }

    if (!correctAnswerId) {
      toast.error("Selecione a resposta correta");
      return;
    }

    setLoading(true);

    const questionData: CreateQuestionData = {
      question_text: questionText,
      answers: answers
        .filter(a => a.text.trim())
        .map(a => ({
          answer_text: a.text,
          is_correct: a.id === correctAnswerId,
        })),
    };

    const result = await createQuestion(gameId, questionData);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success("Pergunta criada com sucesso");
      // Reset form
      setQuestionText("");
      setAnswers([
        { id: Date.now().toString(), text: "" },
        { id: (Date.now() + 1).toString(), text: "" },
      ]);
      setCorrectAnswerId("");
      setLoading(false);
      onSuccess?.();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Pergunta</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Pergunta *</Label>
            <Input
              id="question"
              placeholder="Digite sua pergunta"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              maxLength={500}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Respostas *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAnswer}
                disabled={loading || answers.length >= 6}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>

            <RadioGroup value={correctAnswerId} onValueChange={setCorrectAnswerId}>
              <div className="space-y-3">
                {answers.map((answer, index) => (
                  <div key={answer.id} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={answer.id}
                      id={`answer-${answer.id}`}
                      disabled={loading}
                    />
                    <Input
                      placeholder={`Resposta ${index + 1}`}
                      value={answer.text}
                      onChange={(e) => updateAnswerText(answer.id, e.target.value)}
                      maxLength={200}
                      disabled={loading}
                      className="flex-1"
                    />
                    {answers.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAnswer(answer.id)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Selecione o círculo ao lado da resposta correta
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Pergunta"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
