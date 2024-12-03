import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Server, ShieldCheck, RefreshCcw, Clock, Lock, Hash, Link, Database, Layers, ChevronRight, Coins, FileText } from 'lucide-react';

interface Block {
  index: number;
  timestamp: number;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
  reward: number;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

interface HashStep {
  text: string;
  value: string;
  icon: React.ReactNode;
}

const MINING_REWARD = 50;
const BLOCK_REWARD_HALVING_INTERVAL = 10;

const BlockchainHashDemo: React.FC = () => {
  const [data, setData] = useState<string>('');
  const [hashSteps, setHashSteps] = useState<HashStep[]>([]);
  const [blockchain, setBlockchain] = useState<Block[]>([]);
  const [miningDifficulty, setMiningDifficulty] = useState<number>(2);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [merkleRoot, setMerkleRoot] = useState<string>('');
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(100);
  const [selectedTab, setSelectedTab] = useState<'mine' | 'transactions' | 'analytics'>('mine');
  const [totalHashRate, setTotalHashRate] = useState<number>(0);
  const [blockReward, setBlockReward] = useState<number>(MINING_REWARD);
  const [hashCount, setHashCount] = useState<number>(0);

  // French translations
  const translations = {
    title: "Explorateur de Hachage Blockchain",
    subtitle: "Découvrez comment le hachage alimente la technologie blockchain",
    inputPlaceholder: "Entrez des données pour le bloc ou la transaction",
    miningTitle: "Statistiques de Minage",
    difficulty: "Difficulté",
    blocksMined: "Blocs Minés",
    pendingTransactions: "Transactions en Attente",
    merkleRoot: "Racine de Merkle",
    balance: "Solde du Portefeuille",
    reward: "Récompense de Bloc",
    hashRate: "Taux de Hachage",
    buttons: {
      mine: "Miner un Nouveau Bloc",
      addTransaction: "Ajouter à la Pool",
      verify: "Vérifier la Blockchain",
      adjustDifficulty: "Ajuster la Difficulté"
    },
    tabs: {
      mine: "Minage",
      transactions: "Transactions",
      analytics: "Analytiques"
    },
    analytics: {
      title: "Statistiques Détaillées",
      totalBlocks: "Total des Blocs",
      totalTransactions: "Total des Transactions",
      currentReward: "Récompense Actuelle",
      hashRate: "Taux de Hachage",
      history: "Historique des Blocs",
      coins: "coins",
      transactions: "transactions"
    },
    errors: {
      insufficientBalance: "Solde insuffisant pour la transaction",
      invalidTransaction: "Transaction invalide",
      miningError: "Erreur lors du minage"
    }
  };

  // Weak hash function for demonstration
  const weakHash = useCallback((input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) + hash) + input.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }, []);

  // SHA-256 hash function
  const sha256Hash = useCallback(async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }, []);

  // Calculate Merkle Root
  const calculateMerkleRoot = useCallback(async (transactions: string[]): Promise<string> => {
    if (transactions.length === 0) return '';
    
    let hashes = [...transactions];
    
    while (hashes.length > 1) {
      const newHashes = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = i + 1 < hashes.length ? hashes[i + 1] : left;
        const combined = left + right;
        const hash = await sha256Hash(combined);
        newHashes.push(hash);
      }
      hashes = newHashes;
    }
    
    return hashes[0];
  }, [sha256Hash]);

  // Add transaction validation
  const validateTransaction = useCallback((transaction: Transaction): boolean => {
    if (transaction.from === 'Wallet') {
      return walletBalance >= transaction.amount;
    }
    return true;
  }, [walletBalance]);

  // Add transaction to pending pool
  const addTransaction = useCallback((transaction: Transaction) => {
    if (validateTransaction(transaction)) {
      setPendingTransactions(prev => [...prev, transaction]);
      if (transaction.from === 'Wallet') {
        setWalletBalance(prev => prev - transaction.amount);
      }
    } else {
      setHashSteps(prev => [...prev, {
        text: 'Transaction Error',
        value: translations.errors.insufficientBalance,
        icon: <AlertTriangle className="text-red-500" />
      }]);
    }
  }, [validateTransaction, translations.errors.insufficientBalance]);

  // Mine a new block
  const mineBlock = useCallback(async (blockData: string) => {
    setIsMining(true);
    const previousBlock = blockchain[blockchain.length - 1] || null;
    const index = previousBlock ? previousBlock.index + 1 : 0;
    const previousHash = previousBlock ? previousBlock.hash : '0'.repeat(64);
    
    let nonce = 0;
    let hash = '';
    const timestamp = Date.now();
    
    while (true) {
      const blockString = `${index}${timestamp}${blockData}${previousHash}${nonce}`;
      hash = await sha256Hash(blockString);
      setHashCount(prev => prev + 1);
      
      if (hash.startsWith('0'.repeat(miningDifficulty))) {
        break;
      }
      nonce++;
      
      // Update UI every 1000 attempts
      if (nonce % 1000 === 0) {
        setHashSteps(prev => [...prev.slice(-4), {
          text: 'Mining Progress',
          value: `Nonce actuel: ${nonce}, Hash: ${hash}`,
          icon: <RefreshCcw className="text-yellow-500 animate-spin" />
        }]);
        // Allow UI to update
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    const newBlock: Block = {
      index,
      timestamp,
      data: blockData,
      previousHash,
      nonce,
      hash,
      reward: blockReward
    };
    
    setBlockchain(prev => [...prev, newBlock]);
    setWalletBalance(prev => prev + blockReward);
    setIsMining(false);
    return newBlock;
  }, [blockchain, miningDifficulty, blockReward, sha256Hash]);

  // Calculate block reward based on blockchain height
  useEffect(() => {
    const halvings = Math.floor(blockchain.length / BLOCK_REWARD_HALVING_INTERVAL);
    const newReward = MINING_REWARD / Math.pow(2, halvings);
    setBlockReward(newReward);
  }, [blockchain.length]);

  // Calculate hash rate
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalHashRate(hashCount);
      setHashCount(0);
    }, 1000);

    return () => clearInterval(interval);
  }, [hashCount]);

  // Verify blockchain integrity
  const verifyBlockchain = useCallback(async () => {
    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const previousBlock = blockchain[i - 1];
      
      // Verify hash connection
      if (currentBlock.previousHash !== previousBlock.hash) {
        return {
          valid: false,
          message: `Invalid hash link at block ${i}`
        };
      }
      
      // Verify block hash
      const blockString = `${currentBlock.index}${currentBlock.timestamp}${currentBlock.data}${currentBlock.previousHash}${currentBlock.nonce}`;
      const calculatedHash = await sha256Hash(blockString);
      if (calculatedHash !== currentBlock.hash) {
        return {
          valid: false,
          message: `Invalid block hash at block ${i}`
        };
      }
    }
    
    return {Simule une tentative de dépenser les mêmes coins deux fois :
    
    A. Fonctionnement :
       1. L'attaquant tente de créer une transaction double
       2. Le système :
          - Détecte la tentative
          - Compare avec l'historique
          - Rejette la transaction
    
    B. Protection :
       - Vérification des transactions
       - Consensus du réseau
       - Historique immuable
      valid: true,
      message: 'Blockchain is valid'
    };
  }, [blockchain, sha256Hash]);

  // Blockchain interactions
  const blockchainInteractions = [
    {
      title: translations.buttons.mine,
      description: 'Add current data as a new block to the chain',
      action: async () => {
        if (!data) return;
        const newBlock = await mineBlock(data);
        setHashSteps(prev => [...prev, {
          text: 'New Block Mined',
          value: `Block #${newBlock.index} - Hash: ${newBlock.hash}`,
          icon: <Database className="text-green-500" />
        }]);
      }
    },
    {
      title: translations.buttons.addTransaction,
      description: 'Add current data as a pending transaction',
      action: () => {
        if (!data) return;
        const transaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          from: 'Wallet',
          to: 'Recipient',
          amount: 10,
          timestamp: Date.now()
        };
        addTransaction(transaction);
        calculateMerkleRoot(pendingTransactions.map(tx => tx.id)).then(root => setMerkleRoot(root));
      }
    },
    {
      title: translations.buttons.verify,
      description: 'Check the integrity of the entire chain',
      action: async () => {
        const result = await verifyBlockchain();
        setHashSteps(prev => [...prev, {
          text: 'Blockchain Verification',
          value: result.message,
          icon: result.valid ? 
            <ShieldCheck className="text-green-500" /> : 
            <AlertTriangle className="text-red-500" />
        }]);
      }
    },
    {
      title: translations.buttons.adjustDifficulty,
      description: 'Change the number of leading zeros required',
      action: () => {
        setMiningDifficulty(prev => Math.min(prev + 1, 5));
        setHashSteps(prev => [...prev, {
          text: 'Difficulty Adjusted',
          value: `New difficulty: ${miningDifficulty + 1} leading zeros`,
          icon: <Layers className="text-purple-500" />
        }]);
      }
    }
  ];

  const BlockchainVisualizer: React.FC = () => (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold">{translations.miningTitle}</h3>
      <div className="flex flex-nowrap overflow-x-auto p-4 space-x-4">
        {blockchain.map((block, index) => (
          <div key={block.hash} className="flex-none">
            <div className="bg-white p-4 rounded-lg shadow-md w-64">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">Block #{block.index}</span>
                <Clock className="text-gray-500 w-4 h-4" />
              </div>
              <div className="space-y-2 text-sm">
                <p className="truncate">Data: {block.data}</p>
                <p className="truncate">Hash: {block.hash.substring(0, 15)}...</p>
                <p className="truncate">Previous: {block.previousHash.substring(0, 15)}...</p>
                <p>Nonce: {block.nonce}</p>
                <p>Reward: {block.reward} coins</p>
              </div>
            </div>
            {index < blockchain.length - 1 && (
              <div className="flex justify-center my-2">
                <ChevronRight className="text-blue-500" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const MerkleTreeVisualizer: React.FC = () => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">{translations.pendingTransactions}</h3>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="space-y-2">
          <p className="font-medium">{translations.pendingTransactions}: {pendingTransactions.length}</p>
          <div className="max-h-32 overflow-y-auto">
            {pendingTransactions.map((tx, index) => (
              <div key={tx.id} className="text-sm py-1 border-b">
                <p>Transaction #{index + 1}</p>
                <p className="text-xs text-gray-600">
                  De: {tx.from} → À: {tx.to}
                </p>
                <p className="text-xs text-gray-600">
                  Montant: {tx.amount} coins
                </p>
              </div>
            ))}
          </div>
          {merkleRoot && (
            <div className="mt-4">
              <p className="font-medium">{translations.merkleRoot}:</p>
              <p className="text-sm font-mono break-all">{merkleRoot}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const WalletVisualizer: React.FC = () => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">{translations.balance}</h3>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">{translations.balance}</p>
            <p className="text-2xl font-bold">{walletBalance} coins</p>
          </div>
          <Coins className="text-yellow-500 w-8 h-8" />
        </div>
      </div>
    </div>
  );

  const AnalyticsVisualizer: React.FC = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">{translations.analytics.title}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">{translations.analytics.totalBlocks}</p>
            <p className="text-2xl font-bold">{blockchain.length}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">{translations.analytics.totalTransactions}</p>
            <p className="text-2xl font-bold">{pendingTransactions.length}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">{translations.analytics.currentReward}</p>
            <p className="text-2xl font-bold">{blockReward}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">{translations.analytics.hashRate}</p>
            <p className="text-2xl font-bold">{totalHashRate} H/s</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">{translations.analytics.history}</h3>
        <div className="space-y-2">
          {blockchain.map((block, index) => (
            <div key={block.hash} className="p-2 bg-gray-100 rounded flex items-center justify-between">
              <div>
                <p className="font-medium">Block #{block.index}</p>
                <p className="text-sm text-gray-600">
                  {new Date(block.timestamp).toLocaleString('fr-FR')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{block.reward} {translations.analytics.coins}</p>
                <p className="text-sm text-gray-600">
                  {translations.analytics.transactions}: {
                    pendingTransactions.filter(tx => tx.timestamp <= block.timestamp).length
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TabNavigation: React.FC = () => (
    <div className="flex space-x-4 mb-6">
      {Object.entries(translations.tabs).map(([key, label]) => (
        <button
          key={key}
          onClick={() => setSelectedTab(key as 'mine' | 'transactions' | 'analytics')}
          className={`px-4 py-2 rounded-lg transition ${
            selectedTab === key
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const TransactionForm: React.FC = () => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Nouvelle Transaction</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const transaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          from: 'Wallet',
          to: data || 'Recipient',
          amount: 10,
          timestamp: Date.now()
        };
        addTransaction(transaction);
        setData('');
      }}>
        <div className="space-y-4">
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Adresse du destinataire"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Envoyer la Transaction
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="p-8 bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-4">{translations.title}</h1>
          <p className="text-gray-600">{translations.subtitle}</p>
        </div>

        <TabNavigation />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {selectedTab === 'mine' && (
              <>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <input 
                    type="text"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder={translations.inputPlaceholder}
                    className="w-full p-2 border rounded mb-4"
                    disabled={isMining}
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {blockchainInteractions.map((interaction, index) => (
                      <button
                        key={index}
                        onClick={interaction.action}
                        disabled={isMining}
                        className={`p-3 rounded transition ${
                          isMining 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {interaction.title}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {hashSteps.map((step, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg shadow">
                        <div className="flex items-center mb-2">
                          {step.icon}
                          <h3 className="ml-2 font-semibold">{step.text}</h3>
                        </div>
                        <p className="text-sm font-mono break-all">{step.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <MerkleTreeVisualizer />
                <WalletVisualizer />
              </>
            )}
            
            {selectedTab === 'transactions' && <TransactionForm />}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {selectedTab === 'mine' && (
              <>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">{translations.miningTitle}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-gray-600">{translations.difficulty}</p>
                      <p className="text-lg font-semibold">{miningDifficulty} zeros</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-gray-600">{translations.blocksMined}</p>
                      <p className="text-lg font-semibold">{blockchain.length}</p>
                    </div>
                  </div>
                </div>
                <BlockchainVisualizer />
              </>
            )}
            
            {selectedTab === 'analytics' && <AnalyticsVisualizer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainHashDemo;
