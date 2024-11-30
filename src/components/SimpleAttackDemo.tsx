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
      const newTransactions = [...transactions];
      const originalAmount = newTransactions[selectedTransaction].amount;
      newTransactions[selectedTransaction].amount = parseInt(modifiedAmount);
      setTransactions(newTransactions);
      setCurrentStep(2);

      setTimeout(() => {
        setCurrentStep(3);
        setAttackResult(`
          Tentative de Fraude Détectée !
          Eve a essayé de modifier la transaction :
          - Montant original : ${originalAmount}€
          - Montant frauduleux : ${modifiedAmount}€
          Le système a rejeté la modification car le hash ne correspond plus !
        `);

        setTimeout(() => {
          newTransactions[selectedTransaction].amount = originalAmount;
          setTransactions(newTransactions);
          setIsAttacking(false);
          setCurrentStep(0);
        }, 3000);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Simulation d'Attaque Interactive</h2>

      {/* Personnages */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {characters.map((character) => (
          <div
            key={character.name}
            className={`p-4 rounded ${
              character.role === 'attacker' ? 'bg-red-900' : 'bg-blue-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{character.avatar}</span>
              <div>
                <h3 className="text-xl font-bold">{character.name}</h3>
                <p>Balance: {character.balance}€</p>
                <p className="text-sm">
                  {character.role === 'attacker' ? 'Attaquante' : 'Utilisatrice honnête'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Étapes */}
      <div className="mb-6">
        <h3 className="text-xl mb-4">Progression de la Simulation</h3>
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-3 rounded ${
                currentStep === index ? 'bg-blue-600' : 'bg-gray-800'
              }`}
            >
              <h4 className="font-bold">{step.title}</h4>
              <p className="text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="mb-6">
        <h3 className="text-xl mb-4">Transactions dans la Blockchain</h3>
        <div className="grid gap-4">
          {transactions.map((tx, index) => (
            <div
              key={tx.id}
              className={`p-4 rounded cursor-pointer ${
                selectedTransaction === index 
                  ? 'bg-red-900' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedTransaction(index)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p>De: {tx.from} À: {tx.to}</p>
                  <p className="text-2xl font-bold">{tx.amount}€</p>
                  <p className="text-sm">Heure: {tx.timestamp}</p>
                </div>
                <div className="text-sm">
                  <p>Hash: {tx.hash}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interface d'attaque */}
      {selectedTransaction !== null && (
        <div className="mb-6">
          <h3 className="text-xl mb-4">Tentative de Modification (Eve)</h3>
          <input
            type="number"
            value={modifiedAmount}
            onChange={(e) => setModifiedAmount(e.target.value)}
            placeholder="Nouveau montant..."
            className="w-full p-2 mb-4 bg-gray-800 rounded"
          />
          <button
            onClick={attemptAttack}
            disabled={isAttacking}
            className={`w-full p-2 rounded ${
              isAttacking 
                ? 'bg-gray-600' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAttacking ? 'Tentative en cours...' : 'Modifier la Transaction'}
          </button>
        </div>
      )}

      {/* Résultat */}
      {attackResult && (
        <div className="p-4 bg-gray-800 rounded whitespace-pre-line">
          <h3 className="text-xl mb-2">Résultat de la Tentative :</h3>
          <p>{attackResult}</p>
        </div>
      )}
    </div>
  );
};

export default SimpleAttackDemo;
