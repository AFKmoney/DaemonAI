import { SimHash, GematriaCalculator } from './math.js';
import { DynamicHypergraph, Node, ManifoldLayer } from './memory.js';
import { GlobalWorkspace } from './cognitive.js';
import { LearningDirector } from './learning.js';
import { ZMSFACore } from './lib/zmsfa.js';
import http from 'http';

// Lib imports
import { OPE, WaveType } from './lib/ope.js';
import { NFR } from './lib/nfr.js';
import { HierarchicalMemory } from './lib/hierarchical_memory.js';
import { Metacognition } from './lib/metacognition.js';
import { AttentionSystem } from './lib/attention.js';
import { IntrinsicMotivation } from './lib/motivation.js';
import { MOERouter } from './lib/moe.js';
import { NegativeCompute } from './lib/negative_compute.js';
import { CounterfactualEngine } from './lib/counterfactual.js';
import { EligibilityTrace } from './lib/eligibility.js';
import { BrainWaves } from './lib/brain_waves.js';
import { DomainRouter } from './lib/domain.js';
import { MCTSPlanning, Action } from './lib/mcts.js';
import { KnowledgeCore } from './lib/knowledge_core.js';
import { ExplanationEngine } from './lib/explanation_engine.js';
import { ToolSystem, Tool } from './lib/tool_system.js';

export class HardenedEngine {
  // Modules
  public ope = new OPE();
  public nfr = new NFR();
  public memory = new HierarchicalMemory();
  public metacog = new Metacognition();
  public attention = new AttentionSystem();
  public motivation = new IntrinsicMotivation();
  public moe = new MOERouter();
  public negative = new NegativeCompute();
  public counterfactual = new CounterfactualEngine();
  public eligibility = new EligibilityTrace();
  public brainWaves = new BrainWaves();
  public domain = new DomainRouter();
  public mcts = new MCTSPlanning();
  public knowledge = new KnowledgeCore();
  public explainer = new ExplanationEngine();
  public learningDirector = new LearningDirector();
  public toolSystem = new ToolSystem();
  
  public gwtBus = new GlobalWorkspace();
  public hypergraph = new DynamicHypergraph();

  // State
  public surprise: number = 0;
  public tickCount: number = 0;
  public messageHistory: { role: 'USER' | 'DAEMON', content: string }[] = [];
  public currentTool: Tool | null = null;
  
  private telemetryServer?: http.Server;

  constructor() {
    this.initializeGraph();
    this.internalizeUniversalTruths(); 
    this.startTelemetry();
  }

  private startTelemetry() {
    this.telemetryServer = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      if (req.url === '/state') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(this.exportBrain());
      } else {
        res.writeHead(404);
        res.end();
      }
    });
    this.telemetryServer.listen(4242, '127.0.0.1');
  }

  private initializeGraph() {
    const rootHash = SimHash.generate(['ROOT']);
    this.hypergraph.addNode('ROOT', 'AGI Core', rootHash, ManifoldLayer.ABSTRACT);
  }

  private internalizeUniversalTruths() {
    const units = this.knowledge.getAllUnits();
    units.forEach(unit => {
      const text = `${unit.title} ${unit.summary} ${unit.impact}`.toLowerCase();
      const words = text.match(/\b\w+\b/g) || [];
      for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i];
        const w2 = words[i+1];
        
        // Populate all four superposed fractal layers
        [ManifoldLayer.COGNITIVE, ManifoldLayer.ABSTRACT, ManifoldLayer.RESONANT].forEach(layer => {
          this.hypergraph.addNode(w1, w1, SimHash.generate([w1]), layer);
          this.hypergraph.addNode(w2, w2, SimHash.generate([w2]), layer);
          
          const s1 = `${layer}:${w1}`;
          const s2 = `${layer}:${w2}`;
          this.hypergraph.addSynapse(s1, s2, 'FORWARD', 240);
        });

        // Add SIREN-based cross-layer bridges
        this.hypergraph.addSynapse(`COGNITIVE:${w1}`, `ABSTRACT:${w1}`, 'BRIDGE', 200);
        this.hypergraph.addSynapse(`ABSTRACT:${w1}`, `RESONANT:${w1}`, 'BRIDGE', 200);
      }
    });
    this.ope.ternaryMode = true;
    this.hypergraph.ternaryMode = true;
  }

  public chat(input: string): string {
    this.messageHistory.push({ role: 'USER', content: input });

    // ZMSFA COMMANDS HANDLING
    if (input.startsWith('WHISPER') || input.startsWith('DELEGATE') || input.startsWith('PROCESS ALL')) {
      const mValue = GematriaCalculator.computeOrdinal(input);
      const zmsfaResult = ZMSFACore.processKnowledge(input, mValue);
      const response = JSON.stringify(zmsfaResult, null, 2);
      this.messageHistory.push({ role: 'DAEMON', content: response });
      return response;
    }

    const inputTokens = input.toLowerCase().match(/\b\w+\b/g) || [];
    
    // 1. INJECTION (Into SENSORY and COGNITIVE Layers)
    inputTokens.forEach(t => {
      this.hypergraph.addNode(t, t, SimHash.generate([t]), ManifoldLayer.SENSORY);
      this.hypergraph.addNode(t, t, SimHash.generate([t]), ManifoldLayer.COGNITIVE);
      
      const sId = `SENSORY:${t}`;
      const cId = `COGNITIVE:${t}`;
      
      const node = this.hypergraph.nodes.get(sId);
      if (node) node.energy = 255;
      
      this.hypergraph.addSynapse(sId, cId, 'BRIDGE', 255);
    });

    // 2. TOOL SELECTION & EXECUTION
    this.currentTool = this.toolSystem.getBestTool({ 
      surprise: this.surprise, 
      uncertainty: this.metacog.uncertainty,
      fatigue: this.attention.fatigue 
    });
    this.toolSystem.updateIAFavorites(this.motivation.curiosity, this.metacog.uncertainty);

    // 3. RESONANCE
    const cycles = 25;
    for (let i = 0; i < cycles; i++) {
      this.hypergraph.tick();
      this.hypergraph.nodes.forEach(n => {
        if (n.energy > 0) n.energy = this.ope.mandelbrotAct(this.ope.fracAct(n.energy, 0.7));
      });
    }

    // 4. PATH EXPLORATION (Cross-Layer Resonance)
    let responseWords: string[] = [];
    const visited = new Set<string>();
    let seeds = Array.from(this.hypergraph.nodes.values())
      .filter(n => n.energy > 150 && !n.id.includes('ROOT'))
      .sort((a, b) => b.energy - a.energy);

    if (seeds.length === 0) return "Manifold cold. Resonance unresolved.";

    let cursor = seeds[0].id;
    responseWords.push(cursor.split(':')[1] || cursor);
    visited.add(cursor);

    for (let i = 0; i < 40; i++) {
      const transitions = this.hypergraph.synapses
        .filter(s => s.source === cursor)
        .map(s => {
          const target = this.hypergraph.nodes.get(s.target)!;
          const weight = this.hypergraph.getSynapseWeight(s.source, s.target);
          const novelty = visited.has(s.target) ? 0.02 : 1.0;
          const formalRand = ZMSFACore.formalRandom(this.tickCount + i + target.energy);
          const layerBonus = target.layer === ManifoldLayer.ABSTRACT ? 1.2 : 1.0;
          return { id: s.target, score: (weight / 255) * (target.energy / 255) * novelty * (formalRand * 0.3 + 0.85) * layerBonus };
        })
        .sort((a, b) => b.score - a.score);

      if (transitions.length > 0 && transitions[0].score > 0.005) {
        cursor = transitions[0].id;
        const parts = cursor.split(':');
        const label = parts.length > 1 ? parts[1] : parts[0];
        if (!responseWords.includes(label)) {
          responseWords.push(label);
        }
        visited.add(cursor);
      } else break;
    }

    const response = responseWords.join(' ');
    this.messageHistory.push({ role: 'DAEMON', content: response });
    return response;
  }

  tick() {
    this.tickCount++;
    this.brainWaves.update(this.surprise, this.metacog.uncertainty, this.attention.getFocusStrength());
    this.hypergraph.tick();
    this.hypergraph.nodes.forEach(n => n.energy *= 0.96);

    const energy = 127 + Math.floor(this.brainWaves.getModulation() * 127);
    this.metacog.update(energy / 255, 1, 0n);
    this.surprise = Math.abs(energy - 128) * 2;

    this.gwtBus.tick();

    return {
      surprise: this.surprise,
      brainWave: WaveType[this.brainWaves.currentWave],
      action: this.mcts.selectAction({ fatigue: this.attention.fatigue, surprise: this.surprise, curiosity: this.motivation.curiosity, uncertainty: this.metacog.uncertainty, researchGaps: 0 }),
      ternary: this.ope.ternaryMode,
      uncertainty: this.metacog.uncertainty,
      calibration: this.metacog.getCalibrationScore(),
      currentTool: this.currentTool
    };
  }

  exportBrain(): string {
    return JSON.stringify({
      nodes: Array.from(this.hypergraph.nodes.values()),
      synapses: this.hypergraph.synapses,
      tick: this.tickCount
    }, (key, value) => typeof value === 'bigint' ? value.toString() : value);
  }

  importBrain(json: string) {
    const data = JSON.parse(json);
    this.hypergraph.nodes = new Map(data.nodes.map((n: any) => [n.id, { ...n, conceptHash: BigInt(n.conceptHash) }]));
    this.hypergraph.synapses = data.synapses;
    this.tickCount = data.tick;
  }
}
