
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Droplets, Wind, CheckCircle, Battery, Map, Home, Play, RefreshCw, Zap, Calendar, Clock, Check, ChevronUp, ChevronDown, Settings, Sliders, Sparkles } from 'lucide-react';

// --- ROOM MAPPING INTERFACE ---
export const SurfaceCodeDiagram: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [mappingComplete, setMappingComplete] = useState(false);
  const [cleanedTiles, setCleanedTiles] = useState<number[]>([]);
  const [buttonProgress, setButtonProgress] = useState(0);

  // 8x6 Grid for more detailed blueprint feel
  const gridRows = 6;
  const gridCols = 8;
  const totalTiles = gridRows * gridCols;
  
  // Define walls (indices that should be empty/walls) to create a floor plan shape
  const walls = [0, 1, 6, 7, 8, 15, 47, 40, 41];

  const startProcess = () => {
      if (scanning) return;
      setScanning(true);
      setCleanedTiles([]);
      setMappingComplete(false);
      setButtonProgress(0);

      // Animate button fill
      const progressInterval = setInterval(() => {
          setButtonProgress(prev => {
              if(prev >= 100) {
                  clearInterval(progressInterval);
                  return 100;
              }
              return prev + 1;
          });
      }, 20);

      // Phase 1: Scanning
      setTimeout(() => {
          setMappingComplete(true);
          
          // Phase 2: Cleaning
          let currentTile = 0;
          const interval = setInterval(() => {
              if (currentTile >= totalTiles) {
                  clearInterval(interval);
                  setScanning(false);
                  setButtonProgress(0);
              } else {
                  if (!walls.includes(currentTile)) {
                    setCleanedTiles(prev => [...prev, currentTile]);
                  }
                  currentTile++;
              }
          }, 30); 
      }, 2000);
  };

  return (
    <div className="flex flex-col items-center p-8 lg:p-12 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 w-full max-w-5xl mx-auto relative overflow-hidden transition-colors duration-500">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#44403c_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="relative z-10 text-center mb-12">
         <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
            <Map size={12} /> LiDAR 2.0
         </div>
         <h3 className="font-serif text-3xl mb-2 text-stone-900 dark:text-white">Smart Mapping</h3>
         <p className="text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            ZBot generates a precise floorplan of your home in seconds. Tap below to start a demo cycle.
         </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12 items-center justify-center w-full">
          
          {/* The Map - New Flat Blueprint Design */}
          <div className="relative w-full max-w-[400px] aspect-[4/3] bg-stone-100 dark:bg-stone-950 rounded-lg border border-stone-200 dark:border-stone-800 p-6 shadow-inner overflow-hidden">
             {/* Blueprint Grid Background */}
             <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"></div>
             
             {/* Scanning Line Effect */}
             {scanning && !mappingComplete && (
                 <motion.div 
                    className="absolute top-0 left-0 w-1 h-full bg-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.5)] z-20"
                    animate={{ left: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 />
             )}

             {/* The Room Tiles */}
             <div className="grid grid-cols-8 grid-rows-6 gap-1 w-full h-full relative z-10">
                {[...Array(totalTiles)].map((_, i) => {
                    if (walls.includes(i)) return <div key={i} className="bg-transparent" />; // Empty space
                    
                    return (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: cleanedTiles.includes(i) || mappingComplete ? 1 : 0.2,
                                backgroundColor: cleanedTiles.includes(i) ? '#fb923c' : (mappingComplete ? '#a8a29e' : '#d6d3d1'),
                                scale: cleanedTiles.includes(i) ? 1 : 0.9
                            }}
                            className={`rounded-sm transition-colors duration-300 dark:opacity-20`}
                        />
                    )
                })}
             </div>
             
             {/* Robot Position Marker */}
             {scanning && (
                 <motion.div 
                    className="absolute w-4 h-4 bg-white dark:bg-stone-800 rounded-full z-30 shadow-lg border-2 border-orange-500 flex items-center justify-center"
                    animate={{
                        // Simple calc for grid movement visual
                        left: mappingComplete ? `${(cleanedTiles.length % gridCols) * 12.5 + 6}%` : '50%',
                        top: mappingComplete ? `${Math.floor(cleanedTiles.length / gridCols) * 16.6 + 8}%` : '50%',
                    }}
                    transition={{ type: "spring", stiffness: 50 }}
                 >
                     <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
                 </motion.div>
             )}
             
             {/* Cleaned up room labels - Removed specific room names to avoid clutter and boxiness */}
          </div>

          {/* The Interaction Button */}
          <div className="flex flex-col items-center lg:items-start">
            <button 
                onClick={startProcess}
                disabled={scanning}
                className={`relative w-64 h-16 rounded-full flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden
                    ${scanning 
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-wait border border-stone-200 dark:border-stone-700' 
                        : 'bg-orange-500 text-white hover:bg-orange-600 hover:-translate-y-1 cursor-pointer'
                    }`}
            >
                {/* Progress Background Fill */}
                <motion.div 
                    className="absolute inset-0 bg-stone-200/50 dark:bg-stone-700/50 origin-left"
                    style={{ width: scanning ? `${buttonProgress}%` : '0%' }}
                    transition={{ ease: "linear" }}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-2">
                    {/* Ping Animation when idle */}
                    {!scanning && (
                        <span className="absolute -inset-4 rounded-full border border-orange-500 opacity-40 animate-ping pointer-events-none"></span>
                    )}
                    
                    {scanning ? (
                        <RefreshCw className="animate-spin text-orange-500" size={20}/>
                    ) : (
                        <Play size={24} fill="currentColor" />
                    )}
                    
                    <span className={`font-bold uppercase tracking-wider text-sm ${scanning ? 'text-stone-800 dark:text-white' : 'text-white'}`}>
                        {scanning ? (mappingComplete ? 'Cleaning Cycle...' : 'Scanning Room...') : 'Start Demo'}
                    </span>
                </div>
            </button>
          </div>
      </div>
    </div>
  );
};

// --- SCHEDULING INTERFACE ---
export const SchedulerInterface: React.FC = () => {
    const [activeDays, setActiveDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
    const [hour, setHour] = useState(9);
    const [minute, setMinute] = useState(0);
    const [isAM, setIsAM] = useState(true);
    const [saved, setSaved] = useState(false);
    const [intensity, setIntensity] = useState<'eco' | 'balanced' | 'turbo'>('balanced');

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const fullDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const toggleDay = (dayIndex: number) => {
        const day = fullDays[dayIndex];
        setActiveDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    const adjustTime = (type: 'hour' | 'minute', dir: 'up' | 'down') => {
        setSaved(false);
        if (type === 'hour') {
            setHour(prev => {
                if (dir === 'up') return prev === 12 ? 1 : prev + 1;
                return prev === 1 ? 12 : prev - 1;
            });
        } else {
            setMinute(prev => {
                if (dir === 'up') return prev === 45 ? 0 : prev + 15;
                return prev === 0 ? 45 : prev - 15;
            });
        }
    }

    return (
        <div className="bg-stone-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-auto border border-stone-800 relative overflow-hidden">
             {/* Header */}
             <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-white text-xl font-serif">Cleaning Schedule</h3>
                    <p className="text-stone-400 text-sm">Automate your clean.</p>
                </div>
                <Calendar className="text-orange-500" size={24} />
             </div>

             {/* Interactive Time Picker */}
             <div className="bg-stone-800/50 p-6 rounded-xl mb-6 border border-stone-700 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-300 mb-2">
                        <Clock size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Start Time</span>
                    </div>
                    <button onClick={() => setIsAM(!isAM)} className="text-xs font-bold text-orange-500 hover:text-white transition-colors uppercase">{isAM ? 'AM' : 'PM'}</button>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                    {/* Hour */}
                    <div className="flex flex-col items-center">
                        <button onClick={() => adjustTime('hour', 'up')} className="text-stone-500 hover:text-white p-1"><ChevronUp size={20}/></button>
                        <div className="text-4xl font-mono text-white font-bold w-16 text-center bg-stone-950 rounded-lg py-2 border border-stone-800">{hour.toString().padStart(2, '0')}</div>
                        <button onClick={() => adjustTime('hour', 'down')} className="text-stone-500 hover:text-white p-1"><ChevronDown size={20}/></button>
                    </div>
                    <span className="text-2xl text-stone-600 -mt-2">:</span>
                    {/* Minute */}
                    <div className="flex flex-col items-center">
                         <button onClick={() => adjustTime('minute', 'up')} className="text-stone-500 hover:text-white p-1"><ChevronUp size={20}/></button>
                        <div className="text-4xl font-mono text-white font-bold w-16 text-center bg-stone-950 rounded-lg py-2 border border-stone-800">{minute.toString().padStart(2, '0')}</div>
                         <button onClick={() => adjustTime('minute', 'down')} className="text-stone-500 hover:text-white p-1"><ChevronDown size={20}/></button>
                    </div>
                    <div className="flex flex-col justify-center h-16 ml-2">
                        <span className="text-xl font-bold text-stone-400">{isAM ? 'AM' : 'PM'}</span>
                    </div>
                </div>
             </div>

             {/* Cleaning Mode Selector */}
             <div className="mb-6 relative z-10">
                <div className="flex items-center gap-2 text-stone-300 mb-3">
                    <Sliders size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Cleaning Mode</span>
                </div>
                <div className="flex bg-stone-950 p-1 rounded-lg border border-stone-800">
                    {(['eco', 'balanced', 'turbo'] as const).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setIntensity(mode)}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition-all
                                ${intensity === mode ? 'bg-stone-800 text-white shadow-sm' : 'text-stone-500 hover:text-stone-300'}
                            `}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
             </div>

             {/* Days Selection */}
             <div className="flex justify-between mb-8 gap-1 relative z-10">
                {days.map((day, i) => (
                    <button
                        key={i}
                        onClick={() => toggleDay(i)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all border
                            ${activeDays.includes(fullDays[i]) 
                                ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]' 
                                : 'bg-stone-950 border-stone-800 text-stone-500 hover:border-stone-600'
                            }
                        `}
                    >
                        {day}
                    </button>
                ))}
             </div>

             {/* Save Button with Green Success Animation */}
             <button 
                onClick={handleSave}
                disabled={saved}
                className={`w-full h-16 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 relative z-10 overflow-hidden
                    ${saved ? 'bg-green-600 text-white scale-105' : 'bg-white text-stone-900 hover:bg-stone-200'}
                `}
             >
                <AnimatePresence mode="wait">
                    {saved ? (
                        <motion.div 
                            key="saved"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <div className="relative">
                                <motion.div 
                                    className="absolute inset-0 bg-green-400 rounded-full opacity-50"
                                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                                <Check size={24} className="text-white relative z-10"/>
                            </div>
                            <span className="text-lg">Synced!</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="save"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            Sync to ZBot
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Shine Effect */}
                {!saved && (
                    <motion.div 
                        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
                        animate={{ x: ['-150%', '250%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                    />
                )}
             </button>
             
             {/* Background Blur Blob */}
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
}

// --- CLEANING CYCLE DIAGRAM ---
export const TransformerDecoderDiagram: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setStep(s => (s + 1) % 4);
    }, 3000); // Slower cycle to appreciate the UI
    return () => clearInterval(interval);
  }, []);

  const steps = [
      { label: "Dose", icon: <Zap size={32}/>, desc: "Precision fluid release monitors hydration levels." },
      { label: "Scrub", icon: <RefreshCw size={32}/>, desc: "600 RPM rolling brush agitates stuck-on dirt." },
      { label: "Extract", icon: <Wind size={32}/>, desc: "Powerful suction removes dirty water instantly." },
      { label: "Dry", icon: <CheckCircle size={32}/>, desc: "Warm air flow leaves floors bone dry." },
  ];

  return (
    <div className="w-full py-12">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
            {steps.map((s, i) => {
                const isActive = step === i;

                return (
                    <motion.div 
                        key={i}
                        onClick={() => setStep(i)}
                        className={`
                            relative flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-500 cursor-pointer
                            ${isActive 
                                ? 'bg-gradient-to-b from-orange-500 to-orange-600 shadow-[0_20px_50px_-12px_rgba(249,115,22,0.5)] scale-105 z-10' 
                                : 'bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                            }
                        `}
                        whileHover={{ y: isActive ? 0 : -5 }}
                    >
                        {/* Progress Bar for active step */}
                        {isActive && (
                            <motion.div 
                                className="absolute top-0 left-0 h-1 bg-white/30 w-full"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 3, ease: "linear" }}
                                style={{ transformOrigin: "left" }}
                            />
                        )}

                        <div className={`
                            w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-colors
                            ${isActive 
                                ? 'bg-white/20 text-white' 
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500'
                            }
                        `}>
                            {s.icon}
                        </div>
                        
                        <h4 className={`font-serif font-bold text-2xl mb-3 ${isActive ? 'text-white' : 'text-stone-900 dark:text-white'}`}>
                            {s.label}
                        </h4>
                        
                        <p className={`text-sm leading-relaxed ${isActive ? 'text-orange-100' : 'text-stone-500 dark:text-stone-400'}`}>
                            {s.desc}
                        </p>
                    </motion.div>
                )
            })}
       </div>
    </div>
  );
};

// --- SPECS CHART ---
export const PerformanceMetricDiagram: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
             {/* Spec Card 1 */}
             <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-lg border border-stone-100 dark:border-stone-800 flex items-center gap-6"
             >
                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-500 shrink-0">
                    <Battery size={32} />
                </div>
                <div>
                    <div className="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-wider mb-1">Battery Life</div>
                    <div className="text-4xl font-serif text-stone-900 dark:text-white">180 <span className="text-lg text-stone-400">min</span></div>
                    <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full mt-3 overflow-hidden">
                        <motion.div 
                            className="h-full bg-orange-500"
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                        />
                    </div>
                </div>
             </motion.div>

             {/* Spec Card 2 */}
             <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-lg border border-stone-100 dark:border-stone-800 flex items-center gap-6"
             >
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                    <Droplets size={32} />
                </div>
                <div>
                    <div className="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-wider mb-1">Water Efficiency</div>
                    <div className="text-4xl font-serif text-stone-900 dark:text-white">99.9 <span className="text-lg text-stone-400">%</span></div>
                     <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full mt-3 overflow-hidden">
                        <motion.div 
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            whileInView={{ width: '99%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.4 }}
                        />
                    </div>
                </div>
             </motion.div>
             
             {/* Spec Card 3 - Dark */}
             <motion.div 
                className="md:col-span-2 bg-stone-900 dark:bg-black p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-stone-800"
             >
                <div className="text-left">
                    <h3 className="text-2xl font-serif text-white mb-2">Whisper Quiet Operation</h3>
                    <p className="text-stone-400 max-w-md">Advanced motor dampening ensures ZBot operates at just 45dB, quieter than a conversation.</p>
                </div>
                <div className="flex items-end gap-2 h-16">
                    {[40, 60, 30, 80, 45, 60, 30, 50, 20, 70, 40].map((h, i) => (
                        <motion.div 
                            key={i}
                            className="w-3 bg-orange-500 rounded-t-sm"
                            animate={{ height: [h/2, h, h/2] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                            style={{ height: h }}
                        />
                    ))}
                </div>
             </motion.div>
        </div>
    )
}
