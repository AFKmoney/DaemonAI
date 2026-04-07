import { ZMSFACore } from './lib/zmsfa.js';
export class GlobalWorkspace {
    events = [];
    currentFocus = null;
    tickCount = 0;
    lastTypeBroadcast = new Map();
    broadcast(event) {
        this.events.push({ ...event, timestamp: this.tickCount });
    }
    tick() {
        this.tickCount++;
        if (this.events.length === 0)
            return;
        // Evaluate salience and apply hysteresis
        const validEvents = this.events.filter(e => {
            const last = this.lastTypeBroadcast.get(e.type);
            return !last || (this.tickCount - last > 3);
        });
        if (validEvents.length > 0) {
            validEvents.sort((a, b) => b.salience - a.salience);
            const topEvent = validEvents[0];
            if (!this.currentFocus || topEvent.salience > this.currentFocus.salience * 0.8) {
                this.currentFocus = topEvent;
                this.lastTypeBroadcast.set(topEvent.type, this.tickCount);
            }
        }
        this.events = []; // Clear buffer
    }
    getCoherenceScore() {
        // Formal coherence based on spectral validation of current focus
        if (!this.currentFocus)
            return 1.0;
        const mValue = this.currentFocus.content.length * (this.currentFocus.salience + 1);
        const validity = ZMSFACore.spectralValidation(Math.floor(mValue), 3, 2);
        return validity === 'VALID' ? 1.0 : validity === 'PARTIAL' ? 0.7 : 0.3;
    }
}
export class WorkingMemoryBuffer {
    items = [];
    tickCount = 0;
    push(type, content, confidence = 0.5) {
        if (this.items.length >= 9) {
            // Evict least confident/oldest
            this.items.sort((a, b) => a.confidence - b.confidence);
            this.items.shift();
        }
        const seed = this.tickCount + content.length;
        const id = ZMSFACore.formalRandom(seed).toString(36).substring(7);
        this.items.push({ id, type, content, confidence, lastAccess: this.tickCount });
    }
    tick() {
        this.tickCount++;
        // Apply decay
        this.items.forEach(item => {
            if (item.type === 'HYPOTHESIS')
                item.confidence *= 0.95;
            if (item.type === 'GOAL')
                item.confidence *= 0.99;
        });
        this.items = this.items.filter(i => i.confidence > 0.1);
    }
}
export class ExplanationEngine {
    explain(query, state) {
        return `[CAUSAL TRACE] Query: ${query} -> Due to active GOAL node, propagated energy via Hebbian synapse.`;
    }
}
export class TheoryOfMind {
    userLevel = 'INTERMEDIATE';
    updateFromInput(text) {
        if (text.includes('debug') || text.includes('architecture'))
            this.userLevel = 'EXPERT';
        if (text.includes('help') || text.includes('what is'))
            this.userLevel = 'NOVICE';
    }
}
