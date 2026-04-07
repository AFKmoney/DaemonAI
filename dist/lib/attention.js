import { ZMSFACore } from './zmsfa.js';
export class AttentionSystem {
    threads = [];
    fatigue = 0;
    zoom = 1.0;
    lastHashes = [];
    tick(currentHash, complexity) {
        // 1. Novelty calculation
        const isNovel = !this.lastHashes.includes(currentHash);
        const novelty = isNovel ? 0.8 : 0.1;
        this.lastHashes.push(currentHash);
        if (this.lastHashes.length > 50)
            this.lastHashes.shift();
        // 2. Salience = 0.4·novelty + 0.4·relevance + 0.2·intensity
        const salience = 0.4 * novelty + 0.4 * (1.0 - this.fatigue) + 0.2 * complexity;
        // 3. Fatigue & Sustained Attention
        if (salience > 0.6) {
            this.fatigue = Math.min(0.8, this.fatigue + 0.002);
        }
        else {
            this.fatigue = Math.max(0, this.fatigue - 0.01);
        }
        // 4. Fractal Zoom
        if (complexity > 0.8)
            this.zoom = Math.max(0.1, this.zoom - 0.05); // Zoom IN
        else if (complexity < 0.3)
            this.zoom = Math.min(2.0, this.zoom + 0.05); // Zoom OUT
        // 5. Thread management (max 4)
        if (salience > 0.5 && this.threads.length < 4) {
            const seed = Number(currentHash % BigInt(1e7)) + this.threads.length;
            this.threads.push({
                id: ZMSFACore.formalRandom(seed).toString(36).substring(7),
                energy: salience,
                relevance: 1.0,
                focus: currentHash
            });
        }
        this.threads.forEach(t => {
            t.energy *= 0.95; // Decay
        });
        this.threads = this.threads.filter(t => t.energy > 0.1);
    }
    getFocusStrength() {
        return (1.0 - this.fatigue) * (this.threads.length > 0 ? 1.0 : 0.5);
    }
}
