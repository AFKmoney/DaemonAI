export class EligibilityTrace {
  private traces: Map<string, number> = new Map();
  private gamma: number = 0.95;
  private lambda: number = 0.85;

  update(id: string, activation: number) {
    const current = this.traces.get(id) || 0;
    // e(t) = γλ·e(t-1) + A(t)
    this.traces.set(id, current * this.gamma * this.lambda + activation);
  }

  getTrace(id: string): number {
    return this.traces.get(id) || 0;
  }

  tick() {
    this.traces.forEach((v, k) => {
      this.traces.set(k, v * this.gamma * this.lambda);
    });
  }

  getPeak(): number {
    let max = 0;
    this.traces.forEach(v => { if (v > max) max = v; });
    return max;
  }
}
