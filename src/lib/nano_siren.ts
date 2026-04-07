import { ZMSFACore } from './zmsfa.js';

export class NanoSIREN {
  private w1: Float32Array;
  private b1: Float32Array;
  private w2: Float32Array;
  private b2: number;
  private omega0: number = 30.0;
  private hiddenSize: number = 16;

  constructor() {
    this.w1 = new Float32Array(this.hiddenSize * 2); // 2 inputs (x, y)
    this.b1 = new Float32Array(this.hiddenSize);
    this.w2 = new Float32Array(this.hiddenSize);
    
    const seed = 42; 
    this.b2 = ZMSFACore.formalRandom(seed) - 0.5;

    for (let i = 0; i < this.w1.length; i++) this.w1[i] = (ZMSFACore.formalRandom(seed + i + 1) - 0.5) * 2;
    for (let i = 0; i < this.b1.length; i++) this.b1[i] = (ZMSFACore.formalRandom(seed + i + 100) - 0.5) * 2;
    for (let i = 0; i < this.w2.length; i++) this.w2[i] = (ZMSFACore.formalRandom(seed + i + 200) - 0.5) * 2;
  }

  forward(x: number, y: number): number {
    // Φ(x,y) = W2·sin(ω₀·(W1·[x,y]+b1)) + b2
    const hidden = new Float32Array(this.hiddenSize);
    for (let i = 0; i < this.hiddenSize; i++) {
      const z = this.omega0 * (this.w1[i * 2] * x + this.w1[i * 2 + 1] * y + this.b1[i]);
      hidden[i] = Math.sin(z);
    }

    let out = 0;
    for (let i = 0; i < this.hiddenSize; i++) {
      out += hidden[i] * this.w2[i];
    }
    return out + this.b2;
  }

  // Local delta-rule training (no global backprop)
  train(x: number, y: number, target: number, lr: number = 0.01) {
    const hidden = new Float32Array(this.hiddenSize);
    const zValues = new Float32Array(this.hiddenSize);
    for (let i = 0; i < this.hiddenSize; i++) {
      zValues[i] = this.omega0 * (this.w1[i * 2] * x + this.w1[i * 2 + 1] * y + this.b1[i]);
      hidden[i] = Math.sin(zValues[i]);
    }

    let out = 0;
    for (let i = 0; i < this.hiddenSize; i++) out += hidden[i] * this.w2[i];
    out += this.b2;

    const error = out - target;

    // Update weights
    this.b2 -= lr * error;
    for (let i = 0; i < this.hiddenSize; i++) {
      const dHidden = error * this.w2[i] * Math.cos(zValues[i]) * this.omega0;
      this.w2[i] -= lr * error * hidden[i];
      this.w1[i * 2] -= lr * dHidden * x;
      this.w1[i * 2 + 1] -= lr * dHidden * y;
      this.b1[i] -= lr * dHidden;
    }
  }
}
