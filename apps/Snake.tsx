import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppProps } from '../types';
import { Play, RotateCw } from 'lucide-react';

const CELL_SIZE = 20;
const GRID_SIZE = 20; // 20x20 grid
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

const Snake: React.FC<AppProps> = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  // Using ref for direction to avoid closure staleness in interval
  const directionRef = useRef({ x: 1, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((): Point => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    if (containerRef.current) containerRef.current.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === " ") {
          setIsPaused(prev => !prev);
          return;
      }

      const currentDir = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collisions
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          setFood(generateFood());
          // Don't pop tail, so it grows
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 5) * 10);
    const gameInterval = setInterval(moveSnake, speed);

    return () => clearInterval(gameInterval);
  }, [food, gameOver, isPaused, score, generateFood]); // directionRef is mutable, doesn't need dep

  return (
    <div 
        className="h-full flex flex-col items-center justify-center bg-neutral-900 text-white font-mono outline-none" 
        tabIndex={0}
        ref={containerRef}
        onClick={() => containerRef.current?.focus()}
    >
      <div className="mb-4 flex gap-8 text-xl">
        <div className="text-green-400 font-bold">SCORE: {score}</div>
        <div className="text-gray-400">HIGH: {highScore}</div>
      </div>

      <div 
        className="relative bg-black border-4 border-neutral-700 shadow-2xl"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {/* Grid lines (optional, for aesthetics) */}
        <div 
            className="absolute inset-0 pointer-events-none opacity-10" 
            style={{ 
                backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
            }}
        />

        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"
          style={{
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
            left: food.x * CELL_SIZE + 2,
            top: food.y * CELL_SIZE + 2,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-green-400 z-10' : 'bg-green-600'}`}
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              borderRadius: index === 0 ? '4px' : '2px'
            }}
          >
              {index === 0 && (
                  <>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full" />
                    <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full" />
                  </>
              )}
          </div>
        ))}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <h2 className="text-4xl text-red-500 font-bold mb-4">GAME OVER</h2>
            <button onClick={resetGame} className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition font-bold">
                <RotateCw size={20} /> Retry
            </button>
          </div>
        )}
        
        {!gameOver && isPaused && (
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-2xl text-white font-bold animate-pulse">PAUSED</div>
             </div>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center">
        Use Arrow Keys to Move • Space to Pause
      </div>
    </div>
  );
};

export default Snake;