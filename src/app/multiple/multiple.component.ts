import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ScoreService } from '../_share/services/score.service';

interface Question {
  num1: number;
  num2: number;
  userAnswer: number | null;
  isCorrect?: boolean;
}

@Component({
  selector: 'app-multiple',
  templateUrl: './multiple.component.html',
  styleUrls: ['./multiple.component.scss'],
  animations: [
    trigger('fadeInOut', [transition(':enter', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))])])
  ]
})
export class MultipleComponent implements OnInit {
  questions: Question[] = [];
  testCompleted: boolean = false;
  score: number = 0;

  digitCount: number = 1; // Start with 1 digit for multiplication
  availableDigits: number[] = [1, 2, 3]; // Limit to 3 digits to avoid huge numbers
  questionCount: number = 5;
  availableQuestionCounts: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  previousScores: any[] = [];
  currentView: 'score' | 'review' = 'score';

  constructor(private scoreService: ScoreService) {}

  ngOnInit() {
    this.startNewTest();
    this.loadPreviousScores();
  }

  loadPreviousScores() {
    this.previousScores = this.scoreService.getScoresByOperation('multiply');

    if (this.previousScores.length > 0) {
      this.previousScores = this.previousScores
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5); // Get last 5 scores
    }
  }

  startNewTest() {
    this.questions = Array(this.questionCount)
      .fill(null)
      .map(() => this.generateQuestion());
    this.testCompleted = false;
    this.score = 0;
  }

  generateQuestion(): Question {
    const maxNumber = Math.pow(10, this.digitCount) - 1;
    return {
      num1: Math.floor(Math.random() * maxNumber) + 1,
      num2: Math.floor(Math.random() * maxNumber) + 1,
      userAnswer: null
    };
  }

  canSubmit(): boolean {
    return this.questions.every(q => q.userAnswer !== null);
  }

  checkAllAnswers() {
    this.score = 0;
    this.questions.forEach(question => {
      const correctAnswer = question.num1 * question.num2;
      question.isCorrect = Number(question.userAnswer) === Number(correctAnswer);
      if (question.isCorrect) {
        this.score++;
      }
    });
    this.testCompleted = true;

    // Save score
    this.scoreService.saveScore({
      operation: 'multiply',
      score: this.score,
      total: this.questions.length,
      percentage: this.getScorePercentage(),
      digitCount: this.digitCount,
      questionCount: this.questionCount,
      timestamp: new Date()
    });

    this.loadPreviousScores();
  }

  getScorePercentage(): number {
    return (this.score / this.questions.length) * 100;
  }

  onSettingsChange() {
    this.startNewTest();
  }
}
