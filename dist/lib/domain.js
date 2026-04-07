export var Domain;
(function (Domain) {
    Domain["LANGUAGE"] = "LANGUAGE";
    Domain["MATHEMATICS"] = "MATHEMATICS";
    Domain["SPATIAL"] = "SPATIAL";
    Domain["TEMPORAL"] = "TEMPORAL";
    Domain["LOGIC"] = "LOGIC";
    Domain["CREATIVE"] = "CREATIVE";
})(Domain || (Domain = {}));
export class DomainRouter {
    tables = {
        [Domain.MATHEMATICS]: ['number', 'calculate', 'sum', 'multiply', 'prime', 'function', 'integral', 'matrix'],
        [Domain.SPATIAL]: ['above', 'left', 'position', 'north', 'coordinates', 'volume', 'dimension', 'geometry'],
        [Domain.TEMPORAL]: ['before', 'after', 'time', 'when', 'future', 'past', 'duration', 'chronology'],
        [Domain.LOGIC]: ['if', 'then', 'because', 'true', 'false', 'inference', 'deduction', 'contradiction'],
        [Domain.LANGUAGE]: ['word', 'syntax', 'grammar', 'semantic', 'lexicon', 'pronoun', 'verb', 'metaphor'],
        [Domain.CREATIVE]: ['imagine', 'dream', 'art', 'fractal', 'novelty', 'inspiration', 'aesthetic', 'vibe']
    };
    route(tokens) {
        const votes = {};
        Object.values(Domain).forEach(d => votes[d] = 0);
        tokens.forEach(token => {
            const lower = token.toLowerCase();
            for (const [domain, keywords] of Object.entries(this.tables)) {
                if (keywords.includes(lower)) {
                    votes[domain]++;
                }
            }
        });
        let winner = Domain.LANGUAGE;
        let maxVotes = -1;
        for (const [domain, count] of Object.entries(votes)) {
            if (count > maxVotes) {
                maxVotes = count;
                winner = domain;
            }
        }
        const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0) || 1;
        return { domain: winner, confidence: maxVotes / totalVotes };
    }
}
