import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { CognitiveDomain } from './cognitive_domains.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface KnowledgeUnit {
  title: string;
  authors: string[];
  date: string;
  summary: string;
  impact: string;
  link: string;
  domain?: CognitiveDomain;
}

export class KnowledgeCore {
  private units: KnowledgeUnit[] = [];
  public lexicon: string[] = [];

  constructor() {
    this.loadKnowledge();
  }

  private loadKnowledge() {
    try {
      const srcPath = path.resolve(__dirname, '../../src/knowledge/papers.json');
      const distPath = path.resolve(__dirname, '../knowledge/papers.json');
      
      let finalPath = distPath;
      if (!fs.existsSync(distPath) && fs.existsSync(srcPath)) {
        finalPath = srcPath;
      }
      
      const data = fs.readFileSync(finalPath, 'utf-8');
      this.units = JSON.parse(data);
      
      const allText = this.units.map(u => `${u.title} ${u.summary} ${u.impact}`).join(' ');
      this.lexicon = Array.from(new Set(allText.toLowerCase().match(/\b\w+\b/g) || []));
      
    } catch (e) {
      console.error("Failed to load neural knowledge units:", e);
    }
  }

  // Curiosity-biased selection (Priority 5, item 13)
  fetchNextKnowledge(curiosityDomain: string): KnowledgeUnit[] {
    // Filter units that match the high-curiosity domain
    const matched = this.units.filter(u => u.domain === curiosityDomain);
    return matched.length > 0 ? matched : this.units.slice(0, 2);
  }

  getUnitsByTopic(topic: string): KnowledgeUnit[] {
    const tokens = topic.toLowerCase().split(' ');
    return this.units.filter(u => {
      const text = `${u.title} ${u.summary} ${u.impact}`.toLowerCase();
      return tokens.some(t => text.includes(t));
    });
  }

  getAllUnits(): KnowledgeUnit[] {
    return this.units;
  }
}
