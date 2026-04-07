export var RoutingTarget;
(function (RoutingTarget) {
    RoutingTarget["SYSTEM_1"] = "Fast/Intuitive";
    RoutingTarget["SYSTEM_2"] = "Slow/Deliberate";
})(RoutingTarget || (RoutingTarget = {}));
export class MOERouter {
    threshold = 2.0; // bits
    route(confidences) {
        // 1. Compute Shannon Entropy: H = -Σ p_i · log₂(p_i)
        const sum = confidences.reduce((a, b) => a + b, 0) || 1;
        const probs = confidences.map(c => c / sum);
        let entropy = 0;
        probs.forEach(p => {
            if (p > 0)
                entropy -= p * Math.log2(p);
        });
        // 2. Routing Decision
        const target = entropy >= this.threshold ? RoutingTarget.SYSTEM_2 : RoutingTarget.SYSTEM_1;
        return { target, entropy };
    }
    // Domain-aware threshold adjustment
    adjustThreshold(domain) {
        if (domain === 'MATHEMATICS' || domain === 'LOGIC') {
            this.threshold = 1.4; // Easier to trigger System 2
        }
        else {
            this.threshold = 2.0;
        }
    }
}
