export enum RoutingTarget {
  SYSTEM_1 = 'Fast/Intuitive',
  SYSTEM_2 = 'Slow/Deliberate'
}

export class MOERouter {
  private threshold: number = 2.0; // bits

  route(confidences: number[]): { target: RoutingTarget, entropy: number } {
    // 1. Compute Shannon Entropy: H = -Σ p_i · log₂(p_i)
    const sum = confidences.reduce((a, b) => a + b, 0) || 1;
    const probs = confidences.map(c => c / sum);
    
    let entropy = 0;
    probs.forEach(p => {
      if (p > 0) entropy -= p * Math.log2(p);
    });

    // 2. Routing Decision
    const target = entropy >= this.threshold ? RoutingTarget.SYSTEM_2 : RoutingTarget.SYSTEM_1;
    
    return { target, entropy };
  }

  // Domain-aware threshold adjustment
  adjustThreshold(domain: string) {
    if (domain === 'MATHEMATICS' || domain === 'LOGIC') {
      this.threshold = 1.4; // Easier to trigger System 2
    } else {
      this.threshold = 2.0;
    }
  }
}
