import React from 'react';
import SimpleAttackDemo from './components/SimpleAttackDemo';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <h1 className="text-3xl font-bold text-center">Démo Sécurité Blockchain</h1>
      </header>
      <main className="container mx-auto p-4">
        <SimpleAttackDemo />
      </main>
    </div>
  );
};

export default App;
