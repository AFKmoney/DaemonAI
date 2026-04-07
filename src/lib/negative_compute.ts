export enum ConstraintType {
  GRAMMAR = 'GRAMMAR',
  SEMANTIC = 'SEMANTIC',
  LOGICAL = 'LOGICAL',
  TEMPORAL = 'TEMPORAL'
}

export class NegativeCompute {
  eliminate(predictions: { content: string, confidence: number }[]): { viable: any[], eliminatedCount: number } {
    let eliminatedCount = 0;
    const viable = predictions.filter(p => {
      const text = p.content.toLowerCase();

      // 1. GRAMMAR: No double determiners/prepositions/conjunctions
      if (/\b(the the|in in|a a|to to|of of|and and|is is|it it|for for|on on|at at|by by|with with)\b/i.test(text)) {
        eliminatedCount++;
        return false;
      }

      // 2. TEMPORAL: Tense clash detection
      const pastWords = ['did', 'was', 'went', 'had', 'been', 'yesterday', 'ago', 'previously'];
      const futureWords = ['will', 'shall', 'tomorrow', 'next', 'soon', 'upcoming', 'future'];
      const hasPast = pastWords.some(w => text.includes(w));
      const hasFuture = futureWords.some(w => text.includes(w));
      if (hasPast && hasFuture && text.length < 60) {
        eliminatedCount++;
        return false;
      }

      // 3. SEMANTIC: Antonym pair contradictions (expanded)
      const antonymPairs = [
        ['true', 'false'], ['yes', 'no'], ['always', 'never'],
        ['all', 'none'], ['good', 'bad'], ['up', 'down'],
        ['left', 'right'], ['hot', 'cold'], ['fast', 'slow'],
        ['big', 'small'], ['light', 'dark'], ['inside', 'outside'],
        ['empty', 'full'], ['start', 'end'], ['birth', 'death'],
        ['win', 'lose'], ['love', 'hate'], ['friend', 'enemy'],
        ['peace', 'war'], ['clean', 'dirty']
      ];
      for (const [a, b] of antonymPairs) {
        if (text.includes(a) && text.includes(b) && text.length < 40) {
          eliminatedCount++;
          return false;
        }
      }

      // 4. LOGICAL: Self-identity paradox
      if (/\b(\w+) is not \1\b/i.test(text)) {
        eliminatedCount++;
        return false;
      }

      // 5. SEMANTIC: Repetition/Stutter
      const words = text.split(' ');
      for (let i = 0; i < words.length - 2; i++) {
        if (words[i] === words[i+1] && words[i] === words[i+2]) {
          eliminatedCount++;
          return false;
        }
      }

      // 6. LOGICAL: Excluded Middle (X is both Y and not Y)
      if (/\b(\w+) is (\w+) and \1 is not \2\b/i.test(text)) {
        eliminatedCount++;
        return false;
      }

      // 7. GRAMMAR: Subject-Verb agreement (basic)
      if (/\b(i is|you is|he are|she are|we is|they is)\b/i.test(text)) {
        eliminatedCount++;
        return false;
      }

      // 8. LOGICAL: Circularity (X because X)
      if (/\b(\w+) because \1\b/i.test(text)) {
        eliminatedCount++;
        return false;
      }

      return true;
    });

    return { viable, eliminatedCount };
  }
}
