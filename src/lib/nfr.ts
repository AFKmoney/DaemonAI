import { ZMSFACore } from './zmsfa.js';

export enum Granularity {
  WORD = 1.0,
  PHRASE = 0.6,
  SEMANTIC = 0.35,
  CONCEPTUAL = 0.18
}

export class NanoSIREN {
  w1: number;
  b1: number;
  w2: number;
  b2: number;
  omega0: number = 30.0;

  constructor(seed: number = 42) {
    this.w1 = ZMSFACore.formalRandom(seed) - 0.5;
    this.b1 = ZMSFACore.formalRandom(seed + 1) - 0.5;
    this.w2 = ZMSFACore.formalRandom(seed + 2) - 0.5;
    this.b2 = ZMSFACore.formalRandom(seed + 3) - 0.5;
  }

  forward(x: number): number {
    // Φ(x) = W2·sin(ω₀·(W1·x + b1)) + b2
    const z1 = this.omega0 * (this.w1 * x + this.b1);
    return this.w2 * Math.sin(z1) + this.b2;
  }

  train(x: number, target: number, lr: number = 0.005) {
    const z1 = this.omega0 * (this.w1 * x + this.b1);
    const y = this.w2 * Math.sin(z1) + this.b2;
    const dy = y - target;

    // Simplified Gradient Descent
    this.w2 -= lr * dy * Math.sin(z1);
    this.b2 -= lr * dy;
    const dz1 = dy * this.w2 * Math.cos(z1) * this.omega0;
    this.w1 -= lr * dz1 * x;
    this.b1 -= lr * dz1;
  }
}

export class NFR {
  private sirens: Map<Granularity, NanoSIREN> = new Map();
  private accumulators: Map<Granularity, number> = new Map();

  constructor() {
    [Granularity.WORD, Granularity.PHRASE, Granularity.SEMANTIC, Granularity.CONCEPTUAL].forEach(g => {
      this.sirens.set(g, new NanoSIREN());
      this.accumulators.set(g, 0);
    });
  }

  tick(inputEnergy: number) {
    for (const [g, siren] of this.sirens.entries()) {
      const learnedWeight = siren.forward(inputEnergy / 255);
      const effectiveDecay = g * (0.8 + 0.2 * Math.tanh(learnedWeight));
      const current = this.accumulators.get(g) || 0;
      this.accumulators.set(g, (current * 0.9) + (inputEnergy * effectiveDecay));
      
      // Auto-tuning
      siren.train(inputEnergy / 255, current / 255);
    }
  }

  getCoherence(): number {
    let sum = 0;
    this.accumulators.forEach(v => sum += v);
    return Math.min(1.0, sum / 1024);
  }

  getDominantDepth(): string {
    let max = -1;
    let dominant = 'WORD';
    this.accumulators.forEach((v, k) => {
      if (v > max) {
        max = v;
        dominant = Granularity[k] || 'UNKNOWN';
      }
    });
    return dominant;
  }
}
