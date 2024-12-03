import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Block {
  id: number;
  data: string;
  nonce: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  difficulty: number;
  energyConsumed: number;
}

const BlockchainStudio: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [newBlockData, setNewBlockData] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(4);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [totalEnergy, setTotalEnergy] = useState<number>(0);

  useEffect(() => {
    if (blocks.length === 0) {
      createGenesisBlock();
    }
  }, []);

  const createGenesisBlock = async () => {
    const genesisBlock: Block = {
      id: 0,
      data: "Bloc Genesis",
      nonce: 0,
      hash: "",
      previousHash: "0000000000000000",
      timestamp: Date.now(),
      difficulty,
      energyConsumed: 0
    };

    const hash = await mineBlock(genesisBlock);
    genesisBlock.hash = hash;
    setBlocks([genesisBlock]);
  };

  const calculateHash = async (block: Block): Promise<string> => {
    const data = block.id + block.data + block.nonce + block.previousHash + block.timestamp;
    const msgBuffer = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const mineBlock = async (block: Block): Promise<string> => {
    let hash = '';
    let nonce = 0;
    let energyUsed = 0;
    const startTime = performance.now();

    while (true) {
      block.nonce = nonce;
      hash = await calculateHash(block);
      
      if (hash.startsWith('0'.repeat(difficulty))) {
        const endTime = performance.now();
        energyUsed = (endTime - startTime) * 0.001;
        block.energyConsumed = energyUsed;
        setTotalEnergy(prev => prev + energyUsed);
        break;
      }
      
      nonce++;
    }

    return hash;
  };

  const addBlock = async () => {
    if (!newBlockData.trim() || isMining) return;

    setIsMining(true);
    const previousBlock = blocks[blocks.length - 1];
    const newBlock: Block = {
      id: blocks.length,
      data: newBlockData,
      nonce: 0,
      hash: "",
      previousHash: previousBlock.hash,
      timestamp: Date.now(),
      difficulty,
      energyConsumed: 0
    };

    const hash = await mineBlock(newBlock);
    newBlock.hash = hash;
    
    setBlocks([...blocks, newBlock]);
    setNewBlockData('');
    setIsMining(false);
  };

  const BlockVisualizer: React.FC<{ block: Block }> = ({ block }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gray-800 rounded-lg mb-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Bloc #{block.id}</h3>
          <p className="text-sm text-gray-400">
            {new Date(block.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm">Nonce: {block.nonce}</p>
          <p className="text-sm">Énergie: {block.energyConsumed.toFixed(2)} kW</p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-gray-300">Données: {block.data}</p>
        <p className="text-xs text-gray-500 break-all">Hash: {block.hash}</p>
        <p className="text-xs text-gray-500 break-all">Hash Précédent: {block.previousHash}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Blockchain Studio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Contrôles</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Difficulté (nombre de zéros)
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full p-2 bg-gray-800 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Données du nouveau bloc
              </label>
              <input
                type="text"
                value={newBlockData}
                onChange={(e) => setNewBlockData(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded"
                placeholder="Entrez les données..."
                disabled={isMining}
              />
            </div>
            
            <button
              onClick={addBlock}
              disabled={isMining || !newBlockData.trim()}
              className={`w-full p-2 rounded ${
                isMining ? 'bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isMining ? 'Minage en cours...' : 'Miner un nouveau bloc'}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Statistiques</h3>
            <div className="bg-gray-800 p-4 rounded">
              <p>Nombre de blocs: {blocks.length}</p>
              <p>Énergie totale: {totalEnergy.toFixed(2)} kW</p>
              <p>Difficulté actuelle: {difficulty}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Chaîne de blocs</h3>
          <div className="space-y-4">
            {blocks.map((block) => (
              <BlockVisualizer key={block.id} block={block} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainStudio;
