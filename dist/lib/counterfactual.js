export class CounterfactualEngine {
    causalGraph = new Map();
    activationWindow = [];
    record(hash, tick) {
        this.activationWindow.push({ hash, tick });
        if (this.activationWindow.length > 20)
            this.activationWindow.shift();
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
    generateWhatIf(targetHash) {
        const affected = [];
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
