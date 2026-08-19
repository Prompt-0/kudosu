import React, { useState, useEffect } from 'react';
import { MoveAction } from '../../types/sudoku';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface ReplayScrubberProps {
  history: MoveAction[];
  currentIndex: number;
  onSeek: (index: number) => void;
}

export const ReplayScrubber: React.FC<ReplayScrubberProps> = ({ history, currentIndex, onSeek }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentIndex < history.length - 1) {
          onSeek(currentIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, 500 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, history.length, speed, onSeek]);

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-lg w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
        <span>Timeline Replay Scrubber</span>
        <span className="font-mono text-cyan-400">
          Move {currentIndex + 1} of {history.length}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={-1}
        max={history.length - 1}
        value={currentIndex}
        onChange={e => onSeek(parseInt(e.target.value, 10))}
        className="w-full accent-cyan-500 cursor-pointer"
      />

      {/* Playback Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSeek(-1)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset to Start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSeek(Math.max(-1, currentIndex - 1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Step Back"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
            title={isPlaying ? 'Pause' : 'Play Replay'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onSeek(Math.min(history.length - 1, currentIndex + 1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1">
          {[1, 2, 5].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s as 1 | 2 | 5)}
              className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-all ${
                speed === s ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
