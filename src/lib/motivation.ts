export class IntrinsicMotivation {
  curiosity: number = 0.5;
  competence: number = 0.2;
  private accuracyHistory: number[] = [];

  update(error: number) {
    const difficulty = error;
    
    // 1. Information Gap Theory (Inverted U-Curve)
    if (difficulty < 0.2) {
      this.curiosity = 0.3 * (1 - difficulty); // BOREDOM
    } else if (difficulty <= 0.8) {
      this.curiosity = 1.0 - Math.abs(0.5 - difficulty); // OPTIMAL
    } else {
      this.curiosity = 0.2 * (1 - difficulty); // ANXIETY
    }

    // 2. Competence Level
    const accuracy = 1.0 - error;
    this.accuracyHistory.push(accuracy);
    if (this.accuracyHistory.length > 100) this.accuracyHistory.shift();
    
    this.competence = this.accuracyHistory.reduce((a, b) => a + b, 0) / this.accuracyHistory.length;
  }

  getOptimalChallenge(): number {
    return Math.min(1.0, this.competence + 0.15); // Vygotsky ZPD
  }

  getLearningRateModifier(): number {
    return 0.5 + (this.curiosity * 1.5);
  }
}
