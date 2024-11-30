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
    // Créer le bloc genesis si aucun bloc n'existe
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
    const target = '0'.repeat(difficulty);

    while (true) {
      block.nonce = nonce;
      hash = await calculateHash(block);
      energyUsed += 1; // Simuler la consommation d'énergie

      if (hash.startsWith(target)) {
        block.energyConsumed = energyUsed;
        setTotalEnergy(prev => prev + energyUsed);
        return hash;
      }
      nonce++;
    }
  };

  const addBlock = async () => {
    if (!newBlockData) return;

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

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Studio Blockchain</h2>

      {/* Contrôles */}
      <div className="mb-6 grid gap-4">
        <div>
          <label className="block text-sm mb-2">Difficulté du minage</label>
          <input
            type="range"
            min="1"
            max="6"
            value={difficulty}
            onChange={(e) => setDifficulty(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-sm">Niveau: {difficulty} (Cible: {"0".repeat(difficulty)})</p>
        </div>

        <div>
          <label className="block text-sm mb-2">Données du nouveau bloc</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={newBlockData}
              onChange={(e) => setNewBlockData(e.target.value)}
              className="flex-1 p-2 bg-gray-800 rounded"
              placeholder="Entrez les données..."
            />
            <button
              onClick={addBlock}
              disabled={isMining}
              className={`px-4 py-2 rounded ${
                isMining ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isMining ? 'Minage en cours...' : 'Miner un bloc'}
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mb-6 p-4 bg-gray-800 rounded">
        <h3 className="text-xl mb-2">Statistiques</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Nombre de blocs</p>
            <p className="text-2xl">{blocks.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Énergie totale consommée</p>
            <p className="text-2xl">{totalEnergy} unités</p>
          </div>
        </div>
      </div>

      {/* Liste des blocs */}
      <div className="grid gap-4">
        {blocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gray-800 rounded"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">Bloc #{block.id}</h3>
                <p className="text-sm text-gray-400">Données: {block.data}</p>
                <p className="text-sm">Nonce: {block.nonce}</p>
                <p className="text-sm">Hash: {block.hash}</p>
                <p className="text-sm">Hash précédent: {block.previousHash}</p>
                <p className="text-sm">Énergie utilisée: {block.energyConsumed} unités</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">
                  {new Date(block.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainStudio;
