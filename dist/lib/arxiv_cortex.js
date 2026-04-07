import fs from 'fs';
import path from 'path';
import { DOMAIN_QUERIES } from './arxiv_domains.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class ArxivCortex {
    papers = [];
    constructor() {
        this.loadPapers();
    }
    loadPapers() {
        try {
            const papersPath = path.resolve(__dirname, '../../src/arxiv/papers.json');
            const distPapersPath = path.resolve(__dirname, '../arxiv/papers.json');
            let finalPath = distPapersPath;
            if (!fs.existsSync(distPapersPath) && fs.existsSync(papersPath)) {
                finalPath = papersPath;
            }
            const data = fs.readFileSync(finalPath, 'utf-8');
            this.papers = JSON.parse(data);
        }
        catch (e) {
            console.error("Failed to load Arxiv papers:", e);
        }
    }
    // Use DOMAIN_QUERIES to classify papers or find relevant research targets
    getResearchFocus(domain) {
        return DOMAIN_QUERIES[domain];
    }
    getRecentPapers(topic) {
        return this.papers.filter(p => p.title.toLowerCase().includes(topic.toLowerCase()) ||
            p.summary.toLowerCase().includes(topic.toLowerCase()));
    }
    getPapersByDomain(domain) {
        const queries = DOMAIN_QUERIES[domain].map(q => q.toLowerCase());
        return this.papers.filter(p => {
            const title = p.title.toLowerCase();
            const summary = p.summary.toLowerCase();
            return queries.some(q => title.includes(q) || summary.includes(q));
        });
    }
    getAllPapers() {
        return this.papers;
    }
}
