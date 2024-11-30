import React, { useState, useEffect } from 'react';
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
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
  };

  const generateHashes = async () => {
    if (!input) return;

    const sha256Hash = await sha256(input);
    const md5Hash = md5(input);
    const weakHashResult = weakHash(input);

    const newHash: HashResult = {
      input,
      sha256: sha256Hash,
      md5: md5Hash,
      weak: weakHashResult
    };

    setHashResults([newHash, ...hashResults.slice(0, 4)]);
    setSelectedHash(newHash);
  };

  const demonstrateAvalanche = async () => {
    setShowAvalanche(true);
    const originalInput = input;
    const modifiedInput = input + '.';

    const original = await sha256(originalInput);
    const modified = await sha256(modifiedInput);

    // Comparer les bits différents
    const differentBits = original.split('').reduce((count, char, index) => {
      return count + (char !== modified[index] ? 1 : 0);
    }, 0);

    console.log(`Bits différents: ${differentBits}`);
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Laboratoire de Hachage</h2>

      {/* Section d'entrée */}
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 bg-gray-800 rounded"
            placeholder="Entrez du texte à hacher..."
          />
          <button
            onClick={generateHashes}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Générer les Hashs
          </button>
        </div>
      </div>

      {/* Section des résultats */}
      <div className="grid gap-4">
        {hashResults.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded cursor-pointer ${
              selectedHash === result ? 'bg-blue-900' : 'bg-gray-800'
            }`}
            onClick={() => setSelectedHash(result)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">Entrée: {result.input}</p>
                <div className="mt-2">
                  <p className="text-sm">SHA-256:</p>
                  <p className="font-mono break-all">{result.sha256}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm">MD5:</p>
                  <p className="font-mono break-all">{result.md5}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm">Hash Faible:</p>
                  <p className="font-mono break-all">{result.weak}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Section effet d'avalanche */}
      {selectedHash && (
        <div className="mt-6">
          <button
            onClick={demonstrateAvalanche}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Démontrer l'Effet d'Avalanche
          </button>
          {showAvalanche && (
            <div className="mt-4 p-4 bg-gray-800 rounded">
              <p>
                Une petite modification de l'entrée entraîne un changement
                significatif du hash, démontrant l'effet d'avalanche.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HashLaboratory;
