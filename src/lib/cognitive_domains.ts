export enum CognitiveDomain {
  TERNARY = 'TERNARY',
  FRACTAL_AI = 'FRACTAL_AI',
  AGI = 'AGI',
  MCTS = 'MCTS',
  SELF_IMPROVE = 'SELF_IMPROVE',
  NEUROSYM = 'NEUROSYM',
  EMERGENCE = 'EMERGENCE',
  CAUSAL = 'CAUSAL',
  META_LEARN = 'META_LEARN',
  RECURSIVE = 'RECURSIVE'
}

export const DOMAIN_QUERIES: Record<CognitiveDomain, string[]> = {
  TERNARY: [
    'ternary neural network inference efficiency',
    'BitNet 1.58 bit quantization LLM',
    'ternary weight quantization transformers',
    'L-Mul linear multiplication approximation AI',
  ],
  FRACTAL_AI: [
    'fractal neural network architecture computational',
    'fractal trainability boundary neural network',
    'Hausdorff dimension deep neural network geometry',
    'fractal generative model recursive neural',
  ],
  AGI: [
    'artificial general intelligence emergent architecture',
    'AGI thermodynamic coupling fluid inference',
    'general intelligence representationalist functionalist',
    'recursive self-improvement AGI convergence',
  ],
  MCTS: [
    'Monte Carlo Tree Search language model reasoning',
    'MCT Self-Refine MCTS LLM planning',
    'reflective Monte Carlo Tree Search agent',
    'MCTS cost-augmented planning LLM',
  ],
  SELF_IMPROVE: [
    'recursive self-improvement language model',
    'LADDER recursive problem decomposition LLM',
    'self-improving AI evolutionary synthesis',
    'limits recursive self-training model collapse',
  ],
  NEUROSYM: [
    'neurosymbolic integration AI grounding',
    'symbolic AI neural hybrid architecture',
    'neurosymbolic entropy decay prevention',
    'causal reasoning symbolic neural integration',
  ],
  EMERGENCE: [
    'emergence quantification neural network training',
    'emergent computation neural manifold',
    'random neural network emergent structure',
    'emergence complexity neural connectivity',
  ],
  CAUSAL: [
    'causal inference machine learning neural',
    'causal emergence thermodynamics information',
    'causal graph neural network discovery',
  ],
  META_LEARN: [
    'meta-learning few-shot adaptation neural',
    'learning to learn optimization neural network',
    'meta-learning AGI generalization',
  ],
  RECURSIVE: [
    'recursive neural architecture self-similar',
    'recursive introspection error correction LLM',
    'recursive self-aggregation deep thinking',
  ],
};
