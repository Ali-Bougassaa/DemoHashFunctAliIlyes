import React, { useState } from 'react';

interface Transaction {
  id: number;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  hash: string;
}

interface Character {
  name: string;
  role: 'honest' | 'attacker';
  balance: number;
  avatar: string;
}

const SimpleAttackDemo: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      from: "Alice",
      to: "Bob",
      amount: 100,
      timestamp: "10:00",
      hash: "abc123"
    },
    {
      id: 2,
      from: "Bob",
      to: "Charlie",
      amount: 50,
      timestamp: "10:05",
      hash: "def456"
    }
  ]);

  const [characters] = useState<Character[]>([
    {
      name: "Alice",
      role: "honest",
      balance: 500,
      avatar: "👩"
    },
    {
      name: "Eve",
      role: "attacker",
      balance: 100,
      avatar: "🦹‍♀️"
    }
  ]);

  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);
  const [modifiedAmount, setModifiedAmount] = useState<string>('');
  const [attackResult, setAttackResult] = useState<string>('');
  const [isAttacking, setIsAttacking] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Fonction simple de hachage
  const simpleHash = (data: string) => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const steps = [
    {
      title: "État Initial",
      description: "Alice a effectué une transaction de 100€ vers Bob. La transaction est sécurisée par un hash."
    },
    {
      title: "Tentative d'Eve",
      description: "Eve essaie de modifier le montant de la transaction d'Alice."
    },
    {
      title: "Vérification",
      description: "Le système vérifie l'intégrité de la blockchain en comparant les hashs."
    },
    {
      title: "Protection",
      description: "La modification est détectée car le nouveau hash ne correspond pas à l'original."
    }
  ];

  const attemptAttack = () => {
    if (selectedTransaction === null || !modifiedAmount) return;

    setIsAttacking(true);
    setCurrentStep(1);

    setTimeout(() => {
      // Montrer la tentative de modification
      const updatedTransactions = [...transactions];
      const targetTransaction = updatedTransactions[selectedTransaction];
      const originalHash = targetTransaction.hash;
      
      // Modification de la transaction
      targetTransaction.amount = parseFloat(modifiedAmount);
      const newHash = simpleHash(JSON.stringify({
        id: targetTransaction.id,
        from: targetTransaction.from,
        to: targetTransaction.to,
        amount: targetTransaction.amount,
        timestamp: targetTransaction.timestamp
      }));

      setCurrentStep(2);

      setTimeout(() => {
        // Vérification du hash
        if (newHash !== originalHash) {
          setAttackResult("Attaque détectée ! Le hash ne correspond pas à l'original.");
          targetTransaction.amount = transactions[selectedTransaction].amount;
          setCurrentStep(3);
        } else {
          setAttackResult("L'attaque a réussi (ce qui ne devrait pas arriver en réalité).");
        }

        setTransactions(updatedTransactions);
        setIsAttacking(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Simulation d'Attaque Interactive</h2>
      
      {/* Progression des étapes */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center ${
                index <= currentStep ? 'text-green-500' : 'text-gray-500'
              }`}
            >
              <div className="text-sm font-semibold">{step.title}</div>
              <div className="text-xs mt-1">{step.description}</div>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep + 1) * 25}%` }}
          />
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Transactions</h3>
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <div
                key={tx.id}
                className={`p-4 rounded-lg ${
                  selectedTransaction === index
                    ? 'bg-blue-900 border-2 border-blue-500'
                    : 'bg-gray-800'
                }`}
                onClick={() => setSelectedTransaction(index)}
              >
                <div className="flex justify-between items-center">
                  <span>
                    {tx.from} → {tx.to}
                  </span>
                  <span className="font-mono">{tx.amount}€</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Hash: {tx.hash}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panneau d'attaque */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Panneau d'Attaque</h3>
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Nouveau montant:
              </label>
              <input
                type="number"
                value={modifiedAmount}
                onChange={(e) => setModifiedAmount(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded"
                disabled={isAttacking}
              />
            </div>
            <button
              onClick={attemptAttack}
              disabled={selectedTransaction === null || !modifiedAmount || isAttacking}
              className={`w-full p-2 rounded ${
                isAttacking
                  ? 'bg-gray-600'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isAttacking ? 'Tentative en cours...' : 'Tenter une Modification'}
            </button>
            {attackResult && (
              <div className="mt-4 p-3 bg-gray-700 rounded">
                {attackResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAttackDemo;
