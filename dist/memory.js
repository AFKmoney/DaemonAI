import { SimHash } from './math.js';
import { NanoSIREN } from './lib/nano_siren.js';
import { ZMSFACore } from './lib/zmsfa.js';
export var ManifoldLayer;
(function (ManifoldLayer) {
    ManifoldLayer["SENSORY"] = "SENSORY";
    ManifoldLayer["COGNITIVE"] = "COGNITIVE";
    ManifoldLayer["ABSTRACT"] = "ABSTRACT";
    ManifoldLayer["RESONANT"] = "RESONANT";
})(ManifoldLayer || (ManifoldLayer = {}));
export class LSHInvariantStore {
    store = new Map();
    storeConcept(hash, data) {
        this.store.set(hash, data);
    }
    findNearest(queryHash, threshold = 30) {
        let bestMatch = null;
        let minDistance = 65;
        for (const [hash, data] of this.store.entries()) {
            const distance = SimHash.hammingDistance(queryHash, hash);
            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = { hash, data, distance };
            }
        }
        return minDistance <= threshold ? bestMatch : null;
    }
}
/**
 * Superposed Fractal Manifold Architecture with Temporal Resonance
 */
export class DynamicHypergraph {
    nodes = new Map();
    synapses = [];
    ternaryMode = false;
    tickCount = 0;
    // Intra-layer weight mapping (one SIREN per layer)
    layerSIRENs = new Map();
    // Inter-layer bridge mapping (one SIREN per layer pair)
    bridgeSIRENs = new Map();
    constructor() {
        Object.values(ManifoldLayer).forEach(l => {
            this.layerSIRENs.set(l, new NanoSIREN());
        });
    }
    getBridgeKey(l1, l2) {
        return [l1, l2].sort().join('<->');
    }
    getBridgeSIREN(l1, l2) {
        const key = this.getBridgeKey(l1, l2);
        if (!this.bridgeSIRENs.has(key)) {
            this.bridgeSIRENs.set(key, new NanoSIREN());
        }
        return this.bridgeSIRENs.get(key);
    }
    addNode(id, label, hash, layer = ManifoldLayer.COGNITIVE) {
        const nodeId = `${layer}:${id}`;
        if (!this.nodes.has(nodeId)) {
            const seed = Number(hash % BigInt(1e9)) + layer.length;
            this.nodes.set(nodeId, {
                id: nodeId,
                conceptHash: hash,
                label,
                energy: 0,
                surprise: 0,
                permanence: 128,
                domain: 'LANGUAGE',
                layer,
                x: ZMSFACore.formalRandom(seed) * 2 - 1,
                y: ZMSFACore.formalRandom(seed + 1) * 2 - 1,
                temporalSignature: ZMSFACore.formalRandom(seed + 8) * 0.1, // Fixed temporal freq
                superposition: {
                    sierpinski: { level: 0, index: [] },
                    spiral: { theta: ZMSFACore.formalRandom(seed + 2) * Math.PI * 2, radius: ZMSFACore.formalRandom(seed + 3) },
                    sphere: { phi: ZMSFACore.formalRandom(seed + 4) * Math.PI, theta: ZMSFACore.formalRandom(seed + 5) * Math.PI * 2 },
                    mandelbrot: { c: [ZMSFACore.formalRandom(seed + 6) * 2 - 1, ZMSFACore.formalRandom(seed + 7) * 2 - 1], escapeTime: 0 },
                    nfr: { level: 0, decayFactor: 0.7 }
                }
            });
        }
    }
    // Helper to get time-evolved coordinates
    getDynamicCoords(node) {
        const time = this.tickCount * node.temporalSignature;
        // Torus-based temporal oscillation
        const dx = node.x + 0.05 * Math.sin(time);
        const dy = node.y + 0.05 * Math.cos(time);
        return { dx, dy };
    }
    addSynapse(source, target, type = 'FORWARD', initialWeight = 128) {
        const existing = this.synapses.find(s => s.source === source && s.target === target && s.type === type);
        if (existing) {
            existing.permanence = Math.min(255, existing.permanence + 10);
            return;
        }
        const sNode = this.nodes.get(source);
        const tNode = this.nodes.get(target);
        if (sNode && tNode) {
            const targetWeightNorm = (initialWeight / 127.5) - 1;
            const { dx: sx, dy: sy } = this.getDynamicCoords(sNode);
            const { dx: tx, dy: ty } = this.getDynamicCoords(tNode);
            if (sNode.layer === tNode.layer) {
                this.layerSIRENs.get(sNode.layer).train(sx, ty, targetWeightNorm, 0.1);
            }
            else {
                this.getBridgeSIREN(sNode.layer, tNode.layer).train(sx, ty, targetWeightNorm, 0.1);
            }
        }
        this.synapses.push({ source, target, type, permanence: 128 });
    }
    getSynapseWeight(sourceId, targetId) {
        const sNode = this.nodes.get(sourceId);
        const tNode = this.nodes.get(targetId);
        if (!sNode || !tNode)
            return 0;
        const { dx: sx, dy: sy } = this.getDynamicCoords(sNode);
        const { dx: tx, dy: ty } = this.getDynamicCoords(tNode);
        let val = 0;
        if (sNode.layer === tNode.layer) {
            val = this.layerSIRENs.get(sNode.layer).forward(sx, ty);
        }
        else {
            val = this.getBridgeSIREN(sNode.layer, tNode.layer).forward(sx, ty);
        }
        return Math.floor((val + 1) * 127.5);
    }
    ternaryContribution(weight, sourceEnergy) {
        if (!this.ternaryMode) {
            return (weight / 255) * sourceEnergy;
        }
        const centered = weight - 128;
        let t = 0;
        if (centered > 42)
            t = 1;
        else if (centered < -42)
            t = -1;
        if (t === 1)
            return sourceEnergy;
        if (t === -1)
            return -sourceEnergy;
        return 0;
    }
    propagate() {
        const newEnergies = new Map();
        for (const node of this.nodes.values()) {
            newEnergies.set(node.id, node.energy * 0.85);
        }
        // 1. Fractal Superposition with Temporal Modulation
        for (const synapse of this.synapses) {
            const sourceNode = this.nodes.get(synapse.source);
            if (sourceNode && sourceNode.energy > 40) {
                const weight = this.getSynapseWeight(synapse.source, synapse.target);
                // Temporal Fractal Modulation Factor (Integrating time into the 2x3 triad)
                const timeFactor = 1.0 + 0.2 * Math.sin(this.tickCount * sourceNode.temporalSignature);
                const fractalFactor = 1.0 + (sourceNode.superposition.mandelbrot.escapeTime / 255);
                const contribution = this.ternaryContribution(weight, sourceNode.energy) * fractalFactor * timeFactor;
                const current = newEnergies.get(synapse.target) || 0;
                const persistence = (synapse.permanence / 255);
                newEnergies.set(synapse.target, Math.max(0, Math.min(255, current + contribution * persistence)));
            }
        }
        // 2. Inter-Layer Resonance (Temporal Superposition)
        this.nodes.forEach(node => {
            const { dx, dy } = this.getDynamicCoords(node);
            this.nodes.forEach(other => {
                if (node.id !== other.id && node.layer !== other.layer) {
                    const { dx: ox, dy: oy } = this.getDynamicCoords(other);
                    const dist = Math.sqrt(Math.pow(dx - ox, 2) + Math.pow(dy - oy, 2));
                    if (dist < 0.2) {
                        const bridgeSIREN = this.getBridgeSIREN(node.layer, other.layer);
                        const bridgeVal = bridgeSIREN.forward(dx, oy);
                        // Time-coupled Resonance bleed
                        const temporalSync = Math.cos(this.tickCount * (node.temporalSignature - other.temporalSignature));
                        const bleed = node.energy * 0.1 * (bridgeVal + 1) * (0.5 * temporalSync + 0.5);
                        newEnergies.set(other.id, (newEnergies.get(other.id) || 0) + bleed);
                    }
                }
            });
        });
        // 3. Hebbian LTP/LTD with Dynamic Coordinates
        for (const synapse of this.synapses) {
            const s = this.nodes.get(synapse.source);
            const t = this.nodes.get(synapse.target);
            if (s && t && s.energy > 100 && t.energy > 100) {
                const currentWeight = this.getSynapseWeight(s.id, t.id);
                const targetWeightNorm = (Math.min(255, currentWeight + 20) / 127.5) - 1;
                const { dx: sx, dy: sy } = this.getDynamicCoords(s);
                const { dx: tx, dy: ty } = this.getDynamicCoords(t);
                if (s.layer === t.layer) {
                    this.layerSIRENs.get(s.layer).train(sx, ty, targetWeightNorm, 0.05);
                }
                else {
                    this.getBridgeSIREN(s.layer, t.layer).train(sx, ty, targetWeightNorm, 0.05);
                }
                synapse.permanence = Math.min(255, synapse.permanence + 5);
            }
        }
        for (const [id, energy] of newEnergies.entries()) {
            const node = this.nodes.get(id);
            if (node)
                node.energy = Math.min(255, energy);
        }
        if (this.tickCount % 100 === 0) {
            this.synapses = this.synapses.filter(s => s.permanence > 10);
        }
    }
    tick() {
        this.tickCount++;
        this.propagate();
    }
}
