export var Action;
(function (Action) {
    Action["LEARN_NEW"] = "LEARN_NEW";
    Action["REINFORCE"] = "REINFORCE";
    Action["CONSOLIDATE"] = "CONSOLIDATE";
    Action["TEST"] = "TEST";
    Action["CROSS_LINK"] = "CROSS_LINK";
    Action["REST"] = "REST";
})(Action || (Action = {}));
export class MCTSPlanning {
    root = null;
    explorationConstant = Math.SQRT2;
    selectAction(state) {
        // 1. SELECT phase (UCB1)
        // 2. EXPAND phase
        // 3. SIMULATE phase
        // 4. BACKPROPAGATE phase
        // Tactical selection based on cognitive state + Research Drive
        if (state.fatigue > 0.6)
            return Action.REST;
        // If research identifies a domain as 'hot' (high curiosity or uncertainty), prioritize learning
        if (state.researchGaps > 0 && state.curiosity > 0.5)
            return Action.LEARN_NEW;
        if (state.surprise > 200)
            return Action.REINFORCE;
        if (state.curiosity > 0.8)
            return Action.LEARN_NEW;
        if (state.uncertainty > 0.7)
            return Action.TEST;
        return Action.CONSOLIDATE;
    }
}
