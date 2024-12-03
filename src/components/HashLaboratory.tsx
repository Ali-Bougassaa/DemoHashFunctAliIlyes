import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface HashResult {
  input: string;
  sha256: string;
  md5: string;
  weak: string;
}

const HashLaboratory: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [selectedHash, setSelectedHash] = useState<HashResult | null>(null);
  const [showAvalanche, setShowAvalanche] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  // Fonction de hachage faible pour démonstration
  const weakHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  // Fonction SHA-256
  const sha256 = async (input: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Fonction MD5 (simulée pour démonstration)
  const md5 = (input: string): string => {
    // Simulation simple de MD5 pour démonstration
    return input.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0).toString(16);
    }, '').slice(0, 32);
  };

  const calculateHashes = async (text: string) => {
    const sha256Result = await sha256(text);
    const md5Result = md5(text);
    const weakResult = weakHash(text);

    const newHashResult: HashResult = {
      input: text,
      sha256: sha256Result,
      md5: md5Result,
      weak: weakResult
    };

    setHashResults(prev => [...prev, newHashResult]);
    setSelectedHash(newHashResult);
  };

  const demonstrateAvalanche = async () => {
    setShowAvalanche(true);
    const originalInput = input;
    const modifiedInput = originalInput + '.';

    await calculateHashes(originalInput);
    await calculateHashes(modifiedInput);
  };

  const HashVisualizer: React.FC<{ result: HashResult }> = ({ result }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gray-800 rounded-lg mb-4"
    >
      <div className="space-y-2">
        <div>
          <span className="text-gray-400">Entrée:</span>
          <span className="ml-2 font-mono">{result.input}</span>
        </div>
        <div>
          <span className="text-gray-400">SHA-256:</span>
          <span className="ml-2 font-mono text-green-500">{result.sha256}</span>
        </div>
        <div>
          <span className="text-gray-400">MD5:</span>
          <span className="ml-2 font-mono text-yellow-500">{result.md5}</span>
        </div>
        <div>
          <span className="text-gray-400">Hash Faible:</span>
          <span className="ml-2 font-mono text-red-500">{result.weak}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Laboratoire de Hachage</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Zone de Test</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Texte à hacher
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded"
                placeholder="Entrez du texte..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => calculateHashes(input)}
                className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Calculer les Hashs
              </button>
              <button
                onClick={demonstrateAvalanche}
                className="flex-1 p-2 bg-purple-600 hover:bg-purple-700 rounded"
              >
                Effet Avalanche
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Vitesse d'Animation
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Résultats</h3>
          <div className="space-y-4">
            {hashResults.map((result, index) => (
              <HashVisualizer key={index} result={result} />
            ))}
          </div>
        </div>
      </div>

      {showAvalanche && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Analyse de l'Effet Avalanche</h3>
          <p className="text-gray-400 mb-4">
            Observez comment un petit changement dans l'entrée produit des hashs complètement différents.
          </p>
        </div>
      )}
    </div>
  );
};

export default HashLaboratory;
