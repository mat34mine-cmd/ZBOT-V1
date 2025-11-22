
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Droplets, Wind, CheckCircle, Battery, Map, Home, Play, RefreshCw, Zap, Calendar, Clock, Check } from 'lucide-react';

// --- ROOM MAPPING INTERFACE ---
export const SurfaceCodeDiagram: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [mappingComplete, setMappingComplete] = useState(false);
  const [cleanedTiles, setCleanedTiles] = useState<number[]>([]);
  const [buttonProgress, setButtonProgress] = useState(0);

  // 6x6 Grid for higher res
  const gridSize = 6;
  const totalTiles = gridSize * gridSize;
  
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
              return prev + 1; // Approx 2000ms total to reach 100
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
                  setCleanedTiles(prev => [...prev, currentTile]);
                  currentTile++;
              }
          }, 50); // Faster cleaning visual
      }, 2000);
  };

  return (
    <div className="flex flex-col items-center p-8 lg:p-12 bg-white rounded-2xl shadow-xl border border-stone-100 w-full max-w-4xl mx-auto relative overflow-hidden">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

      <div className="relative z-10 text-center mb-12">
         <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
            <Map size={12} /> LiDAR 2.0
         </div>
         <h3 className="font-serif text-3xl mb-2 text-stone-900">Smart Mapping</h3>
         <p className="text-stone-500 max-w-md mx-auto">
            ZBot generates a precise floorplan of your home in seconds. Tap below to start a demo cycle.
         </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-16 items-center justify-center w-full">
          
          {/* The Map */}
          <div className="relative w-72 h-72 bg-stone-50 rounded-xl border-2 border-stone-200 p-2 grid grid-cols-6 gap-1 shadow-inner rotate-1 hover:rotate-0 transition-transform duration-500">
             {scanning && !mappingComplete && (
                 <motion.div 
                    className="absolute top-0 left-0 w-full h-1 bg-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.5)] z-20"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 />
             )}

             {[...Array(totalTiles)].map((_, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0.3, scale: 0.9 }}
                    animate={{ 
                        opacity: cleanedTiles.includes(i) || mappingComplete ? 1 : 0.3,
                        scale: cleanedTiles.includes(i) ? 1 : 0.95,
                        backgroundColor: cleanedTiles.includes(i) ? '#1c1917' : (mappingComplete ? '#d6d3d1' : '#f5f5f4')
                    }}
                    className="rounded-md"
                 />
             ))}
             
             {/* Robot Position Marker */}
             {scanning && (
                 <motion.div 
                    className="absolute w-6 h-6 bg-orange-500 rounded-full z-30 shadow-lg border-2 border-white"
                    animate={{
                         x: mappingComplete ? (cleanedTiles.length % gridSize) * 46 + 8 : 140,
                         y: mappingComplete ? Math.floor(cleanedTiles.length / gridSize) * 46 + 8 : 140,
                    }}
                    transition={{ type: "spring", stiffness: 50 }}
                 />
             )}
          </div>

          {/* The Interaction Button - Enhanced */}
          <div className="flex flex-col items-center">
            <button 
                onClick={startProcess}
                disabled={scanning}
                className={`relative w-48 h-16 rounded-full flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden
                    ${scanning 
                        ? 'bg-stone-100 text-stone-400 cursor-wait border border-stone-200' 
                        : 'bg-orange-500 text-white hover:bg-orange-600 hover:-translate-y-1 cursor-pointer'
                    }`}
            >
                {/* Progress Background Fill */}
                <motion.div 
                    className="absolute inset-0 bg-stone-200/50 origin-left"
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
                    
                    <span className={`font-bold uppercase tracking-wider text-sm ${scanning ? 'text-stone-800' : 'text-white'}`}>
                        {scanning ? (mappingComplete ? 'Cleaning...' : 'Scanning...') : 'Scan & Clean'}
                    </span>
                </div>
            </button>

            {/* Status Indicators */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-left w-full">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${scanning && !mappingComplete ? 'bg-orange-500 animate-pulse' : 'bg-stone-300'}`}></div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Scanning</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${scanning && mappingComplete ? 'bg-blue-500 animate-pulse' : 'bg-stone-300'}`}></div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Washing</span>
                </div>
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${scanning && mappingComplete ? 'bg-green-500 animate-pulse' : 'bg-stone-300'}`}></div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Drying</span>
                </div>
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${!scanning && mappingComplete ? 'bg-stone-800' : 'bg-stone-300'}`}></div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Done</span>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};

// --- SCHEDULING INTERFACE ---
export const SchedulerInterface: React.FC = () => {
    const [activeDays, setActiveDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
    const [time, setTime] = useState('09:00');
    const [saved, setSaved] = useState(false);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const toggleDay = (day: string) => {
        setActiveDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    return (
        <div className="bg-stone-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-auto border border-stone-800">
             <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-white text-xl font-serif">Cleaning Schedule</h3>
                    <p className="text-stone-400 text-sm">Automate your clean.</p>
                </div>
                <Calendar className="text-orange-500" size={24} />
             </div>

             {/* Days Selection */}
             <div className="flex justify-between mb-8 gap-2">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all
                            ${activeDays.includes(day) 
                                ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]' 
                                : 'bg-stone-800 text-stone-500 hover:bg-stone-700'
                            }
                        `}
                    >
                        {day.charAt(0)}
                    </button>
                ))}
             </div>

             {/* Time Selection */}
             <div className="bg-stone-800/50 p-4 rounded-xl flex items-center justify-between mb-8 border border-stone-700">
                <div className="flex items-center gap-3 text-stone-300">
                    <Clock size={20} />
                    <span className="text-sm font-medium">Start Time</span>
                </div>
                <div className="text-2xl font-mono text-white bg-stone-900 px-4 py-2 rounded-lg border border-stone-700 tracking-wider">
                    {time} <span className="text-xs text-stone-500 ml-1">AM</span>
                </div>
             </div>

             {/* Save Button */}
             <button 
                onClick={handleSave}
                className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all bg-white text-stone-900 hover:bg-stone-200 flex items-center justify-center gap-2"
             >
                {saved ? <Check size={16} className="text-green-600"/> : null}
                {saved ? 'Schedule Updated' : 'Save Schedule'}
             </button>
        </div>
    );
}

// --- CLEANING CYCLE DIAGRAM ---
export const TransformerDecoderDiagram: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setStep(s => (s + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
      { label: "Dose", icon: <Zap size={24}/>, desc: "Precision fluid release" },
      { label: "Scrub", icon: <RefreshCw size={24}/>, desc: "600 RPM rolling brush" },
      { label: "Extract", icon: <Wind size={24}/>, desc: "Powerful suction" },
      { label: "Dry", icon: <CheckCircle size={24}/>, desc: "Instant dry finish" },
  ];

  return (
    <div className="w-full py-8">
       <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-200 -z-10 hidden md:block rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-orange-500"
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {steps.map((s, i) => {
                const isActive = step === i;
                const isPast = step > i;

                return (
                    <motion.div 
                        key={i}
                        className={`flex flex-col items-center bg-white p-6 rounded-xl w-full md:w-56 border-2 transition-all duration-300
                            ${isActive ? 'border-orange-500 shadow-xl scale-110 z-10' : (isPast ? 'border-stone-800 opacity-50' : 'border-stone-100 opacity-50')}
                        `}
                        initial={false}
                        animate={{ y: isActive ? -10 : 0 }}
                    >
                        <div className={`
                            w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors
                            ${isActive ? 'bg-orange-100 text-orange-600' : (isPast ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-400')}
                        `}>
                            {s.icon}
                        </div>
                        <h4 className={`font-serif font-bold text-xl ${isActive ? 'text-stone-900' : 'text-stone-500'}`}>{s.label}</h4>
                        <p className="text-xs text-stone-400 text-center mt-2 leading-tight">{s.desc}</p>
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
                className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-6"
             >
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 shrink-0">
                    <Battery size={32} />
                </div>
                <div>
                    <div className="text-stone-500 text-sm font-bold uppercase tracking-wider mb-1">Battery Life</div>
                    <div className="text-4xl font-serif text-stone-900">180 <span className="text-lg text-stone-400">min</span></div>
                    <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
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
                className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-6"
             >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                    <Droplets size={32} />
                </div>
                <div>
                    <div className="text-stone-500 text-sm font-bold uppercase tracking-wider mb-1">Water Efficiency</div>
                    <div className="text-4xl font-serif text-stone-900">99.9 <span className="text-lg text-stone-400">%</span></div>
                     <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
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
                className="md:col-span-2 bg-stone-900 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8"
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
