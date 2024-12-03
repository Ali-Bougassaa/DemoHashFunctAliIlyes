import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  title: string;
  description: string;
  technicalDetails: string;
  formula?: string;
  animation: string;
  example?: string;
}

const MD5Explanation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState('Hello');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const steps: Step[] = [
    {
      title: "1. Préparation du Message",
      description: "Le message est d'abord converti en bits et étendu pour que sa longueur soit congrue à 448 modulo 512.",
      technicalDetails: `1. Conversion en bits : Chaque caractère est converti en sa représentation ASCII puis en binaire
2. Ajout d'un '1' à la fin du message
3. Ajout de '0' jusqu'à ce que la longueur soit congrue à 448 modulo 512
4. Les 64 derniers bits sont réservés pour la longueur du message original`,
      formula: "Message + '1' + '0'* + Length(64 bits)",
      animation: "padding",
      example: "Exemple: 'A' (65 en ASCII) → 01000001 → 01000001 1 000...0 [longueur]"
    },
    {
      title: "2. Division en Blocs de 512 bits",
      description: "Le message étendu est divisé en blocs de 512 bits, chaque bloc étant traité séquentiellement.",
      technicalDetails: `1. Chaque bloc de 512 bits est divisé en 16 sous-blocs de 32 bits
2. Ces sous-blocs sont utilisés comme entrées pour les opérations de hachage
3. L'ordre des octets est little-endian
4. Les blocs sont traités de manière séquentielle, chaque résultat alimentant le bloc suivant`,
      animation: "blocks",
      example: "Un bloc de 512 bits = 16 mots de 32 bits (M0 à M15)"
    },
    {
      title: "3. Initialisation des Registres",
      description: "Quatre registres de 32 bits (A, B, C, D) sont initialisés avec des valeurs constantes spécifiques.",
      technicalDetails: `Les valeurs initiales sont choisies pour leurs propriétés mathématiques:
- A = 0x67452301 (en binaire: 01100111 01000101 00100011 00000001)
- B = 0xEFCDAB89 (en binaire: 11101111 11001101 10101011 10001001)
- C = 0x98BADCFE (en binaire: 10011000 10111010 11011100 11111110)
- D = 0x10325476 (en binaire: 00010000 00110010 01010100 01110110)

Ces valeurs sont choisies pour maximiser l'effet d'avalanche.`,
      formula: "Registres initiaux:\nA = 0x67452301\nB = 0xEFCDAB89\nC = 0x98BADCFE\nD = 0x10325476",
      animation: "buffers"
    },
    {
      title: "4. Fonctions de Compression",
      description: "MD5 utilise quatre fonctions non-linéaires différentes, une pour chaque ronde de 16 opérations.",
      technicalDetails: `Les fonctions sont conçues pour:
1. F(X,Y,Z) = (X ∧ Y) ∨ (¬X ∧ Z) [Ronde 1]
   - Si X alors Y sinon Z
2. G(X,Y,Z) = (X ∧ Z) ∨ (Y ∧ ¬Z) [Ronde 2]
   - Si Z alors X sinon Y
3. H(X,Y,Z) = X ⊕ Y ⊕ Z [Ronde 3]
   - Parité bit à bit
4. I(X,Y,Z) = Y ⊕ (X ∨ ¬Z) [Ronde 4]
   - Complément de parité

Chaque fonction a des propriétés spécifiques qui contribuent à la sécurité de l'algorithme.`,
      formula: "F(X,Y,Z) = (X ∧ Y) ∨ (¬X ∧ Z)\nG(X,Y,Z) = (X ∧ Z) ∨ (Y ∧ ¬Z)\nH(X,Y,Z) = X ⊕ Y ⊕ Z\nI(X,Y,Z) = Y ⊕ (X ∨ ¬Z)",
      animation: "functions"
    },
    {
      title: "5. Rondes de Traitement",
      description: "Le message subit 64 opérations, organisées en quatre rondes de 16 opérations chacune.",
      technicalDetails: `Chaque opération effectue:
1. Addition modulaire de la valeur précédente
2. Addition du résultat de la fonction non-linéaire
3. Addition d'une constante unique (Ti)
4. Addition d'un mot du message
5. Rotation à gauche d'un nombre spécifique de bits
6. Addition modulaire avec la valeur précédente

Les constantes Ti sont générées par:
Ti = floor(232 × |sin(i)|) où i est en radians

Les rotations sont optimisées pour maximiser l'effet d'avalanche:
- Ronde 1: [7, 12, 17, 22]
- Ronde 2: [5, 9, 14, 20]
- Ronde 3: [4, 11, 16, 23]
- Ronde 4: [6, 10, 15, 21]`,
      formula: "a = b + ((a + Fi(b,c,d) + M[k] + T[i]) <<< s)",
      animation: "rounds",
      example: "Pour chaque étape:\n1. a ← b + ((a + F(b,c,d) + M[k] + T[i]) <<< s)"
    },
    {
      title: "6. Résultat Final",
      description: "Le hash final est la concaténation des quatre registres A, B, C, D en hexadécimal.",
      technicalDetails: `1. Les registres finaux sont additionnés aux valeurs initiales
2. Le résultat est converti en hexadécimal
3. Les octets sont concaténés en little-endian
4. Le hash final fait toujours 128 bits (32 caractères hexadécimaux)

Propriétés du hash MD5:
- Taille fixe de 128 bits
- Déterministe (même entrée → même sortie)
- Effet d'avalanche (changement minimal → changement majeur)
- Collision possible (non recommandé pour la cryptographie)`,
      animation: "final",
      example: "Hash MD5 de 'hello' = 5d41402abc4b2a76b9719d911017c592"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev === steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const renderAnimation = (type: string) => {
    switch (type) {
      case 'padding':
        return (
          <motion.div className="flex space-x-2">
            {input.split('').map((char, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white"
              >
                {char}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-white"
            >
              1
            </motion.div>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`padding-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (input.length + i) * 0.1 }}
                className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center"
              >
                0
              </motion.div>
            ))}
          </motion.div>
        );
      case 'blocks':
        return (
          <motion.div className="flex flex-col space-y-4">
            {[...Array(2)].map((_, blockIndex) => (
              <motion.div
                key={`block-${blockIndex}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: blockIndex * 0.3 }}
                className="flex space-x-2"
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`block-${blockIndex}-byte-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: blockIndex * 0.3 + i * 0.1 }}
                    className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-xs"
                  >
                    {(blockIndex * 8 + i).toString(16).padStart(2, '0')}
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        );
      case 'buffers':
        return (
          <motion.div className="flex space-x-4">
            {['A', 'B', 'C', 'D'].map((buffer, i) => (
              <motion.div
                key={buffer}
                initial={{ opacity: 0, rotateX: 90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="text-lg font-bold mb-2">{buffer}</div>
                <div className="w-24 h-12 bg-yellow-500 rounded flex items-center justify-center text-white text-sm">
                  {steps[2].formula?.split('\n')[i].split(' = ')[1]}
                </div>
              </motion.div>
            ))}
          </motion.div>
        );
      case 'functions':
        return (
          <motion.div className="grid grid-cols-2 gap-4">
            {['F', 'G', 'H', 'I'].map((func, i) => (
              <motion.div
                key={func}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="p-4 bg-indigo-500 rounded text-white"
              >
                <div className="font-bold mb-2">Fonction {func}</div>
                <div className="text-sm">
                  {steps[3].formula?.split('\n')[i]}
                </div>
              </motion.div>
            ))}
          </motion.div>
        );
      case 'rounds':
        return (
          <motion.div className="relative h-64">
            <motion.div
              animate={{
                rotate: [0, 360],
                transition: { duration: 2, repeat: Infinity }
              }}
              className="w-48 h-48 border-4 border-red-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`round-${i}`}
                  className="absolute w-4 h-4 bg-red-500 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 90}deg) translateX(92px) translateY(-50%)`
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        );
      case 'final':
        return (
          <motion.div className="flex flex-col items-center">
            <div className="text-lg font-bold mb-2">Hash Final</div>
            <div className="w-64 h-12 bg-yellow-500 rounded flex items-center justify-center text-white text-sm">
              {steps[5].example}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Fonctionnement de MD5 en Détail
        </h2>
        
        <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <label className="block text-lg font-medium mb-2">Message d'entrée pour la démonstration:</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Entrez un texte à hacher..."
          />
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
          >
            ← Précédent
          </button>
          <button
            onClick={handlePlayPause}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {isPlaying ? '⏸ Pause' : '▶ Lecture'}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
          >
            Suivant →
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-purple-300">{steps[currentStep].title}</h3>
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="px-4 py-2 bg-purple-500/30 rounded-lg hover:bg-purple-500/50 transition-colors"
              >
                {showTechnicalDetails ? 'Masquer les détails' : 'Voir les détails techniques'}
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed">{steps[currentStep].description}</p>
              
              {showTechnicalDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-purple-900/30 rounded-lg p-6 space-y-4"
                >
                  <h4 className="text-xl font-semibold text-purple-300">Détails Techniques</h4>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-purple-200">
                    {steps[currentStep].technicalDetails}
                  </pre>
                  
                  {steps[currentStep].example && (
                    <div className="mt-4">
                      <h5 className="text-lg font-semibold text-purple-300 mb-2">Exemple Concret</h5>
                      <code className="block bg-black/30 p-4 rounded-lg text-green-300">
                        {steps[currentStep].example}
                      </code>
                    </div>
                  )}
                </motion.div>
              )}

              {steps[currentStep].formula && (
                <div className="bg-black/30 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-300 mb-2">Formule Mathématique</h4>
                  <pre className="font-mono text-green-300">
                    {steps[currentStep].formula}
                  </pre>
                </div>
              )}

              <div className="mt-8 p-6 bg-purple-900/30 rounded-lg">
                {renderAnimation(steps[currentStep].animation)}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-between text-purple-300">
          <div>
            Étape {currentStep + 1} sur {steps.length}
          </div>
          <div className="w-64 bg-purple-900/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MD5Explanation;
