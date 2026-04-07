export class EligibilityTrace {
    traces = new Map();
    gamma = 0.95;
    lambda = 0.85;
    update(id, activation) {
        const current = this.traces.get(id) || 0;
        // e(t) = γλ·e(t-1) + A(t)
        this.traces.set(id, current * this.gamma * this.lambda + activation);
    }
    getTrace(id) {
        return this.traces.get(id) || 0;
    }
    tick() {
        this.traces.forEach((v, k) => {
            this.traces.set(k, v * this.gamma * this.lambda);
        });
    }
    getPeak() {
        let max = 0;
        this.traces.forEach(v => { if (v > max)
            max = v; });
        return max;
    }
}
