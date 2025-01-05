import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface SequencePart {
  type: 'number' | 'operator';
  value: string | number;
}

interface Question {
  sequence: SequencePart[];
  userAnswer?: number;
  isCorrect?: boolean;
}

interface ScoreRecord {
  score: number;
  total: number;
  percentage: number;
  digitCount: number;
  questionCount: number;
  timestamp: Date;
}

@Component({
  selector: 'app-mix-math',
  templateUrl: './mix-math.component.html',
  styleUrls: ['./mix-math.component.scss'],
  animations: [
    trigger('fadeInOut', [transition(':enter', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))])])
  ]
})
export class MixMathComponent implements OnInit {
  digitCount = 1;
  questionCount = 5;
  questions: Question[] = [];
  testCompleted = false;
  score = 0;
  currentView = 'score';
  previousScores: ScoreRecord[] = [];
  selectedOperations: string[] = ['+', '-', '×', '÷'];

  availableDigits = [1, 2, 3];
  availableQuestionCounts = [5, 10, 15, 20];

  ngOnInit() {
    this.loadPreviousScores();
    this.generateQuestions();
  }

  onSettingsChange() {
    this.generateQuestions();
  }

  generateQuestions() {
    this.questions = [];
    for (let i = 0; i < this.questionCount; i++) {
      this.questions.push(this.generateQuestion());
    }
  }

  private generateQuestion(): Question {
    const sequence: SequencePart[] = [];

    // Get two different operators
    const operators = this.getRandomDifferentOperators();

    // Generate numbers ensuring division results in integers and no negative results
    const numbers: number[] = [];
    let i = 0;
    while (i < 3) {
      if (i < 2 && operators[i] === '÷') {
        // For division, generate divisor first, then multiply by another number
        // to get the dividend, ensuring clean division
        const divisor = this.generateNumber();
        const multiplier = this.generateNumber();
        const dividend = divisor * multiplier;
        numbers.push(dividend); // Push dividend first (it will be divided)
        numbers.push(divisor); // Push divisor second
        i += 2; // We added two numbers
      } else if (i < 2 && operators[i] === '-') {
        // For subtraction, ensure first number is larger than second
        const num2 = this.generateNumber();
        const num1 = this.generateNumber() + num2; // Ensure num1 > num2
        numbers.push(num1);
        numbers.push(num2);
        i += 2;
      } else {
        numbers.push(this.generateNumber());
        i++;
      }
    }

    // If the second operator is subtraction, ensure the result stays positive
    if (operators[1] === '-' && numbers.length > 2) {
      const prelimResult = this.evaluateFirstOperation(numbers[0], operators[0], numbers[1]);
      if (prelimResult < numbers[2]) {
        numbers[2] = this.generateNumber() % prelimResult; // Make sure the final number is smaller
      }
    }

    // Build sequence
    sequence.push({ type: 'number', value: numbers[0] });
    sequence.push({ type: 'operator', value: operators[0] });
    sequence.push({ type: 'number', value: numbers[1] });
    if (numbers.length > 2) {
      sequence.push({ type: 'operator', value: operators[1] });
      sequence.push({ type: 'number', value: numbers[2] });
    }

    return { sequence };
  }

  private generateNumber(): number {
    const min = Math.pow(10, this.digitCount - 1);
    const max = Math.pow(10, this.digitCount) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomDifferentOperators(): string[] {
    if (this.selectedOperations.length < 2) {
      return [this.selectedOperations[0], this.selectedOperations[0]];
    }

    const shuffled = [...this.selectedOperations].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }

  getCorrectAnswer(question: Question): number {
    return this.evaluateSequence(question.sequence);
  }

  private evaluateSequence(sequence: SequencePart[]): number {
    const simplifiedSequence = [...sequence];

    // First pass: handle multiplication and division left to right
    for (let i = 1; i < simplifiedSequence.length - 1; i += 2) {
      const operator = simplifiedSequence[i].value as string;
      if (operator === '×' || operator === '÷') {
        const num1 = Number(simplifiedSequence[i - 1].value);
        const num2 = Number(simplifiedSequence[i + 1].value);
        let result: number;

        if (operator === '×') {
          result = Math.floor(num1 * num2);
        } else {
          // division
          if (num2 === 0) return NaN;
          result = Math.floor(num1 / num2);
        }

        simplifiedSequence.splice(i - 1, 3, {
          type: 'number',
          value: Math.max(0, result)
        });
        i -= 2;
      }
    }

    // Second pass: handle addition and subtraction
    let result = Number(simplifiedSequence[0].value);
    for (let i = 1; i < simplifiedSequence.length; i += 2) {
      const operator = simplifiedSequence[i].value as string;
      const num = Number(simplifiedSequence[i + 1].value);

      if (operator === '+') {
        result = Math.floor(result + num);
      } else if (operator === '-') {
        result = Math.max(0, Math.floor(result - num));
      }
    }

    return Math.max(0, Math.floor(result));
  }

  checkAllAnswers() {
    let correctCount = 0;
    this.questions.forEach(question => {
      const correctAnswer = this.getCorrectAnswer(question);
      question.isCorrect = Number(question.userAnswer) === correctAnswer;
      if (question.isCorrect) correctCount++;
    });
    this.score = correctCount;
    this.testCompleted = true;
    this.savePreviousScore();
  }

  canSubmit(): boolean {
    return this.questions.every(q => q.userAnswer !== undefined);
  }

  getScorePercentage(): number {
    return (this.score / this.questions.length) * 100;
  }

  startNewTest() {
    this.generateQuestions();
    this.testCompleted = false;
    this.score = 0;
  }

  private savePreviousScore() {
    const scoreRecord: ScoreRecord = {
      score: this.score,
      total: this.questions.length,
      percentage: this.getScorePercentage(),
      digitCount: this.digitCount,
      questionCount: this.questionCount,
      timestamp: new Date()
    };

    const scores = this.loadPreviousScores();
    scores.unshift(scoreRecord);
    if (scores.length > 10) {
      scores.pop();
    }
    localStorage.setItem('mixMathScores', JSON.stringify(scores));
    this.previousScores = scores;
  }

  private loadPreviousScores(): ScoreRecord[] {
    const scores = localStorage.getItem('mixMathScores');
    this.previousScores = scores ? JSON.parse(scores) : [];
    return this.previousScores;
  }

  private evaluateFirstOperation(num1: number, operator: string, num2: number): number {
    switch (operator) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '×':
        return num1 * num2;
      case '÷':
        return Math.floor(num1 / num2);
      default:
        return 0;
    }
  }
}
