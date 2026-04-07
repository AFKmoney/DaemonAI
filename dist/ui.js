import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { HardenedEngine } from './engine.js';
const engine = new HardenedEngine();
export const App = () => {
    const [ticks, setTicks] = useState(0);
    const [data, setData] = useState(null);
    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [learningInfo, setLearningInfo] = useState(null);
    useEffect(() => {
        const timer = setInterval(async () => {
            const result = engine.tick();
            const lInfo = await engine.learningDirector.autonomousTick(engine);
            setTicks(t => t + 1);
            setData(result);
            setLearningInfo(lInfo);
        }, 250);
        return () => clearInterval(timer);
    }, []);
    const handleSubmit = (val) => {
        if (!val.trim())
            return;
        if (val === '/export') {
            const brain = engine.exportBrain();
            process.stdout.write(`\n--- BRAIN EXPORT ---\n${brain}\n`);
            setQuery('');
            return;
        }
        const response = engine.chat(val);
        setChatHistory(prev => [...prev, { role: 'USER', content: val }, { role: 'DAEMON', content: response }].slice(-4));
        setQuery('');
    };
    if (!data)
        return React.createElement(Text, null, "Synthesizing DAEMON Neural Manifold V8.0...");
    return (React.createElement(Box, { flexDirection: "column", padding: 1, height: 42 },
        React.createElement(Box, { borderStyle: "round", borderColor: "#4B0082", paddingX: 1, flexDirection: "column" },
            React.createElement(Text, { bold: true, color: "#8A2BE2" }, "DAEMON AGI V8.0 \u2014 FRACTAL NEURAL MANIFOLD [HARDENED]"),
            React.createElement(Box, { flexDirection: "row", justifyContent: "space-between" },
                React.createElement(Text, { color: "gray" },
                    "Tick: ",
                    ticks,
                    " | Wave: ",
                    data.brainWave,
                    " | Mode: ",
                    data.ternary ? 'TERNARY' : 'CONTINUOUS'),
                React.createElement(Box, { flexDirection: "column", alignItems: "flex-end" },
                    React.createElement(Text, { color: "cyan" },
                        "Self-Teaching: ",
                        learningInfo?.status || 'IDLE'),
                    learningInfo?.evolution && learningInfo.evolution !== 'NONE' && (React.createElement(Text, { color: "green", dimColor: true },
                        "CodeEvol: ",
                        learningInfo.evolution))))),
        React.createElement(Box, { flexDirection: "row", marginTop: 1, flexGrow: 1 },
            React.createElement(Box, { flexDirection: "column", width: "35%", marginRight: 1 },
                React.createElement(Box, { borderStyle: "single", borderColor: "#8A2BE2", paddingX: 1, flexDirection: "column" },
                    React.createElement(Text, { bold: true, color: "#4B0082" }, "Cognitive Tools"),
                    data.currentTool ? (React.createElement(Box, { flexDirection: "column" },
                        React.createElement(Text, { color: "white", bold: true }, data.currentTool.name),
                        React.createElement(Text, { color: "gray", dimColor: true }, data.currentTool.description))) : React.createElement(Text, { color: "gray" }, "Selecting tool..."),
                    React.createElement(Box, { marginTop: 1, flexDirection: "column" },
                        React.createElement(Text, { bold: true, color: "#4B0082" }, "IA Favorites"),
                        Array.from(engine.toolSystem.iaFavorites).map(id => (React.createElement(Text, { key: id, color: "magenta" },
                            "- ",
                            id))))),
                React.createElement(Box, { borderStyle: "single", borderColor: "#4B0082", paddingX: 1, flexDirection: "column", marginTop: 1 },
                    React.createElement(Text, { bold: true, color: "#4B0082" }, "Metrology"),
                    React.createElement(Text, null,
                        "Uncertainty: ",
                        React.createElement(Text, { color: "yellow" },
                            (data.uncertainty * 100).toFixed(1),
                            "%")),
                    React.createElement(Text, null,
                        "Calibration: ",
                        React.createElement(Text, { color: "cyan" },
                            (data.calibration * 100).toFixed(1),
                            "%")),
                    React.createElement(Text, null,
                        "Surprise: ",
                        React.createElement(Text, { color: "red" }, data.surprise.toFixed(0))))),
            React.createElement(Box, { borderStyle: "single", borderColor: "#8A2BE2", paddingX: 1, flexDirection: "column", width: "65%" },
                React.createElement(Text, { bold: true, color: "#4B0082" }, "Direct Neural Link"),
                React.createElement(Box, { flexDirection: "column", flexGrow: 1 }, chatHistory.map((m, i) => (React.createElement(Box, { key: i, marginTop: 1 },
                    React.createElement(Text, { color: m.role === 'USER' ? 'cyan' : '#8A2BE2', bold: true },
                        m.role,
                        ": "),
                    React.createElement(Text, { color: "white", italic: m.role === 'DAEMON' }, m.content))))),
                React.createElement(Box, { marginTop: 1, borderStyle: "bold", borderColor: "#4B0082", paddingX: 1 },
                    React.createElement(Text, { color: "#8A2BE2", bold: true },
                        "> ",
                        " "),
                    React.createElement(TextInput, { value: query, onChange: setQuery, onSubmit: handleSubmit, placeholder: "Inject neural directive..." })))),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { color: "gray" }, "BitNet b1.58 | Tool Selection Engine | Cognitive Favorites System"))));
};
