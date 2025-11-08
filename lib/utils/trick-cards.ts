import { TrickCard, TrickCardType } from "@/types/gameplay";

const TRICK_CARD_TYPES: { type: TrickCardType; points: number; message: string }[] = [
  { type: "BONUS_1", points: 1, message: "Parabéns! Ganhou 1 ponto bônus!" },
  { type: "BONUS_2", points: 2, message: "Boa sorte! Ganhou 2 pontos bônus!" },
  { type: "PENALTY_1", points: -1, message: "Que azar! Perdeu 1 ponto!" },
  { type: "PENALTY_2", points: -2, message: "Ops! Perdeu 2 pontos!" },
];

// Generate trick cards equal to the number of questions (100%)
// This means the grid will have 2x cards: questions + tricks
// The total sum of all trick cards will always be zero for fairness
export function generateTrickCards(questionCount: number): TrickCard[] {
  const trickCards: TrickCard[] = [];

  // Special case: cannot balance a single card
  if (questionCount === 1) {
    const randomType = TRICK_CARD_TYPES[Math.floor(Math.random() * TRICK_CARD_TYPES.length)];
    return [{
      type: randomType.type,
      points: randomType.points,
      message: randomType.message,
    }];
  }

  // Helper to create a trick card
  const createTrick = (points: number): TrickCard => {
    const trickType = TRICK_CARD_TYPES.find(t => t.points === points)!;
    return {
      type: trickType.type,
      points: trickType.points,
      message: trickType.message,
    };
  };

  // Balanced pairs that sum to zero
  const balancedPairs = [
    [2, -2],   // BONUS_2 + PENALTY_2
    [1, -1],   // BONUS_1 + PENALTY_1
  ];

  // Balanced trios that sum to zero
  const balancedTrios = [
    [2, -1, -1],  // BONUS_2 + PENALTY_1 + PENALTY_1
    [1, 1, -2],   // BONUS_1 + BONUS_1 + PENALTY_2
  ];

  let remaining = questionCount;

  // Fill with pairs and trios to sum zero
  while (remaining > 0) {
    if (remaining === 3) {
      // Exactly 3 remaining: use trio
      const trio = balancedTrios[Math.floor(Math.random() * balancedTrios.length)];
      trio.forEach(points => trickCards.push(createTrick(points)));
      remaining = 0;
    } else if (remaining === 2) {
      // Exactly 2 remaining: use pair
      const pair = balancedPairs[Math.floor(Math.random() * balancedPairs.length)];
      pair.forEach(points => trickCards.push(createTrick(points)));
      remaining = 0;
    } else if (remaining >= 4 && Math.random() < 0.3) {
      // 30% chance to use trio when >= 4
      const trio = balancedTrios[Math.floor(Math.random() * balancedTrios.length)];
      trio.forEach(points => trickCards.push(createTrick(points)));
      remaining -= 3;
    } else {
      // Use pair (default)
      const pair = balancedPairs[Math.floor(Math.random() * balancedPairs.length)];
      pair.forEach(points => trickCards.push(createTrick(points)));
      remaining -= 2;
    }
  }

  return trickCards;
}

export function applyTrickPoints(currentScore: number, trickType: TrickCardType): number {
  const trick = TRICK_CARD_TYPES.find(t => t.type === trickType);
  if (!trick) return currentScore;

  const newScore = currentScore + trick.points;
  return newScore; // Allow negative scores
}
