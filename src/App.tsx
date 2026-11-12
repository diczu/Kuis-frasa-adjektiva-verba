/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sun, 
  Moon, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Home, 
  Volume2, 
  VolumeX,
  Play
} from 'lucide-react';

interface AdverbItem {
  id: string;
  word: string;
  cat: 'waktu' | 'modalitas' | 'kualitas' | 'perbandingan' | 'frekuentatif' | 'negasi';
}

const DATA_ADVERBIA: AdverbItem[] = [
  { id: 'akan', word: 'akan', cat: 'waktu' },
  { id: 'sedang', word: 'sedang', cat: 'waktu' },
  { id: 'sudah', word: 'sudah', cat: 'waktu' },
  { id: 'belum', word: 'belum', cat: 'waktu' },
  { id: 'ingin', word: 'ingin', cat: 'modalitas' },
  { id: 'harus', word: 'harus', cat: 'modalitas' },
  { id: 'perlu', word: 'perlu', cat: 'modalitas' },
  { id: 'enggan', word: 'enggan', cat: 'modalitas' },
  { id: 'sangat', word: 'sangat', cat: 'kualitas' },
  { id: 'amat', word: 'amat', cat: 'kualitas' },
  { id: 'sekali', word: 'sekali', cat: 'kualitas' },
  { id: 'terlalu', word: 'terlalu', cat: 'kualitas' },
  { id: 'lebih', word: 'lebih', cat: 'perbandingan' },
  { id: 'kurang', word: 'kurang', cat: 'perbandingan' },
  { id: 'paling', word: 'paling', cat: 'perbandingan' },
  { id: 'sering', word: 'sering', cat: 'frekuentatif' },
  { id: 'jarang', word: 'jarang', cat: 'frekuentatif' },
];

interface Category {
  id: string;
  title: string;
  subtitle?: string;
}

const CATEGORIES: Category[] = [
  { id: 'negasi', title: 'Negasi', subtitle: 'Penyangkalan (tidak)' },
  { id: 'waktu', title: 'Waktu / Keaspekan', subtitle: 'Aspek temporal' },
  { id: 'modalitas', title: 'Modalitas', subtitle: 'Keinginan & keharusan' },
  { id: 'kualitas', title: 'Kualitas', subtitle: 'Khusus adjektiva' },
  { id: 'perbandingan', title: 'Perbandingan', subtitle: 'Derajat perbandingan' },
  { id: 'frekuentatif', title: 'Frekuentatif', subtitle: 'Tingkat kekerapan' },
];

interface Question {
  type: string;
  soal: string;
  jawaban: string;
  pengecoh: string[];
  penjelasan: string;
}

const DATA_SOAL_RONDE_2: Question[] = [
  {
    type: 'semakna',
    soal: 'akan makan',
    jawaban: 'sudah pintar',
    pengecoh: ['tidak makan', 'harus makan', 'lebih rajin'],
    penjelasan: '<strong class="text-blue-600 dark:text-blue-400">Akan</strong> dan <strong class="text-blue-600 dark:text-blue-400">sudah</strong> sama-sama menunjukkan kelompok makna <strong class="text-rose-600 dark:text-rose-400">Waktu/Keaspekan</strong>. Walaupun intinya berbeda (makan & pintar), kedua frasa ini semakna.',
  },
  {
    type: 'semakna',
    soal: 'sangat cantik',
    jawaban: 'mahal sekali',
    pengecoh: ['sangat pandai', 'kurang cantik', 'sering menangis'],
    penjelasan: '<strong class="text-blue-600 dark:text-blue-400">Sangat</strong> dan <strong class="text-blue-600 dark:text-blue-400">sekali</strong> sama-sama menunjukkan kelompok makna <strong class="text-rose-600 dark:text-rose-400">Kualitas</strong> pada adjektiva.',
  },
  {
    type: 'semakna',
    soal: 'harus bekerja',
    jawaban: 'ingin kaya',
    pengecoh: ['sedang bekerja', 'tidak bekerja', 'paling kaya'],
    penjelasan: '<strong class="text-blue-600 dark:text-blue-400">Harus</strong> dan <strong class="text-blue-600 dark:text-blue-400">ingin</strong> sama-sama menunjukkan kelompok makna <strong class="text-rose-600 dark:text-rose-400">Modalitas</strong>.',
  },
  {
    type: 'semakna',
    soal: 'paling kuat',
    jawaban: 'kurang tinggi',
    pengecoh: ['paling lambat', 'sangat kuat', 'jarang tinggi'],
    penjelasan: '<strong class="text-blue-600 dark:text-blue-400">Paling</strong> dan <strong class="text-blue-600 dark:text-blue-400">kurang</strong> sama-sama menunjukkan makna <strong class="text-rose-600 dark:text-rose-400">Perbandingan</strong> pada adjektiva.',
  },
  {
    type: 'semakna',
    soal: 'jarang mandi',
    jawaban: 'sering lupa',
    pengecoh: ['tidak mandi', 'belum mandi', 'harus lupa'],
    penjelasan: '<strong class="text-blue-600 dark:text-blue-400">Jarang</strong> dan <strong class="text-blue-600 dark:text-blue-400">sering</strong> sama-sama bermakna <strong class="text-rose-600 dark:text-rose-400">Frekuentatif</strong> (kekerapan).',
  },
  {
    type: 'semakna',
    soal: 'sedang tidur',
    jawaban: 'belum datang',
    pengecoh: ['sering tidur', 'harus datang', 'sangat pulas'],
    penjelasan: '<strong class="text-blue-600 dark:text-blue-400">Sedang</strong> dan <strong class="text-blue-600 dark:text-blue-400">belum</strong> sama-sama bermakna <strong class="text-rose-600 dark:text-rose-400">Waktu/Keaspekan</strong>.',
  },
  {
    type: 'semakna',
    soal: 'perlu istirahat',
    jawaban: 'enggan pergi',
    pengecoh: ['sudah istirahat', 'kurang pergi', 'selalu istirahat'],
    penjelasan: '<strong class="text-blue-600 dark:text-blue-400">Perlu</strong> dan <strong class="text-blue-600 dark:text-blue-400">enggan</strong> sama-sama tergolong kelompok adverbia <strong class="text-rose-600 dark:text-rose-400">Modalitas</strong>.',
  },
  {
    type: 'semakna',
    soal: 'amat mahal',
    jawaban: 'terlalu cepat',
    pengecoh: ['harus cepat', 'lebih mahal', 'sedang mahal'],
    penjelasan: '<strong class="text-blue-600 dark:text-blue-400">Amat</strong> dan <strong class="text-blue-600 dark:text-blue-400">terlalu</strong> sama-sama menunjukkan kelompok makna <strong class="text-rose-600 dark:text-rose-400">Kualitas</strong>.',
  },
  {
    type: 'semakna',
    soal: 'lebih rajin',
    jawaban: 'paling malas',
    pengecoh: ['sangat rajin', 'sudah malas', 'sering rajin'],
    penjelasan: '<strong class="text-blue-600 dark:text-blue-400">Lebih</strong> dan <strong class="text-blue-600 dark:text-blue-400">paling</strong> sama-sama menandai <strong class="text-rose-600 dark:text-rose-400">Perbandingan</strong>.',
  },
  {
    type: 'semakna',
    soal: 'belum sarapan',
    jawaban: 'akan mandi',
    pengecoh: ['tidak sarapan', 'ingin mandi', 'sering sarapan'],
    penjelasan: '<strong class="text-blue-600 dark:text-blue-400">Belum</strong> dan <strong class="text-blue-600 dark:text-blue-400">akan</strong> sama-sama tergolong dalam makna <strong class="text-rose-600 dark:text-rose-400">Waktu/Keaspekan</strong>.',
  },
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [screen, setScreen] = useState<'welcome' | 'round1' | 'round2' | 'result'>('welcome');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Ronde 1 State
  const [challengeMode, setChallengeMode] = useState(false);
  const [pool, setPool] = useState<AdverbItem[]>([]);
  const [placed, setPlaced] = useState<Record<string, AdverbItem[]>>({
    negasi: [{ id: 'tidak', word: 'tidak', cat: 'negasi' }],
    waktu: [],
    modalitas: [],
    kualitas: [],
    perbandingan: [],
    frekuentatif: [],
  });
  const [draggedCard, setDraggedCard] = useState<AdverbItem | null>(null);
  const [selectedCard, setSelectedCard] = useState<AdverbItem | null>(null);
  const [hoverCategory, setHoverCategory] = useState<string | null>(null);
  const [shakingCardId, setShakingCardId] = useState<string | null>(null);

  // Ronde 2 State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [modalExplanation, setModalExplanation] = useState<{
    show: boolean;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  // Canvas Confetti ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiAnimIdRef = useRef<number | null>(null);

  // Sound generator
  const playSound = useCallback((type: 'correct' | 'wrong' | 'pop' | 'fanfare') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'wrong') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(170, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === 'fanfare') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.type = 'triangle';
          noteOsc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
          noteGain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.09);
          noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.25);
          noteOsc.start(ctx.currentTime + idx * 0.09);
          noteOsc.stop(ctx.currentTime + idx * 0.09 + 0.25);
        });
      }
    } catch {
      // Ignore audio failure
    }
  }, [soundEnabled]);

  // Dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  // Confetti Engine
  const startCanvasConfetti = useCallback(() => {
    if (confettiAnimIdRef.current) {
      cancelAnimationFrame(confettiAnimIdRef.current);
      confettiAnimIdRef.current = null;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const colors = [
      '#2563eb', '#10b981', '#f59e0b', '#ef4444', 
      '#8b5cf6', '#ec4899', '#06b6d4', '#eab308'
    ];

    interface Particle {
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      oscillationSpeed: number;
      oscillationOffset: number;
      type: 'rect' | 'circle';
      opacity: number;
    }

    const particles: Particle[] = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * -height * 0.8,
        w: Math.random() * 8 + 5,
        h: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2.8 + 2.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 7,
        oscillationSpeed: Math.random() * 0.04 + 0.02,
        oscillationOffset: Math.random() * Math.PI * 2,
        type: Math.random() > 0.35 ? 'rect' : 'circle',
        opacity: 1,
      });
    }

    const startTime = Date.now();

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const now = Date.now();
      const elapsedSec = (now - startTime) / 1000;

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += Math.sin(now * p.oscillationSpeed * 0.05 + p.oscillationOffset) * 1.5 + p.vx * 0.3;
        p.rotation += p.rotationSpeed;

        const scaleX = Math.cos((p.rotation * Math.PI) / 180);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 360);
        ctx.scale(scaleX, 1);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();

        if (p.y > height + 20) {
          if (elapsedSec < 7) {
            p.y = -15 - Math.random() * 30;
            p.x = Math.random() * width;
            p.vy = Math.random() * 2.8 + 2.2;
          } else {
            p.opacity = Math.max(0, p.opacity - 0.03);
          }
        }
      });

      const anyActive = particles.some((p) => p.opacity > 0.02 && p.y <= height + 20);
      if (anyActive) {
        confettiAnimIdRef.current = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    confettiAnimIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const stopCanvasConfetti = useCallback(() => {
    if (confettiAnimIdRef.current) {
      cancelAnimationFrame(confettiAnimIdRef.current);
      confettiAnimIdRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    if (screen !== 'result') {
      stopCanvasConfetti();
    }
  }, [screen, stopCanvasConfetti]);

  // Navigation: Return to Main Menu
  const goToMainMenu = () => {
    stopCanvasConfetti();
    setDraggedCard(null);
    setSelectedCard(null);
    setHoverCategory(null);
    setModalExplanation(null);
    setScreen('welcome');
    playSound('pop');
  };

  // Start Round 1
  const startRound1 = () => {
    stopCanvasConfetti();
    setPool(shuffle([...DATA_ADVERBIA]));
    setPlaced({
      negasi: [{ id: 'tidak', word: 'tidak', cat: 'negasi' }],
      waktu: [],
      modalitas: [],
      kualitas: [],
      perbandingan: [],
      frekuentatif: [],
    });
    setDraggedCard(null);
    setSelectedCard(null);
    setHoverCategory(null);
    setScreen('round1');
    playSound('pop');
  };

  // Start Round 2
  const startRound2 = (retryOnly = false) => {
    stopCanvasConfetti();
    const qList = retryOnly && wrongQuestions.length > 0 
      ? shuffle([...wrongQuestions]) 
      : shuffle([...DATA_SOAL_RONDE_2]);
    
    setQuestions(qList);
    setCurrentQIndex(0);
    setIsRetrying(retryOnly);
    if (!retryOnly) {
      setScore(0);
      setWrongQuestions([]);
    }
    setSelectedChoice(null);
    setIsAnswered(false);
    setModalExplanation(null);
    if (qList.length > 0) {
      setCurrentChoices(shuffle([...qList[0].pengecoh, qList[0].jawaban]));
    }
    setScreen('round2');
    playSound('pop');
  };

  // Item placement in Round 1
  const placeItemInCategory = (item: AdverbItem, catId: string) => {
    if (item.cat === catId) {
      playSound('correct');
      setPlaced((prev) => ({
        ...prev,
        [catId]: [...prev[catId], item],
      }));
      setPool((prev) => prev.filter((p) => p.id !== item.id));
      setSelectedCard(null);
      setDraggedCard(null);
      setHoverCategory(null);
    } else {
      playSound('wrong');
      setShakingCardId(item.id);
      setTimeout(() => {
        setShakingCardId(null);
      }, 400);
      setSelectedCard(null);
      setDraggedCard(null);
      setHoverCategory(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: AdverbItem) => {
    setDraggedCard(item);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setHoverCategory(null);
  };

  const handleDragOverZone = (e: React.DragEvent, catId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (hoverCategory !== catId) {
      setHoverCategory(catId);
    }
  };

  const handleDragLeaveZone = (catId: string) => {
    if (hoverCategory === catId) {
      setHoverCategory(null);
    }
  };

  const handleDropZone = (e: React.DragEvent, catId: string) => {
    e.preventDefault();
    setHoverCategory(null);
    if (draggedCard) {
      placeItemInCategory(draggedCard, catId);
    }
  };

  const handleCardClick = (item: AdverbItem) => {
    if (selectedCard?.id === item.id) {
      setSelectedCard(null);
    } else {
      setSelectedCard(item);
      playSound('pop');
    }
  };

  const handleZoneClick = (catId: string) => {
    if (selectedCard) {
      placeItemInCategory(selectedCard, catId);
    }
  };

  // Round 2 answer handling
  const handleAnswerClick = (choice: string) => {
    if (isAnswered) return;
    const currentQ = questions[currentQIndex];
    const isCorrect = choice === currentQ.jawaban;
    setSelectedChoice(choice);
    setIsAnswered(true);

    if (isCorrect) {
      playSound('correct');
      setScore((s) => s + 1);
    } else {
      playSound('wrong');
      setWrongQuestions((prev) => {
        if (!prev.some((q) => q.soal === currentQ.soal)) {
          return [...prev, currentQ];
        }
        return prev;
      });
    }

    setTimeout(() => {
      setModalExplanation({
        show: true,
        isCorrect,
        explanation: currentQ.penjelasan,
      });
    }, 400);
  };

  const handleNextQuestion = () => {
    setModalExplanation(null);
    const nextIdx = currentQIndex + 1;
    if (nextIdx < questions.length) {
      setCurrentQIndex(nextIdx);
      setSelectedChoice(null);
      setIsAnswered(false);
      setCurrentChoices(shuffle([...questions[nextIdx].pengecoh, questions[nextIdx].jawaban]));
    } else {
      setScreen('result');
      const total = questions.length;
      const percentage = Math.round((score / total) * 100);

      // Score > 80% triggers celebration
      if (percentage > 80) {
        playSound('fanfare');
        setTimeout(() => {
          startCanvasConfetti();
        }, 150);
      }
    }
  };

  const isDraggingActive = draggedCard !== null || selectedCard !== null;

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      {/* Canvas Confetti */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />

      {/* Top Header - Minimal & Professional */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={goToMainMenu}
              className="flex items-center gap-2 text-left hover:opacity-85 transition"
              title="Kembali ke Menu Utama"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
                KF
              </span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">
                Kuis Frasa
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Button Kembali ke Menu Utama */}
            {screen !== 'welcome' && (
              <button
                onClick={goToMainMenu}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition"
                title="Kembali ke Beranda"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Menu Utama</span>
              </button>
            )}

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-slate-400" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col mx-auto w-full max-w-4xl px-4 py-4 sm:px-6">
        {/* ========================================================================= */}
        {/* SCREEN 0: WELCOME */}
        {/* ========================================================================= */}
        {screen === 'welcome' && (
          <div className="animate-pop-in my-auto py-8 text-center max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 mb-4">
              Bahasa Indonesia &bull; Sintaksis
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Makna Frasa Adjektival & Verbal
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Pelajari konsep pengelompokan adverbia dan temukan frasa yang semakna meskipun kata intinya berbeda.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Ronde 1</span>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-0.5">Kelompokkan Adverbia</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Seret atau ketuk kartu kata ke kotak kategori makna yang tepat.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Ronde 2</span>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-0.5">Frasa Semakna</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Pilih pasangan frasa dengan kelompok adverbia yang setara.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={startRound1}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition"
              >
                <Play className="h-4 w-4 fill-current" />
                Mulai Pembelajaran
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 1: ROUND 1 (DRAG & DROP ADVERBIA) */}
        {/* ========================================================================= */}
        {screen === 'round1' && (
          <div className="animate-pop-in space-y-4 my-auto pb-4">
            {/* Header Ronde 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                    Ronde 1
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Kelompokkan Adverbia
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Seret kartu ke kotak kelompoknya, atau ketuk kartu lalu ketuk kotak sasaran.
                </p>
              </div>

              {/* Mode Tantangan Toggle */}
              <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <input
                  type="checkbox"
                  checked={challengeMode}
                  onChange={(e) => setChallengeMode(e.target.checked)}
                  className="h-3.5 w-3.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Sembunyikan Label
                </span>
              </label>
            </div>

            {/* Pool Kartu Adverbia */}
            <div className="rounded-xl border border-slate-200 bg-slate-100/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Kartu Tersedia ({pool.length})
                </span>
                {selectedCard && (
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="text-xs text-rose-500 hover:underline"
                  >
                    Batal pilih
                  </button>
                )}
              </div>

              <div className="flex min-h-[44px] flex-wrap items-center gap-2">
                {pool.length === 0 ? (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 py-1">
                    ✓ Semua kartu telah berhasil dikelompokkan ke kotaknya.
                  </p>
                ) : (
                  pool.map((item) => {
                    const isSelected = selectedCard?.id === item.id;
                    const isShaking = shakingCardId === item.id;

                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleCardClick(item)}
                        className={`cursor-grab select-none rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-all active:cursor-grabbing ${
                          isShaking
                            ? 'animate-shake bg-rose-600'
                            : isSelected
                            ? 'scale-105 bg-blue-700 ring-2 ring-blue-400'
                            : 'bg-blue-600 hover:bg-blue-500 active:scale-95'
                        }`}
                      >
                        {item.word}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Kotak Kategori (Drop Zones) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {CATEGORIES.map((cat) => {
                const isHovered = hoverCategory === cat.id;
                const itemsInCat = placed[cat.id] || [];

                return (
                  <div
                    key={cat.id}
                    onDragOver={(e) => handleDragOverZone(e, cat.id)}
                    onDragLeave={() => handleDragLeaveZone(cat.id)}
                    onDrop={(e) => handleDropZone(e, cat.id)}
                    onClick={() => handleZoneClick(cat.id)}
                    className={`relative min-h-[110px] rounded-xl border p-3 transition-all duration-150 flex flex-col justify-between ${
                      isDraggingActive
                        ? isHovered
                          ? 'scale-[1.02] border-emerald-500 bg-emerald-50/50 shadow-md dark:bg-emerald-950/30'
                          : 'animate-pulse-dashed border-dashed border-blue-400 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20'
                        : 'border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900'
                    } ${selectedCard ? 'cursor-pointer hover:border-blue-400' : ''}`}
                  >
                    {/* SVG Animated Circular / Marching Dashed Border */}
                    {isDraggingActive && (
                      <svg className="pointer-events-none absolute inset-0 h-full w-full rounded-xl">
                        <rect
                          x="2"
                          y="2"
                          width="calc(100% - 4px)"
                          height="calc(100% - 4px)"
                          rx="10"
                          ry="10"
                          fill="none"
                          stroke={isHovered ? '#10b981' : '#3b82f6'}
                          strokeWidth={isHovered ? 3 : 2}
                          strokeDasharray="8 5"
                          className="animate-dash-march"
                        />
                      </svg>
                    )}

                    <div className="border-b border-slate-100 pb-1.5 dark:border-slate-800/80">
                      <h3 className="font-semibold text-xs text-center text-slate-800 dark:text-slate-200">
                        {challengeMode ? (
                          <span className="italic text-slate-400">[Tersembunyi]</span>
                        ) : (
                          cat.title
                        )}
                      </h3>
                    </div>

                    <div className="flex min-h-[50px] flex-wrap content-start gap-1 py-1">
                      {itemsInCat.map((item) => (
                        <span
                          key={item.id}
                          className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                            item.id === 'tidak'
                              ? 'bg-slate-800 text-white dark:bg-slate-700'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {item.word}
                        </span>
                      ))}

                      {itemsInCat.length === 0 && (
                        <span className="self-center mx-auto text-[11px] text-slate-400 dark:text-slate-500 italic">
                          {isDraggingActive ? 'Lepas di sini' : 'Kosong'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions - Tombol Lanjut ke Ronde 2 SELALU AKTIF */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={goToMainMenu}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <Home className="h-3.5 w-3.5" />
                Menu Utama
              </button>

              <button
                onClick={() => startRound2(false)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition"
              >
                Lanjut ke Ronde 2
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: ROUND 2 (FULL LAYAR / NO SCROLL VIEWPORT-FOCUSED) */}
        {/* ========================================================================= */}
        {screen === 'round2' && questions.length > 0 && (
          <div className="animate-pop-in flex-1 flex flex-col justify-between max-h-[calc(100vh-76px)] py-1">
            {/* Top Bar Ronde 2 */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  Ronde 2
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  Frasa Semakna
                </span>
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Soal <span className="font-bold text-slate-900 dark:text-white">{currentQIndex + 1}</span> dari {questions.length}
              </div>
            </div>

            {/* Center Area: Question Statement */}
            <div className="my-auto py-2 flex flex-col items-center text-center">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Pilih frasa yang <span className="font-bold text-rose-600 dark:text-rose-400">SEMAKNA</span> dengan:
              </p>

              <div className="my-3 sm:my-5 w-full max-w-lg rounded-2xl bg-blue-50/70 border border-blue-200/60 py-4 sm:py-6 px-6 text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-700 shadow-2xs dark:bg-slate-900 dark:border-slate-800 dark:text-blue-300">
                &ldquo;{questions[currentQIndex]?.soal}&rdquo;
              </div>

              {/* 4 Pilihan Jawaban (Grid 2x2 agar pas layar tanpa scroll) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-lg">
                {currentChoices.map((choice, i) => {
                  const currentQ = questions[currentQIndex];
                  const isSelected = selectedChoice === choice;
                  const isCorrect = choice === currentQ.jawaban;

                  let btnStyle = 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500 dark:text-slate-100';

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-200 ring-1 ring-emerald-400';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-400 dark:bg-rose-950/60 dark:text-rose-200 ring-1 ring-rose-400';
                    } else {
                      btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleAnswerClick(choice)}
                      className={`flex items-center justify-between rounded-xl border p-3.5 sm:p-4 text-left text-sm sm:text-base font-medium transition-all ${btnStyle}`}
                    >
                      <span>{choice}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 ml-2" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-rose-500 dark:text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Progress Bar & Home Link */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <button
                  onClick={goToMainMenu}
                  className="hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center gap-1"
                >
                  <Home className="h-3 w-3" />
                  Menu Utama
                </button>
                <span>Progres: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden dark:bg-slate-800">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full" 
                  style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Penjelasan Ronde 2 */}
        {modalExplanation?.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs">
            <div className="animate-pop-in w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-slate-800">
                  {modalExplanation.isCorrect ? '✓' : '!'}
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {modalExplanation.isCorrect ? 'Jawaban Benar' : 'Kurang Tepat'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {modalExplanation.isCorrect ? 'Pemahaman Anda sudah tepat' : 'Perhatikan analisis makna berikut'}
                  </p>
                </div>
              </div>

              <div
                className="mb-5 rounded-xl bg-slate-50 p-3.5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:bg-slate-800/80 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
                dangerouslySetInnerHTML={{ __html: modalExplanation.explanation }}
              />

              <button
                onClick={handleNextQuestion}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition"
              >
                {currentQIndex + 1 < questions.length ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil Akhir'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: RESULT (RONDE 3) */}
        {/* ========================================================================= */}
        {screen === 'result' && (
          <div className="animate-pop-in my-auto py-4 text-center max-w-xl mx-auto w-full">
            {(() => {
              const total = questions.length;
              const percentage = Math.round((score / total) * 100);
              const isHighScore = percentage > 80;

              return (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400">
                    <Trophy className="h-7 w-7" />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    Kuis Selesai
                  </h2>

                  <div className="my-4">
                    <span className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">
                      {percentage}%
                    </span>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Benar {score} dari {total} pertanyaan
                    </p>
                  </div>

                  {/* Clean Minimalist Score Badge without library text */}
                  {isHighScore ? (
                    <div className="mx-auto mb-6 max-w-sm rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300">
                      Selamat! Anda meraih nilai di atas 80%.
                    </div>
                  ) : (
                    <div className="mx-auto mb-6 max-w-sm rounded-xl bg-slate-50 px-4 py-2.5 text-xs text-slate-600 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300">
                      Raih nilai di atas 80% untuk mengaktifkan efek perayaan.
                    </div>
                  )}

                  {/* Soal yang Perlu Diingat */}
                  {wrongQuestions.length > 0 && (
                    <div className="mb-6 text-left">
                      <h3 className="mb-2 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                        Evaluasi Soal ({wrongQuestions.length})
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {wrongQuestions.map((wq, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60"
                          >
                            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                              {i + 1}. Frasa semakna dengan &ldquo;{wq.soal}&rdquo;
                            </p>
                            <div
                              className="text-slate-600 dark:text-slate-400"
                              dangerouslySetInnerHTML={{ __html: wq.penjelasan }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tombol Aksi */}
                  <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
                    {wrongQuestions.length > 0 && (
                      <button
                        onClick={() => startRound2(true)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200 transition"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Ulangi Soal Salah
                      </button>
                    )}

                    <button
                      onClick={startRound1}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Ulangi dari Ronde 1
                    </button>

                    <button
                      onClick={goToMainMenu}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                    >
                      <Home className="h-3.5 w-3.5" />
                      Menu Utama
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </main>
    </div>
  );
}
