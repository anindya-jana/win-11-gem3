import React, { useState, useEffect } from 'react';
import { AppProps } from '../types';
import { Bomb, Flag, RefreshCw, Smile, Frown, Meh } from 'lucide-react';

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

const ROWS = 10;
const COLS = 10;
const MINES = 15;

const Minesweeper: React.FC<AppProps> = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let interval: any;
    if (gameStarted && !gameOver && !win) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, win]);

  const initGame = () => {
    // Create empty board
    const newBoard: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborCount: 0,
        });
      }
      newBoard.push(row);
    }

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (r + dr >= 0 && r + dr < ROWS && c + dc >= 0 && c + dc < COLS) {
                if (newBoard[r + dr][c + dc].isMine) count++;
              }
            }
          }
          newBoard[r][c].neighborCount = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setWin(false);
    setTimer(0);
    setGameStarted(false);
  };

  const revealCell = (r: number, c: number) => {
    if (gameOver || win || board[r][c].isFlagged || board[r][c].isRevealed) return;

    if (!gameStarted) setGameStarted(true);

    const newBoard = [...board];
    
    if (newBoard[r][c].isMine) {
      // Game Over
      newBoard[r][c].isRevealed = true;
      setBoard(newBoard);
      setGameOver(true);
      revealAllMines(newBoard);
    } else {
      // Flood fill
      const stack = [[r, c]];
      while (stack.length > 0) {
        const [currR, currC] = stack.pop()!;
        if (newBoard[currR][currC].isRevealed) continue;
        
        newBoard[currR][currC].isRevealed = true;

        if (newBoard[currR][currC].neighborCount === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = currR + dr;
              const nc = currC + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !newBoard[nr][nc].isRevealed && !newBoard[nr][nc].isFlagged) {
                stack.push([nr, nc]);
              }
            }
          }
        }
      }
      setBoard(newBoard);
      checkWin(newBoard);
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || board[r][c].isRevealed) return;
    if (!gameStarted) setGameStarted(true);

    const newBoard = [...board];
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  };

  const revealAllMines = (currentBoard: Cell[][]) => {
    const newBoard = [...currentBoard];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newBoard[r][c].isMine) newBoard[r][c].isRevealed = true;
      }
    }
    setBoard(newBoard);
  };

  const checkWin = (currentBoard: Cell[][]) => {
    let unrevealedSafeCells = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!currentBoard[r][c].isMine && !currentBoard[r][c].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }
    if (unrevealedSafeCells === 0) {
      setWin(true);
      setGameOver(true);
    }
  };

  const getCellColor = (count: number) => {
    switch (count) {
      case 1: return 'text-blue-600';
      case 2: return 'text-green-600';
      case 3: return 'text-red-600';
      case 4: return 'text-purple-800';
      case 5: return 'text-red-800';
      case 6: return 'text-teal-600';
      case 7: return 'text-black';
      case 8: return 'text-gray-600';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#c0c0c0] p-4 select-none border-4 border-[#f0f0f0] border-r-[#808080] border-b-[#808080]">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-[350px] bg-[#c0c0c0] border-b-2 border-[#808080] border-r-2 border-white border-l-2 border-[#808080] border-t-2 mb-3 p-2 shadow-[inset_2px_2px_0_#808080]">
         <div className="bg-black text-red-600 font-mono text-2xl px-2 py-0.5 border-2 border-[#808080] border-b-white border-r-white">
             {String(Math.max(0, MINES - board.flat().filter(c => c.isFlagged).length)).padStart(3, '0')}
         </div>
         
         <button 
            onClick={initGame}
            className="w-10 h-10 flex items-center justify-center bg-[#c0c0c0] border-2 border-white border-b-[#808080] border-r-[#808080] active:border-[#808080] active:border-b-white active:border-r-white active:translate-y-[1px]"
         >
             {win ? <div className="text-yellow-500"><Smile size={24} fill="currentColor" className="text-black"/></div> : 
              gameOver ? <div className="text-yellow-500"><Frown size={24} fill="currentColor" className="text-black"/></div> : 
              <div className="text-yellow-500"><Smile size={24} fill="currentColor" className="text-black"/></div>}
         </button>

         <div className="bg-black text-red-600 font-mono text-2xl px-2 py-0.5 border-2 border-[#808080] border-b-white border-r-white">
             {String(Math.min(999, timer)).padStart(3, '0')}
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-10 gap-0 bg-[#808080] border-4 border-[#808080] border-r-white border-b-white border-t-[#808080] border-l-[#808080] shadow-lg">
        {board.map((row, rIndex) => 
          row.map((cell, cIndex) => (
            <button
              key={`${rIndex}-${cIndex}`}
              onClick={() => revealCell(rIndex, cIndex)}
              onContextMenu={(e) => toggleFlag(e, rIndex, cIndex)}
              className={`w-8 h-8 flex items-center justify-center text-sm font-bold
                ${cell.isRevealed 
                    ? 'bg-[#c0c0c0] border border-[#808080]/20' 
                    : 'bg-[#c0c0c0] border-2 border-white border-b-[#808080] border-r-[#808080]'
                }
              `}
            >
              {cell.isRevealed ? (
                cell.isMine ? <Bomb size={20} className="text-black fill-black" /> : 
                cell.neighborCount > 0 ? <span className={getCellColor(cell.neighborCount)}>{cell.neighborCount}</span> : ''
              ) : (
                cell.isFlagged ? <Flag size={18} className="text-red-600 fill-red-600" /> : ''
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Minesweeper;