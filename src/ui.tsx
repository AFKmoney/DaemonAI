import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { HardenedEngine } from './engine.js';

const engine = new HardenedEngine();

export const App = () => {
  const [ticks, setTicks] = useState(0);
  const [data, setData] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [learningInfo, setLearningInfo] = useState<any>(null);

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

  const handleSubmit = (val: string) => {
    if (!val.trim()) return;
    
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

  if (!data) return <Text>Synthesizing DAEMON Neural Manifold V8.0...</Text>;

  return (
    <Box flexDirection="column" padding={1} height={42}>
      <Box borderStyle="round" borderColor="#4B0082" paddingX={1} flexDirection="column">
        <Text bold color="#8A2BE2">DAEMON AGI V8.0 — FRACTAL NEURAL MANIFOLD [HARDENED]</Text>
        <Box flexDirection="row" justifyContent="space-between">
          <Text color="gray">Tick: {ticks} | Wave: {data.brainWave} | Mode: {data.ternary ? 'TERNARY' : 'CONTINUOUS'}</Text>
          <Box flexDirection="column" alignItems="flex-end">
            <Text color="cyan">Self-Teaching: {learningInfo?.status || 'IDLE'}</Text>
            {learningInfo?.evolution && learningInfo.evolution !== 'NONE' && (
              <Text color="green" dimColor>CodeEvol: {learningInfo.evolution}</Text>
            )}
          </Box>
        </Box>
      </Box>

      <Box flexDirection="row" marginTop={1} flexGrow={1}>
        <Box flexDirection="column" width="35%" marginRight={1}>
          <Box borderStyle="single" borderColor="#8A2BE2" paddingX={1} flexDirection="column">
            <Text bold color="#4B0082">Cognitive Tools</Text>
            {data.currentTool ? (
              <Box flexDirection="column">
                <Text color="white" bold>{data.currentTool.name}</Text>
                <Text color="gray" dimColor>{data.currentTool.description}</Text>
              </Box>
            ) : <Text color="gray">Selecting tool...</Text>}
            
            <Box marginTop={1} flexDirection="column">
              <Text bold color="#4B0082">IA Favorites</Text>
              {Array.from(engine.toolSystem.iaFavorites).map(id => (
                <Text key={id} color="magenta">- {id}</Text>
              ))}
            </Box>
          </Box>
          
          <Box borderStyle="single" borderColor="#4B0082" paddingX={1} flexDirection="column" marginTop={1}>
            <Text bold color="#4B0082">Metrology</Text>
            <Text>Uncertainty: <Text color="yellow">{(data.uncertainty * 100).toFixed(1)}%</Text></Text>
            <Text>Calibration: <Text color="cyan">{(data.calibration * 100).toFixed(1)}%</Text></Text>
            <Text>Surprise: <Text color="red">{data.surprise.toFixed(0)}</Text></Text>
          </Box>
        </Box>

        <Box borderStyle="single" borderColor="#8A2BE2" paddingX={1} flexDirection="column" width="65%">
          <Text bold color="#4B0082">Direct Neural Link</Text>
          <Box flexDirection="column" flexGrow={1}>
            {chatHistory.map((m, i) => (
              <Box key={i} marginTop={1}>
                <Text color={m.role === 'USER' ? 'cyan' : '#8A2BE2'} bold>{m.role}: </Text>
                <Text color="white" italic={m.role === 'DAEMON'}>{m.content}</Text>
              </Box>
            ))}
          </Box>
          <Box marginTop={1} borderStyle="bold" borderColor="#4B0082" paddingX={1}>
            <Text color="#8A2BE2" bold>{"> "} </Text>
            <TextInput value={query} onChange={setQuery} onSubmit={handleSubmit} placeholder="Inject neural directive..." />
          </Box>
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text color="gray">BitNet b1.58 | Tool Selection Engine | Cognitive Favorites System</Text>
      </Box>
    </Box>
  );
};
