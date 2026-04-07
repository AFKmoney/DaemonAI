import { ZMSFACore } from './zmsfa.js';
export class ToolSystem {
    tools = [
        {
            id: 'WEB_INGEST',
            name: 'Web Cortex Ingest',
            description: 'Synchronizes external Wikipedia/ArXiv knowledge into the fractal manifold.',
            category: 'DATA',
            utility: 0.5
        },
        {
            id: 'DEEP_RESONANCE',
            name: 'Deep Thought Resonance',
            description: 'Forces 50+ propagation cycles to stabilize emergent semantic paths.',
            category: 'COGNITIVE',
            utility: 0.3
        },
        {
            id: 'TERNARY_SHIFT',
            name: 'BitNet Quantization',
            description: 'Toggles between Continuous and 1.58-bit Ternary activation for energy efficiency.',
            category: 'HARDWARE',
            utility: 0.8
        },
        {
            id: 'GEMATRIA_BRIDGE',
            name: 'Gematria Discovery',
            description: 'Scans the lexicon for numerical equivalences to build long-range synaptic bridges.',
            category: 'COGNITIVE',
            utility: 0.4
        },
        {
            id: 'ENTROPY_FLUSH',
            name: 'Entropy Refresher',
            description: 'Injects formal ZMSFA noise into low-energy nodes to prevent manifold stagnation.',
            category: 'DATA',
            utility: 0.2
        }
    ];
    userFavorites = new Set(['WEB_INGEST', 'TERNARY_SHIFT']);
    iaFavorites = new Set();
    updateIAFavorites(curiosity, uncertainty) {
        // IA chooses favorites based on its own metrics
        this.iaFavorites.clear();
        if (curiosity > 0.7)
            this.iaFavorites.add('WEB_INGEST');
        if (uncertainty > 0.6)
            this.iaFavorites.add('DEEP_RESONANCE');
        if (this.iaFavorites.size === 0)
            this.iaFavorites.add('GEMATRIA_BRIDGE');
    }
    getBestTool(state) {
        // Formal Decision logic for tool selection
        if (state.surprise > 200)
            return this.tools.find(t => t.id === 'DEEP_RESONANCE');
        if (state.uncertainty > 0.8)
            return this.tools.find(t => t.id === 'WEB_INGEST');
        if (state.fatigue > 0.5)
            return this.tools.find(t => t.id === 'TERNARY_SHIFT');
        const seed = Math.floor((state.uncertainty + state.fatigue) * 1000 + (state.surprise || 0));
        const index = Math.floor(ZMSFACore.formalRandom(seed) * this.tools.length);
        return this.tools[index];
    }
}
