import React, { useState, useEffect } from 'react';
import { Trophy, Gift, Volume2, VolumeX } from 'lucide-react';

const prizes = [
  { id: 1, name: 'Osito', color: '#8B4513' },
  { id: 2, name: 'Pelota', color: '#FF4444' },
  { id: 3, name: 'Muñeca', color: '#FF69B4' },
  { id: 4, name: 'Robot', color: '#4A90E2' },
  { id: 5, name: 'Peluche', color: '#FFD700' }
];

const ClawMachineGame = () => {
  const [clawPosition, setClawPosition] = useState(50);
  const [isDropping, setIsDropping] = useState(false);
  const [score, setScore] = useState(15);
  const [highScore, setHighScore] = useState(15);
  const [sound, setSound] = useState(true);
  const [gameState, setGameState] = useState('ready');
  const [prize, setPrize] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  const moveClaw = (direction) => {
    if (gameState !== 'ready') return;
    
    setClawPosition(prev => {
      const newPos = direction === 'left' 
        ? Math.max(10, prev - 5)
        : Math.min(90, prev + 5);
      return newPos;
    });
  };

  const dropClaw = async () => {
    if (gameState !== 'ready') return;
    
    setGameState('dropping');
    setIsDropping(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = Math.random() < 0.7;
    if (success) {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setPrize(randomPrize);
      setShowMessage(true);
      setScore(prev => prev + 1);
      setHighScore(prev => Math.max(prev, score + 1));
      
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsDropping(false);
    setPrize(null);
    setGameState('ready');
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        moveClaw('left');
      } else if (e.key === 'ArrowRight') {
        moveClaw('right');
      } else if (e.key === ' ') {
        dropClaw();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  return (
    <div className="w-full h-screen bg-slate-900 p-4 flex flex-col">
      {/* Panel Superior */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-white">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <div>
            <div className="text-sm opacity-60">HIGH SCORE</div>
            <div className="text-2xl font-bold">{highScore}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-white">
          <Gift className="w-8 h-8 text-pink-400" />
          <div>
            <div className="text-sm opacity-60">SCORE</div>
            <div className="text-2xl font-bold">{score}</div>
          </div>
        </div>

        <button 
          onClick={() => setSound(!sound)}
          className="text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {sound ? 
            <Volume2 className="w-8 h-8" /> : 
            <VolumeX className="w-8 h-8" />
          }
        </button>
      </div>

      {/* Área de Juego */}
      <div className="flex-1 relative bg-slate-800 rounded-lg mb-6 overflow-hidden border border-slate-700">
        {/* Garra */}
        <div 
          className="absolute top-0 transition-all duration-200 z-10"
          style={{ 
            left: `${clawPosition}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="w-0.5 bg-white" style={{
            height: isDropping ? '400px' : '40px',
            transition: 'height 1s ease-in-out'
          }} />
          <div className="flex">
            <div className="w-3 h-3 bg-white transform rotate-45" />
            <div className="w-3 h-3 bg-white transform rotate-45" />
          </div>
        </div>

        {/* Premios en la parte inferior */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-16">
          {prizes.map((p) => (
            <div
              key={p.id}
              className="w-16 h-16 rounded transition-transform"
              style={{ backgroundColor: p.color }}
            />
          ))}
        </div>

        {/* Mensaje de Premio */}
        {showMessage && prize && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-slate-200 text-slate-900 px-6 py-3 rounded-lg shadow-lg border-2 border-white">
              <div className="text-lg font-bold text-center">¡Obtuviste un {prize.name}!</div>
            </div>
          </div>
        )}
      </div>

      {/* Panel de Controles */}
      <div className="text-white">
        <div className="text-center text-sm opacity-60 mb-4">CONTROLES</div>
        <div className="flex justify-center items-center gap-4">
          <button 
            onClick={() => moveClaw('left')}
            className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded hover:bg-slate-700 transition-colors"
          >
            ←
          </button>
          <button 
            onClick={() => moveClaw('right')}
            className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded hover:bg-slate-700 transition-colors"
          >
            →
          </button>
          <button 
            onClick={dropClaw}
            className="px-4 h-10 flex items-center justify-center bg-slate-800 rounded hover:bg-slate-700 transition-colors"
            disabled={gameState !== 'ready'}
          >
            ESPACIO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClawMachineGame;