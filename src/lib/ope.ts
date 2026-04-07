export enum WaveType {
  DELTA = 2,
  THETA = 6,
  ALPHA = 10,
  BETA = 20,
  GAMMA = 40,
  ZETA = 60
}

export class OPE {
  private alpha = 1 / Math.pow(Math.PI, 3);
  public ternaryMode: boolean = false;

  // Periodic Cubic Activation (Standard OPE)
  activate(energy: number, omega: WaveType): number {
    const x = energy / 255;
    const xHat = ((x * omega) % (2 * Math.PI)) - Math.PI;
    let psi = this.alpha * (Math.pow(xHat, 3) - Math.pow(Math.PI, 2) * xHat);

    if (this.ternaryMode) {
      if (psi > 0.3) psi = 1.0;
      else if (psi < -0.3) psi = -1.0;
      else psi = 0;
    }

    return Math.floor((psi + 1) * 127.5);
  }

  // Fractal Activation: f(x) = x / (1 + |x|^α)
  // Hausdorff dimension α = log2(3) ≈ 1.585 for ternary
  fracAct(x: number, nfrLevel: number = 0): number {
    // Hausdorff dimension α increases with NFR depth
    const alpha = Math.min(2.0, 1.585 * Math.pow(1.585, nfrLevel));
    const val = x / 128 - 1; // Center at 0
    const activated = val / (1 + Math.pow(Math.abs(val), alpha));
    return Math.floor((activated + 1) * 127.5);
  }

  // Mandelbrot Activation: Based on escape time dynamics
  mandelbrotAct(energy: number): number {
    const cRe = (energy - 128) / 128;
    const cIm = (energy - 128) / 256;
    
    let zRe = 0;
    let zIm = 0;
    let escapeTime = 8;
    
    for (let i = 0; i < 8; i++) {
      const nextRe = zRe * zRe - zIm * zIm + cRe;
      const nextIm = 2 * zRe * zIm + cIm;
      zRe = nextRe;
      zIm = nextIm;
      if (zRe * zRe + zIm * zIm > 4) {
        escapeTime = i;
        break;
      }
    }
    
    const normEscape = 1 - (escapeTime + 1) / 8; // 0 to 1
    const modulator = 0.7 + 0.6 * Math.sin(normEscape * Math.PI);
    return Math.max(0, Math.min(255, energy * modulator));
  }

  // Sierpinski Gating: Membership test (bitwise row & col)
  sierpinskiGate(row: number, col: number, energy: number): number {
    const isMember = (row & col) === 0;
    const attenuation = isMember ? 1.0 : 0.631; // 1/log2(3)
    return Math.floor(energy * attenuation);
  }
}
