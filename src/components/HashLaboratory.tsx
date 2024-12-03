import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface HashComparisonProps {
  originalText: string;
  sha256Hash: string;
  md5Hash: string;
  weakHash: string;
}

const HashLaboratory: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [hashResults, setHashResults] = useState<HashComparisonProps>({
    originalText: '',
    sha256Hash: '',
    md5Hash: '',
    weakHash: ''
  });
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showDifferences, setShowDifferences] = useState(false);

  // Fonction de hachage faible pour démonstration
  const weakHashFunction = (text: string): string => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash;
    }
    return hash.toString(16);
  };

  // Fonction SHA-256
  const sha256 = async (text: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Fonction MD5 (simulée pour démonstration)
  const md5 = (text: string): string => {
    // Simulation simple de MD5 pour démonstration
    return text.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0).toString(16);
    }, '').slice(0, 32);
  };

  const updateHashes = useCallback(async (text: string) => {
    const sha256Result = await sha256(text);
    const md5Result = md5(text);
    const weakResult = weakHashFunction(text);

    setHashResults({
      originalText: text,
      sha256Hash: sha256Result,
      md5Hash: md5Result,
      weakHash: weakResult
    });
  }, []);

  useEffect(() => {
    updateHashes(inputText);
  }, [inputText, updateHashes]);

  const HashVisualizer: React.FC<{ hash: string, label: string }> = ({ hash, label }) => (
    <motion.div
      className="p-4 bg-gray-800 rounded-lg mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold mb-2 text-white">{label}</h3>
      <div className="flex flex-wrap gap-1">
        {hash.split('').map((char, index) => (
          <motion.span
            key={index}
            className="inline-block w-8 h-8 flex items-center justify-center rounded"
            style={{
              backgroundColor: `hsl(${(parseInt(char, 16) * 22.5) % 360}, 70%, 50%)`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.01 * animationSpeed }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Laboratoire de Hachage</h2>
      
      <div className="mb-6">
        <label className="block mb-2">Texte à hacher :</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded text-white"
          placeholder="Entrez du texte..."
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2">Vitesse d'animation :</label>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <HashVisualizer hash={hashResults.sha256Hash} label="SHA-256" />
        <HashVisualizer hash={hashResults.md5Hash} label="MD5" />
        <HashVisualizer hash={hashResults.weakHash} label="Fonction Faible" />
      </div>

      <button
        onClick={() => setShowDifferences(!showDifferences)}
        className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        {showDifferences ? "Masquer" : "Montrer"} les différences
      </button>
    </div>
  );
};

export default HashLaboratory;
