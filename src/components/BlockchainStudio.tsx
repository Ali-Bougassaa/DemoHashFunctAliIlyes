import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Block {
  index: number;
  timestamp: number;
  data: string;
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  energyConsumed: number;
}

const BlockchainStudio: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [newBlockData, setNewBlockData] = useState('');
  const [mining, setMining] = useState(false);
  const [difficulty, setDifficulty] = useState(4);
  const [energyUsage, setEnergyUsage] = useState(0);

  const calculateHash = async (index: number, timestamp: number, data: string, previousHash: string, nonce: number): Promise<string> => {
    const text = `${index}${timestamp}${data}${previousHash}${nonce}`;
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const mineBlock = async (index: number, data: string, previousHash: string) => {
    setMining(true);
    const timestamp = Date.now();
    let nonce = 0;
    let hash = '';
    let startTime = performance.now();

    while (true) {
      hash = await calculateHash(index, timestamp, data, previousHash, nonce);
      if (hash.startsWith('0'.repeat(difficulty))) {
        break;
      }
      nonce++;
      
      // Simuler la consommation d'énergie
      if (nonce % 100 === 0) {
        const timeElapsed = performance.now() - startTime;
        setEnergyUsage(prev => prev + (timeElapsed * 0.001)); // Simulation simple
      }
    }

    const newBlock: Block = {
      index,
      timestamp,
      data,
      previousHash,
      hash,
      nonce,
      difficulty,
      energyConsumed: (performance.now() - startTime) * 0.001
    };

    setBlocks(prev => [...prev, newBlock]);
    setMining(false);
    return newBlock;
  };

  const addBlock = async () => {
    if (newBlockData.trim() === '' || mining) return;

    const previousBlock = blocks[blocks.length - 1];
    const newIndex = previousBlock ? previousBlock.index + 1 : 0;
    const previousHash = previousBlock ? previousBlock.hash : '0'.repeat(64);

    await mineBlock(newIndex, newBlockData, previousHash);
    setNewBlockData('');
  };

  const BlockVisualizer: React.FC<{ block: Block }> = ({ block }) => (
    <motion.div
      className="p-4 bg-gray-800 rounded-lg mb-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          <h3 className="font-bold">Block #{block.index}</h3>
          <p className="text-sm">Nonce: {block.nonce}</p>
          <p className="text-sm">Difficulté: {block.difficulty}</p>
          <p className="text-sm">Énergie: {block.energyConsumed.toFixed(2)} units</p>
        </div>
        <div>
          <p className="text-sm break-all">Hash: {block.hash}</p>
          <p className="text-sm break-all">Prev: {block.previousHash.slice(0, 10)}...</p>
          <p className="text-sm">Données: {block.data}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Blockchain Studio</h2>

      <div className="mb-6">
        <label className="block mb-2">Difficulté du minage:</label>
        <input
          type="range"
          min="1"
          max="6"
          value={difficulty}
          onChange={(e) => setDifficulty(parseInt(e.target.value))}
          className="w-full"
        />
        <span>Niveau: {difficulty}</span>
      </div>

      <div className="mb-6">
        <label className="block mb-2">Données du bloc:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBlockData}
            onChange={(e) => setNewBlockData(e.target.value)}
            className="flex-1 p-2 bg-gray-800 rounded"
            placeholder="Entrez les données..."
          />
          <button
            onClick={addBlock}
            disabled={mining}
            className={`px-4 py-2 rounded ${mining ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {mining ? 'Minage en cours...' : 'Miner le bloc'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Statistiques</h3>
        <p>Consommation totale d'énergie: {energyUsage.toFixed(2)} units</p>
        <p>Nombre de blocs: {blocks.length}</p>
      </div>

      <div className="space-y-4">
        {blocks.map((block) => (
          <BlockVisualizer key={block.index} block={block} />
        ))}
      </div>
    </div>
  );
};

export default BlockchainStudio;
