import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SecurityMetric {
  name: string;
  value: number;
  description: string;
  recommendation: string;
}

interface HashStrength {
  algorithm: string;
  bits: number;
  timeToBreak: string;
  color: string;
}

const SecurityAnalytics: React.FC = () => {
  const [selectedHash, setSelectedHash] = useState<string>('');
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [hashStrengths, setHashStrengths] = useState<HashStrength[]>([]);

  useEffect(() => {
    // Simuler des métriques de sécurité
    setMetrics([
      {
        name: "Complexité du Hash",
        value: 95,
        description: "SHA-256 offre une excellente résistance aux collisions",
        recommendation: "Maintenir l'utilisation de SHA-256 pour la sécurité maximale"
      },
      {
        name: "Résistance aux Attaques",
        value: 88,
        description: "La chaîne est bien protégée contre les modifications",
        recommendation: "Augmenter la difficulté de minage pour plus de sécurité"
      },
      {
        name: "Intégrité des Données",
        value: 92,
        description: "Les données sont bien protégées par le hachage",
        recommendation: "Ajouter une validation supplémentaire pour les grandes transactions"
      }
    ]);

    setHashStrengths([
      {
        algorithm: "SHA-256",
        bits: 256,
        timeToBreak: "Des milliards d'années",
        color: "bg-green-600"
      },
      {
        algorithm: "MD5",
        bits: 128,
        timeToBreak: "Quelques heures",
        color: "bg-red-600"
      },
      {
        algorithm: "SHA-1",
        bits: 160,
        timeToBreak: "Quelques jours",
        color: "bg-yellow-600"
      }
    ]);
  }, []);

  const generateHash = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setSelectedHash(hashHex);
    analyzeHash(hashHex);
  };

  const analyzeHash = (hash: string) => {
    let score = 0;
    // Analyse simple du hash
    if (hash.length === 64) score += 30; // Longueur correcte pour SHA-256
    if (/^0+/.test(hash)) score += 20; // Commence par des zéros (preuve de travail)
    if (/[a-f0-9]{64}/.test(hash)) score += 30; // Format hexadécimal correct
    if (new Set(hash.split('')).size > 10) score += 20; // Bonne distribution

    setSecurityScore(score);
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Analyse de Sécurité Blockchain</h2>

      {/* Entrée de test */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Testez la Force du Hachage</h3>
        <div className="flex gap-4">
          <input
            type="text"
            onChange={(e) => generateHash(e.target.value)}
            className="flex-1 p-2 bg-gray-800 rounded"
            placeholder="Entrez du texte pour générer un hash..."
          />
        </div>
        {selectedHash && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <p className="text-sm">Hash généré :</p>
            <p className="font-mono break-all">{selectedHash}</p>
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <motion.div
                  className="bg-blue-600 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${securityScore}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm mt-1">Score de sécurité : {securityScore}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Comparaison des algorithmes */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Comparaison des Algorithmes de Hachage</h3>
        <div className="grid gap-4">
          {hashStrengths.map((hash) => (
            <div key={hash.algorithm} className="p-4 bg-gray-800 rounded">
              <div className="flex justify-between items-center">
                <h4 className="font-bold">{hash.algorithm}</h4>
                <span className={`px-2 py-1 rounded ${hash.color}`}>
                  {hash.bits} bits
                </span>
              </div>
              <p className="text-sm mt-2">Temps estimé pour casser : {hash.timeToBreak}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Métriques de sécurité */}
      <div>
        <h3 className="text-xl mb-4">Métriques de Sécurité</h3>
        <div className="grid gap-4">
          {metrics.map((metric) => (
            <motion.div
              key={metric.name}
              className="p-4 bg-gray-800 rounded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">{metric.name}</h4>
                <span className="text-xl">{metric.value}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mb-2">{metric.description}</p>
              <p className="text-sm text-blue-400">{metric.recommendation}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityAnalytics;
