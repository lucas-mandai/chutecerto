"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TeamScoreboardProps {
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  currentTurn: 1 | 2;
  onTeamNamesUpdate: (team1: string, team2: string) => void;
}

export function TeamScoreboard({
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  currentTurn,
  onTeamNamesUpdate,
}: TeamScoreboardProps) {
  const [editingTeam1, setEditingTeam1] = useState(false);
  const [editingTeam2, setEditingTeam2] = useState(false);
  const [tempName1, setTempName1] = useState(team1Name);
  const [tempName2, setTempName2] = useState(team2Name);

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);

  // Auto-focus quando começa a editar
  useEffect(() => {
    if (editingTeam1 && input1Ref.current) {
      input1Ref.current.focus();
      input1Ref.current.select();
    }
  }, [editingTeam1]);

  useEffect(() => {
    if (editingTeam2 && input2Ref.current) {
      input2Ref.current.focus();
      input2Ref.current.select();
    }
  }, [editingTeam2]);

  function handleStartEditTeam1() {
    setTempName1(team1Name);
    setEditingTeam1(true);
  }

  function handleStartEditTeam2() {
    setTempName2(team2Name);
    setEditingTeam2(true);
  }

  function handleSaveTeam1() {
    const newName = tempName1.trim() || "Time 1";
    onTeamNamesUpdate(newName, team2Name);
    setEditingTeam1(false);
  }

  function handleSaveTeam2() {
    const newName = tempName2.trim() || "Time 2";
    onTeamNamesUpdate(team1Name, newName);
    setEditingTeam2(false);
  }

  function handleCancelTeam1() {
    setTempName1(team1Name);
    setEditingTeam1(false);
  }

  function handleCancelTeam2() {
    setTempName2(team2Name);
    setEditingTeam2(false);
  }

  function handleKeyDownTeam1(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSaveTeam1();
    } else if (e.key === "Escape") {
      handleCancelTeam1();
    }
  }

  function handleKeyDownTeam2(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSaveTeam2();
    } else if (e.key === "Escape") {
      handleCancelTeam2();
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      <Card className={`p-2 md:py-2 md:px-4 ${currentTurn === 1 ? "ring-2 ring-primary" : ""}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {!editingTeam1 && (
              <button
                onClick={handleStartEditTeam1}
                className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                aria-label="Editar nome do time 1"
              >
                <Edit className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
            {editingTeam1 ? (
              <Input
                ref={input1Ref}
                value={tempName1}
                onChange={(e) => setTempName1(e.target.value)}
                onBlur={handleSaveTeam1}
                onKeyDown={handleKeyDownTeam1}
                maxLength={30}
                className="h-7 text-base md:text-lg font-semibold flex-1"
              />
            ) : (
              <h3 className="text-base md:text-lg font-semibold truncate">{team1Name}</h3>
            )}
          </div>
          {currentTurn === 1 && !editingTeam1 && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
              Vez
            </span>
          )}
        </div>
        <p className="text-3xl md:text-4xl font-bold">{team1Score}</p>
      </Card>

      <Card className={`p-2 md:p-2 md:px-4 ${currentTurn === 2 ? "ring-2 ring-primary" : ""}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {!editingTeam2 && (
              <button
                onClick={handleStartEditTeam2}
                className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                aria-label="Editar nome do time 2"
              >
                <Edit className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
            {editingTeam2 ? (
              <Input
                ref={input2Ref}
                value={tempName2}
                onChange={(e) => setTempName2(e.target.value)}
                onBlur={handleSaveTeam2}
                onKeyDown={handleKeyDownTeam2}
                maxLength={30}
                className="h-7 text-base md:text-lg font-semibold flex-1"
              />
            ) : (
              <h3 className="text-base md:text-lg font-semibold truncate">{team2Name}</h3>
            )}
          </div>
          {currentTurn === 2 && !editingTeam2 && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
              Vez
            </span>
          )}
        </div>
        <p className="text-3xl md:text-4xl font-bold">{team2Score}</p>
      </Card>
    </div>
  );
}
