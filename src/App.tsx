import React, { useState } from 'react';
import HashLaboratory from './components/HashLaboratory';
import BlockchainStudio from './components/BlockchainStudio';
import SimpleAttackDemo from './components/SimpleAttackDemo';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lab');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <h1 className="text-3xl font-bold text-center">Démo Sécurité Blockchain</h1>
      </header>

      <nav className="bg-gray-800 p-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setActiveTab('lab')}
            className={`px-4 py-2 rounded ${activeTab === 'lab' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Laboratoire de Hachage
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded ${activeTab === 'studio' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Blockchain Studio
          </button>
          <button
            onClick={() => setActiveTab('attack')}
            className={`px-4 py-2 rounded ${activeTab === 'attack' ? 'bg-red-600' : 'bg-gray-700'}`}
          >
            Simulateur d'Attaque
          </button>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        {activeTab === 'lab' && <HashLaboratory />}
        {activeTab === 'studio' && <BlockchainStudio />}
        {activeTab === 'attack' && <SimpleAttackDemo />}
      </main>
    </div>
  );
};

export default App;
