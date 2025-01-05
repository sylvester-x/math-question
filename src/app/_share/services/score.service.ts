import { Injectable } from '@angular/core';

export interface ScoreRecord {
  operation: 'add' | 'minus' | 'multiply' | 'divide';
  score: number;
  total: number;
  percentage: number;
  digitCount: number;
  questionCount: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private readonly STORAGE_KEY = 'math_practice_scores';

  constructor() {}

  saveScore(record: ScoreRecord): void {
    const scores = this.getScores();
    scores.push(record);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
  }

  getScores(): ScoreRecord[] {
    const scoresJson = sessionStorage.getItem(this.STORAGE_KEY);
    return scoresJson ? JSON.parse(scoresJson) : [];
  }

  getScoresByOperation(operation: ScoreRecord['operation']): ScoreRecord[] {
    return this.getScores().filter(score => score.operation === operation);
  }

  clearScores(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}
