import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import HashLaboratory from './components/HashLaboratory';
import BlockchainStudio from './components/BlockchainStudio';
import SimpleAttackDemo from './components/SimpleAttackDemo';
import SecurityAnalytics from './components/SecurityAnalytics';
import MD5Explanation from './components/MD5Explanation';
import './App.css';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <motion.div
        className={`relative px-4 py-2 rounded-lg transition-colors ${
          isActive ? 'text-white' : 'text-purple-200 hover:text-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-purple-500/20 rounded-lg z-[-1]"
            layoutId="active-nav"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
        <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-6">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Blockchain Hash Explorer
          </h1>
        </header>

        <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10 p-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <NavLink to="/">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">🏠</span>
                  <span>Accueil</span>
                </div>
              </NavLink>
              
              <NavLink to="/hash-laboratory">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">🧪</span>
                  <span>Laboratoire de Hash</span>
                </div>
              </NavLink>
              
              <NavLink to="/blockchain-studio">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">⛓️</span>
                  <span>Studio Blockchain</span>
                </div>
              </NavLink>
              
              <NavLink to="/attack-demo">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">🛡️</span>
                  <span>Démo d'Attaque</span>
                </div>
              </NavLink>
              
              <NavLink to="/security-analytics">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">📊</span>
                  <span>Analyse de Sécurité</span>
                </div>
              </NavLink>
              
              <NavLink to="/md5-explanation">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">🔍</span>
                  <span>MD5 Expliqué</span>
                </div>
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<HashLaboratory />} />
            <Route path="/hash-laboratory" element={<HashLaboratory />} />
            <Route path="/blockchain-studio" element={<BlockchainStudio />} />
            <Route path="/attack-demo" element={<SimpleAttackDemo />} />
            <Route path="/security-analytics" element={<SecurityAnalytics />} />
            <Route path="/md5-explanation" element={<MD5Explanation />} />
          </Routes>
        </main>

        <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 p-8 mt-8">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-purple-300 mb-4">À Propos du Projet</h3>
                <p className="text-purple-200 mb-2">
                  Une démonstration interactive des fonctions de hachage et de la sécurité blockchain
                </p>
                <p className="text-purple-200">
                  Développé avec React, TypeScript et Tailwind CSS
                </p>
              </div>
              
              <div className="text-center md:text-right">
                <h3 className="text-xl font-bold text-purple-300 mb-4">Créé par</h3>
                <div className="space-y-2">
                  <div className="text-purple-200 text-lg">Ali Bougassaa</div>
                  <div className="text-purple-200 text-lg">Ilyes Zeghdallou</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-purple-800/30 text-center text-purple-200/60 text-sm">
              <p> 2024 Blockchain Hash Demo - Tous droits réservés</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
