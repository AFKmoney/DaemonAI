export class ExplanationEngine {
    explain(targetNode, hypergraph) {
        const nodes = hypergraph.nodes;
        const synapses = hypergraph.synapses;
        // Trace back the strongest synapse by querying the hypergraph for weights
        const incoming = synapses
            .filter((s) => s.target === targetNode)
            .map((s) => ({
            source: s.source,
            weight: hypergraph.getSynapseWeight(s.source, s.target)
        }))
            .sort((a, b) => b.weight - a.weight);
        if (incoming.length > 0) {
            const source = incoming[0].source;
            const sourceNode = nodes.get(source);
            return `Target concept "${targetNode}" was activated via "${source}" (weight: ${incoming[0].weight.toFixed(0)}) within the ${sourceNode?.domain || 'unknown'} manifold.`;
        }
        return `Concept "${targetNode}" emerged from direct sensory ignition or residual manifold energy.`;
    }
}
