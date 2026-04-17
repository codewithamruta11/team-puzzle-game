export default function TeamMeetingPuzzleGameApp() {
  const { useEffect, useMemo, useState } = React;

  const questions = useMemo(() => ({
    easy: Array.from({ length: 30 }, (_, i) => ({ q: `Easy Puzzle ${i + 1}`, a: `Answer ${i + 1}` })),
    medium: Array.from({ length: 30 }, (_, i) => ({ q: `Medium Puzzle ${i + 1}`, a: `Answer ${i + 1}` })),
    hard: Array.from({ length: 30 }, (_, i) => ({ q: `Hard Puzzle ${i + 1}`, a: `Answer ${i + 1}` }))
  }), []);

  const [screen, setScreen] = useState('intro');
  const [level, setLevel] = useState('easy');
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [running, setRunning] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [scores, setScores] = useState({ team1: 0, team2: 0, team3: 0 });

  const currentQuestions = questions[level] || [];
  const currentQuestion = currentQuestions[index];

  useEffect(() => {
    let timer;
    if (running && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((t) => t - 1);
        if (tickingSound) tickingSound();
      }, 1000);
    }
    if (timeLeft === 0) setRunning(false);
    return () => clearTimeout(timer);
  }, [running, timeLeft]);

  const playBeep = (freq = 700, duration = 0.15) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = 0.03;
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const tickingSound = () => playBeep(900, 0.08);
  const celebrationSound = () => playBeep(1200, 0.25);

  const startGame = (lvl) => {
    setLevel(lvl);
    setScreen('game');
    setIndex(0);
    setTimeLeft(20);
    setShowAnswer(false);
    setRunning(true);
  };

  const revealAnswer = () => {
    setShowAnswer(true);
    celebrationSound();
  };

  const addPoint = (team) => {
    setScores((s) => ({ ...s, [team]: s[team] + 1 }));
  };

  const nextQuestion = () => {
    if (index < currentQuestions.length - 1) {
      setIndex(index + 1);
      setTimeLeft(20);
      setShowAnswer(false);
      setRunning(true);
    } else {
      setScreen('winner');
    }
  };

  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  if (screen === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white flex items-center justify-center p-8">
        <div className="bg-white/10 rounded-3xl p-10 text-center max-w-3xl shadow-2xl">
          <h1 className="text-5xl font-bold mb-4">🏆 Company Team Puzzle Championship</h1>
          <p className="text-xl mb-6">Welcome to the live game show experience.</p>
          <button onClick={() => setScreen('rules')} className="px-8 py-4 bg-white text-blue-900 rounded-2xl font-bold">Start Show</button>
        </div>
      </div>
    );
  }

  if (screen === 'rules') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-10 max-w-4xl shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">📋 Rules & Level Select</h2>
          <p className="mb-4">Each team answers in reverse order. 20 seconds per question.</p>
          <div className="flex gap-4">
            <button onClick={() => startGame('easy')} className="px-6 py-3 bg-green-600 text-white rounded-2xl">Easy</button>
            <button onClick={() => startGame('medium')} className="px-6 py-3 bg-yellow-500 text-white rounded-2xl">Medium</button>
            <button onClick={() => startGame('hard')} className="px-6 py-3 bg-red-600 text-white rounded-2xl">Hard</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'winner') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <h1 className="text-5xl font-bold mb-4">🥇 Winner</h1>
          <p className="text-3xl">{winner?.[0]?.toUpperCase()} with {winner?.[1]} points</p>
          <button onClick={() => setScreen('intro')} className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-2xl">Restart Event</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-2xl p-8 aspect-video border border-slate-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold tracking-tight">🎯 Team Puzzle Championship</h2>
          <div className="text-6xl font-bold tabular-nums">⏱ {timeLeft}</div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-3xl border shadow-sm text-2xl font-semibold bg-slate-50">🏆 Team 1: {scores.team1}</div>
          <div className="p-6 rounded-3xl border shadow-sm text-2xl font-semibold bg-slate-50">🏆 Team 2: {scores.team2}</div>
          <div className="p-6 rounded-3xl border shadow-sm text-2xl font-semibold bg-slate-50">🏆 Team 3: {scores.team3}</div>
        </div>

        <div className="border rounded-[2rem] p-14 text-center min-h-[340px] flex flex-col justify-center shadow-inner bg-gradient-to-br from-white to-slate-50">
          <p className="text-lg text-slate-500 mb-4">Here is your question</p>
          <h3 className="text-5xl leading-tight font-bold">{currentQuestion?.q}</h3>
          {showAnswer && <p className="mt-8 text-4xl font-bold text-green-600">✅ {currentQuestion?.a}</p>}
        </div>

        <div className="flex gap-4 flex-wrap justify-center mt-10">
          <button onClick={revealAnswer} className="px-5 py-3 bg-indigo-600 text-white rounded-2xl">Reveal Answer</button>
          <button onClick={() => addPoint('team1')} className="px-5 py-3 bg-blue-600 text-white rounded-2xl">+ Team 1</button>
          <button onClick={() => addPoint('team2')} className="px-5 py-3 bg-blue-600 text-white rounded-2xl">+ Team 2</button>
          <button onClick={() => addPoint('team3')} className="px-5 py-3 bg-blue-600 text-white rounded-2xl">+ Team 3</button>
          <button onClick={nextQuestion} className="px-5 py-3 bg-green-600 text-white rounded-2xl">Next</button>
        </div>
      </div>
    </div>
  );
}
