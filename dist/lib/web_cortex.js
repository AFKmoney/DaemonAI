import axios from 'axios';
export class WebCortex {
    userAgent = 'DaemonAGI/8.0 (Recursive Self-Learning Engine)';
    async fetchWikipediaSummary(topic) {
        try {
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
            const response = await axios.get(url, {
                headers: { 'User-Agent': this.userAgent }
            });
            return response.data.extract || "";
        }
        catch (e) {
            return "";
        }
    }
    async searchArxiv(query) {
        try {
            const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=3`;
            const response = await axios.get(url);
            // Simple regex parser for Atom feed abstracts
            const abstracts = response.data.match(/<summary>([\s\S]*?)<\/summary>/g) || [];
            return abstracts.map((s) => s.replace(/<summary>|<\/summary>/g, '').trim());
        }
        catch (e) {
            return [];
        }
    }
}
