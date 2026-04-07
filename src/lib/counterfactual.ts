export interface CausalLink {
  source: bigint;
  target: bigint;
  strength: number;
  observations: number;
}

export class CounterfactualEngine {
  private causalGraph: Map<string, CausalLink> = new Map();
  private activationWindow: { hash: bigint, tick: number }[] = [];

  record(hash: bigint, tick: number) {
    this.activationWindow.push({ hash, tick });
    if (this.activationWindow.length > 20) this.activationWindow.shift();

    // Causal detection: If A fires 1-5 ticks before B
    this.activationWindow.forEach(prev => {
      if (tick - prev.tick >= 1 && tick - prev.tick <= 5 && prev.hash !== hash) {
        const key = `${prev.hash}->${hash}`;
        const existing = this.causalGraph.get(key) || { source: prev.hash, target: hash, strength: 0, observations: 0 };
        existing.observations++;
        existing.strength = Math.min(1.0, existing.observations / 20);
        this.causalGraph.set(key, existing);
      }
    });
  }

  generateWhatIf(targetHash: bigint): { divergence: number, affectedConcepts: bigint[] } {
    const affected: bigint[] = [];
    let divergence = 0;

    this.causalGraph.forEach(link => {
      if (link.source === targetHash) {
        affected.push(link.target);
        divergence += link.strength;
      }
    });

    return { divergence: Math.min(1.0, divergence), affectedConcepts: affected };
  }

  getLinkCount() { return this.causalGraph.size; }
}
