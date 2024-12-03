import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Block {
  index: number;
  timestamp: number;
  data: string;
  previousHash: string;
  hash: string;
  nonce: number;
}

interface AttackResult {
  success: boolean;
  timeSpent: number;
  energyUsed: number;
  message: string;
}

const AttackSimulator: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [attackType, setAttackType] = useState<'modify' | 'doubleSpend' | '51percent'>('modify');
  const [attackInProgress, setAttackInProgress] = useState(false);
  const [attackResult, setAttackResult] = useState<AttackResult | null>(null);
  const [modifiedData, setModifiedData] = useState('');

  // Fonction de hachage SHA-256
  const calculateHash = async (data: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Créer des blocs initiaux
  useEffect(() => {
    const initializeBlocks = async () => {
      const initialBlocks: Block[] = [];
      for (let i = 0; i < 3; i++) {
        const previousHash = i === 0 ? '0'.repeat(64) : initialBlocks[i - 1].hash;
        const block: Block = {
          index: i,
          timestamp: Date.now(),
          data: `Transaction ${i + 1}: Alice envoie 100 coins à Bob`,
          previousHash,
          hash: '',
          nonce: 0
        };
        block.hash = await calculateHash(
          `${block.index}${block.timestamp}${block.data}${block.previousHash}${block.nonce}`
        );
        initialBlocks.push(block);
      }
      setBlocks(initialBlocks);
    };
    initializeBlocks();
  }, []);

  // Simuler une attaque de modification
  const simulateModificationAttack = async (blockIndex: number, newData: string) => {
    setAttackInProgress(true);
    const startTime = Date.now();
    let energyUsed = 0;
    
    try {
      const modifiedBlocks = [...blocks];
      const targetBlock = { ...modifiedBlocks[blockIndex] };
      
      // Tenter de modifier le bloc
      targetBlock.data = newData;
      targetBlock.hash = await calculateHash(
        `${targetBlock.index}${targetBlock.timestamp}${targetBlock.data}${targetBlock.previousHash}${targetBlock.nonce}`
      );
      
      // Recalculer tous les hashs suivants
      for (let i = blockIndex; i < modifiedBlocks.length; i++) {
        if (i === blockIndex) {
          modifiedBlocks[i] = targetBlock;
        } else {
          const block = { ...modifiedBlocks[i] };
          block.previousHash = modifiedBlocks[i - 1].hash;
          block.hash = await calculateHash(
            `${block.index}${block.timestamp}${block.data}${block.previousHash}${block.nonce}`
          );
          modifiedBlocks[i] = block;
          energyUsed += 1000; // Simulation de consommation d'énergie
        }
      }

      const timeSpent = Date.now() - startTime;
      
      setAttackResult({
        success: false,
        timeSpent,
        energyUsed,
        message: "Attaque détectée ! La blockchain a rejeté les modifications car la chaîne est invalide."
      });

      // Montrer visuellement la tentative d'attaque
      setBlocks(modifiedBlocks);
      setTimeout(() => setBlocks(blocks), 3000); // Restaurer après 3 secondes

    } catch (error) {
      setAttackResult({
        success: false,
        timeSpent: Date.now() - startTime,
        energyUsed,
        message: "L'attaque a échoué en raison d'une erreur technique."
      });
    }
    
    setAttackInProgress(false);
  };

  // Simuler une attaque 51%
  const simulate51PercentAttack = async () => {
    setAttackInProgress(true);
    const startTime = Date.now();
    let energyUsed = 0;

    try {
      // Simuler une tentative de contrôle du réseau
      for (let i = 0; i < 5; i++) {
        energyUsed += 5000; // Haute consommation d'énergie
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation du temps de calcul
      }

      setAttackResult({
        success: false,
        timeSpent: Date.now() - startTime,
        energyUsed,
        message: "Attaque 51% échouée : Nécessite plus de puissance de calcul que l'ensemble du réseau."
      });
    } catch (error) {
      setAttackResult({
        success: false,
        timeSpent: Date.now() - startTime,
        energyUsed,
        message: "L'attaque a échoué : Ressources insuffisantes."
      });
    }

    setAttackInProgress(false);
  };

  // Simuler une double dépense
  const simulateDoubleSpendAttack = async () => {
    setAttackInProgress(true);
    const startTime = Date.now();
    let energyUsed = 0;

    try {
      // Simuler une tentative de double dépense
      const newBlock: Block = {
        index: blocks.length,
        timestamp: Date.now(),
        data: "TENTATIVE: Double dépense de 100 coins",
        previousHash: blocks[blocks.length - 1].hash,
        hash: '',
        nonce: 0
      };

      newBlock.hash = await calculateHash(
        `${newBlock.index}${newBlock.timestamp}${newBlock.data}${newBlock.previousHash}${newBlock.nonce}`
      );

      energyUsed += 3000;

      setAttackResult({
        success: false,
        timeSpent: Date.now() - startTime,
        energyUsed,
        message: "Double dépense détectée et rejetée par le réseau !"
      });

      // Montrer la tentative
      setBlocks([...blocks, newBlock]);
      setTimeout(() => setBlocks(blocks), 3000); // Restaurer après 3 secondes

    } catch (error) {
      setAttackResult({
        success: false,
        timeSpent: Date.now() - startTime,
        energyUsed,
        message: "La tentative de double dépense a échoué."
      });
    }

    setAttackInProgress(false);
  };

  const handleAttack = async () => {
    switch (attackType) {
      case 'modify':
        if (selectedBlock !== null && modifiedData) {
          await simulateModificationAttack(selectedBlock, modifiedData);
        }
        break;
      case '51percent':
        await simulate51PercentAttack();
        break;
      case 'doubleSpend':
        await simulateDoubleSpendAttack();
        break;
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Simulateur d'Attaques Blockchain</h2>

      <div className="mb-6">
        <h3 className="text-xl mb-4">Type d'Attaque :</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setAttackType('modify')}
            className={`px-4 py-2 rounded ${
              attackType === 'modify' ? 'bg-red-600' : 'bg-gray-700'
            }`}
          >
            Modification de Bloc
          </button>
          <button
            onClick={() => setAttackType('doubleSpend')}
            className={`px-4 py-2 rounded ${
              attackType === 'doubleSpend' ? 'bg-red-600' : 'bg-gray-700'
            }`}
          >
            Double Dépense
          </button>
          <button
            onClick={() => setAttackType('51percent')}
            className={`px-4 py-2 rounded ${
              attackType === '51percent' ? 'bg-red-600' : 'bg-gray-700'
            }`}
          >
            Attaque 51%
          </button>
        </div>
      </div>

      {attackType === 'modify' && (
        <div className="mb-6">
          <h3 className="text-xl mb-4">Sélectionnez un bloc à modifier :</h3>
          <div className="grid grid-cols-1 gap-4">
            {blocks.map((block, index) => (
              <motion.div
                key={block.index}
                className={`p-4 rounded ${
                  selectedBlock === index ? 'bg-red-900' : 'bg-gray-800'
                }`}
                onClick={() => setSelectedBlock(index)}
                whileHover={{ scale: 1.02 }}
              >
                <p>Bloc #{block.index}</p>
                <p className="text-sm">Données: {block.data}</p>
                <p className="text-xs">Hash: {block.hash.substring(0, 20)}...</p>
              </motion.div>
            ))}
          </div>
          
          {selectedBlock !== null && (
            <div className="mt-4">
              <input
                type="text"
                value={modifiedData}
                onChange={(e) => setModifiedData(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded"
                placeholder="Nouvelles données..."
              />
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleAttack}
        disabled={attackInProgress}
        className={`px-6 py-3 rounded ${
          attackInProgress ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {attackInProgress ? 'Attaque en cours...' : 'Lancer l\'attaque'}
      </button>

      {attackResult && (
        <motion.div
          className="mt-6 p-4 bg-gray-800 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl mb-2">Résultat de l'attaque :</h3>
          <p>Temps écoulé : {attackResult.timeSpent} ms</p>
          <p>Énergie consommée : {attackResult.energyUsed} unités</p>
          <p className="mt-2">{attackResult.message}</p>
        </motion.div>
      )}
    </div>
  );
};

export default AttackSimulator;
