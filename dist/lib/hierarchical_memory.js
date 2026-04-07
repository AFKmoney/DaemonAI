import { ZMSFACore } from './zmsfa.js';
export var MemoryLevel;
(function (MemoryLevel) {
    MemoryLevel[MemoryLevel["SENSORY"] = 0] = "SENSORY";
    MemoryLevel[MemoryLevel["WORKING"] = 1] = "WORKING";
    MemoryLevel[MemoryLevel["EPISODIC"] = 2] = "EPISODIC";
    MemoryLevel[MemoryLevel["PROCEDURAL"] = 3] = "PROCEDURAL";
    MemoryLevel[MemoryLevel["SEMANTIC"] = 4] = "SEMANTIC";
    MemoryLevel[MemoryLevel["ARCHIVAL"] = 5] = "ARCHIVAL";
})(MemoryLevel || (MemoryLevel = {}));
export class HierarchicalMemory {
    stores = new Map();
    capacities = {
        [MemoryLevel.SENSORY]: 32,
        [MemoryLevel.WORKING]: 9,
        [MemoryLevel.EPISODIC]: 256,
        [MemoryLevel.PROCEDURAL]: 512,
        [MemoryLevel.SEMANTIC]: 2048,
        [MemoryLevel.ARCHIVAL]: 5000
    };
    thresholds = [0.1, 0.3, 0.5, 0.7, 0.85, 0.95]; // Reduced for NFR Level 3
    decayRates = [0.5, 0.85, 0.95, 0.99, 1.0, 1.0];
    tickCount = 0;
    constructor() {
        Object.values(MemoryLevel).forEach(l => {
            if (typeof l === 'number')
                this.stores.set(l, []);
        });
    }
    ingest(hash, content, energy) {
        const importance = 0.4 * (energy / 255) + 0.1;
        const seed = Number(hash % BigInt(1e7)) + this.tickCount;
        const item = {
            id: ZMSFACore.formalRandom(seed).toString(36).substring(7),
            hash,
            initialHash: hash,
            content,
            importance,
            repetitions: 1,
            lastAccess: this.tickCount,
            level: MemoryLevel.SENSORY
        };
        this.addToLevel(MemoryLevel.SENSORY, item);
    }
    addToLevel(level, item) {
        const store = this.stores.get(level);
        if (store.length >= this.capacities[level]) {
            store.sort((a, b) => a.importance - b.importance);
            store.shift();
        }
        item.level = level;
        store.push(item);
    }
    tick() {
        this.tickCount++;
        for (const [level, store] of this.stores.entries()) {
            const decay = this.decayRates[level];
            for (let i = store.length - 1; i >= 0; i--) {
                const item = store[i];
                // Archival items don't decay and are retrieved faster
                if (level === MemoryLevel.ARCHIVAL)
                    continue;
                const recency = 1.0 - (this.tickCount - item.lastAccess) / 1000;
                item.importance *= (0.7 + 0.3 * Math.max(0, recency)) * decay;
                // Consolidation
                if (level < MemoryLevel.ARCHIVAL &&
                    item.importance >= this.thresholds[level] &&
                    item.repetitions >= (level + 1)) {
                    store.splice(i, 1);
                    this.addToLevel(level + 1, item);
                    continue;
                }
                if (item.importance < 0.01 && level < MemoryLevel.SEMANTIC) {
                    store.splice(i, 1);
                }
            }
        }
    }
    // Drift Tracking (Priority 4, item 17)
    getDrift(id) {
        for (const store of this.stores.values()) {
            const item = store.find(i => i.id === id);
            if (item) {
                let distance = 0;
                const xor = item.hash ^ item.initialHash;
                for (let i = 0n; i < 64n; i++)
                    if ((xor >> i) & 1n)
                        distance++;
                return distance;
            }
        }
        return 0;
    }
    retrieve(queryHash) {
        let bestMatch = null;
        let minDistance = 65;
        // Search ARCHIVAL first (Priority 4, item 16)
        const archival = this.stores.get(MemoryLevel.ARCHIVAL);
        for (const item of archival) {
            const d = this.hamming(queryHash, item.hash);
            if (d < minDistance) {
                minDistance = d;
                bestMatch = item;
            }
        }
        if (minDistance > 10) {
            for (const [level, store] of this.stores.entries()) {
                if (level === MemoryLevel.ARCHIVAL)
                    continue;
                for (const item of store) {
                    const distance = this.hamming(queryHash, item.hash);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestMatch = item;
                    }
                }
            }
        }
        if (bestMatch && minDistance < 10) {
            bestMatch.repetitions++;
            bestMatch.lastAccess = this.tickCount;
            // Drift the hash slightly towards query
            bestMatch.hash = (bestMatch.hash & queryHash) | (bestMatch.hash ^ queryHash) >> 1n;
            return bestMatch;
        }
        return null;
    }
    hamming(a, b) {
        let distance = 0;
        const xor = a ^ b;
        for (let i = 0n; i < 64n; i++)
            if ((xor >> i) & 1n)
                distance++;
        return distance;
    }
    getStats() {
        const counts = {};
        this.stores.forEach((v, k) => counts[MemoryLevel[k]] = v.length);
        return counts;
    }
}
