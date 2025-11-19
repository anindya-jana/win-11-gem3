import React, { useState } from 'react';
import { AppProps } from '../types';

const TicTacToe: React.FC<AppProps> = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : board.every(Boolean)
    ? "Draw!"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  function handleClick(i: number) {
    if (winner || board[i]) return;
    const nextBoard = board.slice();
    nextBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-100 text-slate-800 p-4">
      <div className="text-xl font-bold mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-2 bg-slate-300 p-2 rounded-lg">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-16 h-16 bg-white text-2xl font-bold flex items-center justify-center rounded shadow-sm hover:bg-slate-50 focus:outline-none"
          >
            {cell}
          </button>
        ))}
      </div>
      <button
        onClick={() => { setBoard(Array(9).fill(null)); setXIsNext(true); }}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Restart Game
      </button>
    </div>
  );
};

function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToe;
