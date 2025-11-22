
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { HeroScene, QuantumComputerScene } from './components/QuantumScene';
import { SurfaceCodeDiagram, TransformerDecoderDiagram, PerformanceMetricDiagram, SchedulerInterface } from './components/Diagrams';
import { ArrowDown, Menu, X, Star, ShieldCheck, Sparkles, Clock, Zap, LayoutGrid, Smartphone, XCircle, ChevronRight, Check, Map, Box, ArrowLeft, CreditCard, Moon, Sun } from 'lucide-react';

// --- UTILS ---
const Section = ({ children, className = "", id = "" }: React.PropsWithChildren<{ className?: string, id?: string }>) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id={id} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
};

const FeatureCard = ({ icon, title, desc, delay = 0 }: { icon: React.ReactNode, title: string, desc: string, delay?: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-start p-8 bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-sm hover:shadow-2xl transition-all duration-500 group"
    >
      <div className="mb-6 p-4 bg-stone-50 dark:bg-stone-900 rounded-xl shadow-inner text-orange-500 border border-stone-100 dark:border-stone-800 group-hover:bg-orange-500 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="font-serif text-2xl text-stone-900 dark:text-white mb-3">{title}</h3>
      <p className="text-stone-500 dark:text-stone-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
};

// --- COMPONENTS ---

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 800); // Slight delay after 100%
                    return 100;
                }
                return prev + 1;
            });
        }, 25);
        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div 
            className="fixed inset-0 z-[100] bg-stone-950 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
        >
            <div className="relative mb-12 w-32 h-32 flex items-center justify-center">
                {/* Rings Animation */}
                <motion.div 
                    className="absolute inset-0 border border-stone-800 rounded-full"
                    animate={{ scale: [0.8, 1.2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div 
                    className="absolute inset-2 border border-orange-900/30 rounded-full"
                    animate={{ scale: [0.8, 1.1], opacity: [0.5, 0] }}
                    transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                />
                
                {/* Logo */}
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-stone-900 font-bold text-4xl shadow-2xl z-10 relative overflow-hidden">
                    <motion.div 
                        className="absolute inset-0 bg-orange-500/20"
                        initial={{ y: '100%' }}
                        animate={{ y: `${100 - progress}%` }}
                    />
                    <span className="relative z-10">Z</span>
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-4">
                 <div className="text-3xl font-serif text-white tracking-widest">
                     {progress}%
                 </div>
                 <div className="h-6 overflow-hidden flex flex-col items-center w-64 text-center">
                    <AnimatePresence mode="wait">
                        {progress < 40 && <motion.span key="boot" initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-10, opacity:0}} className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">System Boot</motion.span>}
                        {progress >= 40 && progress < 80 && <motion.span key="lidar" initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-10, opacity:0}} className="text-xs font-medium uppercase tracking-[0.2em] text-orange-500">Calibrating Lidar</motion.span>}
                        {progress >= 80 && <motion.span key="ready" initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} exit={{y:-10, opacity:0}} className="text-xs font-medium uppercase tracking-[0.2em] text-white">Welcome Home</motion.span>}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}

const PreOrderPage = ({ onBack, isDarkMode }: { onBack: () => void, isDarkMode: boolean }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="min-h-screen bg-white dark:bg-stone-950 flex flex-col md:flex-row"
        >
            {/* Visual Side */}
            <div className="w-full md:w-1/2 bg-[#F5F5F4] dark:bg-stone-900 relative overflow-hidden min-h-[300px] md:min-h-screen">
                <div className="absolute top-6 left-6 z-20">
                    <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/50 backdrop-blur rounded-full text-stone-900 dark:text-white hover:bg-white transition-all text-sm font-bold uppercase tracking-wider">
                        <ArrowLeft size={16}/> Back
                    </button>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                     <HeroScene isDarkMode={isDarkMode} />
                </div>
                <div className="absolute bottom-12 left-12 right-12 pointer-events-none">
                    <h2 className="font-serif text-4xl md:text-5xl mb-4 text-stone-900 dark:text-white">The Future of Clean.</h2>
                    <p className="text-stone-600 dark:text-stone-400">Limited First Edition batch shipping December 2026.</p>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center overflow-y-auto bg-white dark:bg-stone-950">
                <div className="max-w-lg mx-auto w-full">
                    <span className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-4 block">Pre-order Reservation</span>
                    <h1 className="font-serif text-4xl text-stone-900 dark:text-white mb-2">Secure your ZBot.</h1>
                    <p className="text-stone-500 dark:text-stone-400 mb-10">No payment required today. We will notify you when your unit is ready to ship.</p>

                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-stone-800 dark:text-stone-200">First Name</label>
                                <input type="text" className="w-full bg-stone-50 dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:border-orange-500 outline-none py-3 px-2 transition-colors" placeholder="Jane" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-stone-800 dark:text-stone-200">Last Name</label>
                                <input type="text" className="w-full bg-stone-50 dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:border-orange-500 outline-none py-3 px-2 transition-colors" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wide text-stone-800 dark:text-stone-200">Email Address</label>
                            <input type="email" className="w-full bg-stone-50 dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:border-orange-500 outline-none py-3 px-2 transition-colors" placeholder="jane@example.com" />
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-bold uppercase tracking-wide text-stone-800 dark:text-stone-200">Shipping Region</label>
                             <select className="w-full bg-stone-50 dark:bg-stone-900 border-b-2 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:border-orange-500 outline-none py-3 px-2 transition-colors">
                                <option>United States</option>
                                <option>Canada</option>
                                <option>United Kingdom</option>
                                <option>Europe</option>
                             </select>
                        </div>

                        <div className="pt-6">
                            <button type="button" className="w-full py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold text-lg hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-3">
                                <CreditCard size={20} /> Reserve for $0
                            </button>
                            <p className="text-center text-xs text-stone-400 mt-4">
                                By reserving, you agree to our Terms of Service. You can cancel anytime.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    )
}

const ProductTour = ({ onClose }: { onClose: () => void }) => {
    const [step, setStep] = useState(0);
    
    const tourSteps = [
        {
            target: "hero-cta",
            title: "Welcome to ZBot",
            desc: "Your journey to a cleaner home starts here. Let's take a quick tour."
        },
        {
            target: "how-it-works",
            title: "Simple Workflow",
            desc: "See how easy it is to set up and let ZBot handle the rest."
        },
        {
            target: "mapping",
            title: "Interactive Mapping",
            desc: "Try our Smart Map demo to see how ZBot navigates your space."
        },
        {
            target: "scheduler",
            title: "Set & Forget",
            desc: "Schedule cleanings around your life with our simple app interface."
        }
    ];

    const handleNext = () => {
        if (step < tourSteps.length - 1) {
            setStep(step + 1);
            const id = tourSteps[step + 1].target;
            const el = document.getElementById(id);
            if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-center justify-center sm:justify-end p-6">
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-stone-900/90 backdrop-blur-md text-white p-6 rounded-2xl shadow-2xl pointer-events-auto max-w-sm w-full border border-stone-700 relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-white"><X size={20}/></button>
                <div className="text-orange-500 font-bold uppercase text-xs tracking-widest mb-2">
                    Step {step + 1} of {tourSteps.length}
                </div>
                <h3 className="font-serif text-2xl mb-2">{tourSteps[step].title}</h3>
                <p className="text-stone-400 mb-6 text-sm leading-relaxed">{tourSteps[step].desc}</p>
                <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                        {tourSteps.map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-orange-500' : 'w-1.5 bg-stone-700'}`} />
                        ))}
                    </div>
                    <button onClick={handleNext} className="flex items-center gap-2 px-4 py-2 bg-white text-stone-900 rounded-lg font-bold text-sm hover:bg-stone-200">
                        {step === tourSteps.length - 1 ? "Finish" : "Next"} <ChevronRight size={16}/>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const DesignStoryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-white/95 dark:bg-stone-950/95 backdrop-blur-xl overflow-y-auto"
            >
                <button onClick={onClose} className="fixed top-6 right-6 p-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 z-50 transition-colors">
                    <XCircle size={32} className="text-stone-800 dark:text-stone-200"/>
                </button>

                <div className="max-w-4xl mx-auto px-6 py-24">
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-4 block">The Design Story</span>
                        <h1 className="font-serif text-6xl text-stone-900 dark:text-white mb-12">Not just a robot.<br/>A roommate.</h1>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="aspect-square bg-stone-100 dark:bg-stone-900 rounded-2xl overflow-hidden relative"
                        >
                             {/* Placeholder for sketch/image */}
                             <div className="absolute inset-0 flex items-center justify-center text-stone-300 dark:text-stone-700">
                                <Sparkles size={64} />
                             </div>
                             <img src="https://i.ibb.co/cSYJ5Zx0/unnamed-2.jpg" className="w-full h-full object-cover opacity-80 mix-blend-multiply dark:mix-blend-normal dark:opacity-50" alt="Sketch" />
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col justify-center"
                        >
                            <h3 className="font-serif text-3xl mb-6 dark:text-white">Inspired by Ceramics</h3>
                            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                                When we set out to design ZBot, we looked at the objects you leave out on your coffee table, not the tools you hide in your garage. We chose a matte, ceramic-like finish that feels warm to the touch.
                            </p>
                            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                The gentle curvature avoids the aggressive "tech" aesthetic of traditional appliances. ZBot is designed to be seen, but never heard. We stripped away the flashing LEDs and complex buttons found on competitors, leaving only a single, breathing light ring that communicates status through subtle pulsations.
                            </p>
                        </motion.div>
                    </div>

                    <div className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 p-12 rounded-3xl mb-16">
                        <h3 className="font-serif text-3xl mb-6 text-center">"Technology should be quiet."</h3>
                        <p className="text-center text-stone-400 dark:text-stone-500 italic text-lg mb-8">- Lead Designer, ZOVKO</p>
                        <div className="flex flex-col md:flex-row gap-8 text-stone-300 dark:text-stone-600 text-sm leading-relaxed">
                            <p>
                                We spent 18 months iterating on the sound profile alone. By decoupling the motor from the chassis with custom silicone dampeners, we reduced the high-pitched whine typical of vacuums to a low, white-noise hum.
                            </p>
                            <p>
                                The materials are sustainable, using 60% recycled post-consumer plastics for the internal chassis, while the exterior shell is a proprietary bio-resin that resists scratching and yellowing over time.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'landing' | 'preorder'>('landing');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showStory, setShowStory] = useState(false);
  // DEFAULT TO DARK MODE
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 200]);

  // Handle Dark Mode Toggle & Init
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!isLoading) {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        
        // Simulate first-time user for tour
        const timer = setTimeout(() => {
            setShowTour(true);
        }, 2000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }
  }, [isLoading]);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const navigateToPreorder = () => {
    setCurrentView('preorder');
    window.scrollTo(0, 0);
  }

  if (isLoading) {
      return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  if (currentView === 'preorder') {
      return <PreOrderPage onBack={() => setCurrentView('landing')} isDarkMode={isDarkMode} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 selection:bg-orange-200 dark:selection:bg-orange-900 selection:text-stone-900 dark:selection:text-white overflow-x-hidden font-sans transition-colors duration-500">
      
      {/* Product Tour Overlay */}
      <AnimatePresence>
        {showTour && <ProductTour onClose={() => setShowTour(false)} />}
      </AnimatePresence>

      {/* Design Story Modal */}
      <DesignStoryModal isOpen={showStory} onClose={() => setShowStory(false)} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-white/90 dark:bg-stone-950/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-stone-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-stone-900 font-bold text-xl shadow-lg group-hover:bg-orange-500 dark:group-hover:bg-orange-500 group-hover:text-white dark:group-hover:text-white transition-colors">Z</div>
            <span className={`font-serif font-bold text-2xl tracking-wide transition-all text-stone-900 dark:text-white`}>
              ZBot
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-stone-600 dark:text-stone-300">
            <a href="#features" onClick={scrollToSection('features')} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors uppercase text-xs tracking-widest">Features</a>
            <a href="#story" onClick={scrollToSection('story')} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors uppercase text-xs tracking-widest">Design</a>
            <a href="#mapping" onClick={scrollToSection('mapping')} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors uppercase text-xs tracking-widest">Mapping</a>
            
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Toggle Dark Mode"
            >
                {isDarkMode ? <Sun size={18} className="text-stone-300"/> : <Moon size={18} className="text-stone-600"/>}
            </button>

            <button onClick={navigateToPreorder} className="px-6 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-sm hover:shadow-lg font-semibold text-xs uppercase tracking-widest transform hover:scale-105">
              Pre-order
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
              <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                  {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
              </button>
              <button className="text-stone-900 dark:text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X /> : <Menu />}
              </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-stone-900 flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in text-stone-900 dark:text-white">
            <a href="#features" onClick={scrollToSection('features')} className="hover:text-orange-600">Features</a>
            <a href="#story" onClick={scrollToSection('story')} className="hover:text-orange-600">Design</a>
            <a href="#mapping" onClick={scrollToSection('mapping')} className="hover:text-orange-600">Mapping</a>
            <button onClick={() => { setMenuOpen(false); navigateToPreorder(); }} className="px-8 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full shadow-lg">Pre-order ZBot</button>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-[#F5F5F4] dark:bg-stone-950">
        <div className="absolute inset-0 w-full h-full">
           <HeroScene isDarkMode={isDarkMode} />
        </div>
        
        {/* Hero Content Overlay */}
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 container mx-auto px-6 text-center mt-16 pointer-events-none"
        >
          {/* Enhanced Text Backdrop */}
          <div className="inline-block relative p-8">
              {/* Adapt backdrop blur for dark mode */}
              <div className="absolute inset-0 bg-white/80 dark:bg-black/40 blur-3xl -z-10 rounded-full transform scale-110 shadow-[0_0_100px_rgba(255,255,255,0.8)] dark:shadow-[0_0_100px_rgba(0,0,0,0.8)]"></div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-block mb-6 px-4 py-1 border border-stone-400/30 dark:border-stone-600/30 text-stone-800 dark:text-stone-200 text-xs tracking-[0.3em] uppercase font-bold rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md shadow-sm"
              >
                Autonomous Intelligence
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="font-serif text-7xl md:text-9xl lg:text-[10rem] font-medium leading-[0.8] mb-6 text-stone-950 dark:text-white drop-shadow-2xl tracking-tighter"
              >
                ZBot<span className="text-orange-500">.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-2xl md:text-3xl text-stone-700 dark:text-stone-300 font-light italic"
              >
                Clean without lifting a finger.
              </motion.p>
          </div>
          
          <motion.div 
             id="hero-cta"
             className="pointer-events-auto mt-8"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.6 }}
          >
             <button onClick={scrollToSection('how-it-works')} className="px-10 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full font-medium hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-xl hover:shadow-orange-500/30 flex items-center gap-2 mx-auto group">
                Meet ZBot <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
             </button>
          </motion.div>
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white dark:from-stone-950 via-white/50 dark:via-stone-950/50 to-transparent pointer-events-none"></div>
      </header>

      <main>
        
        {/* NEW SECTION: How It Works */}
        <Section id="how-it-works" className="py-32 bg-white dark:bg-stone-950 border-b border-stone-100 dark:border-stone-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-2 block">Simple Setup</span>
                    <h2 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white">How it works</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    {/* Step 1 */}
                    <motion.div 
                        whileHover={{ y: -10 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 text-stone-700 dark:text-stone-300 shadow-sm">
                             <Map size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="font-serif text-2xl mb-3 dark:text-white">1. Map Your Home</h3>
                        <p className="text-stone-500 dark:text-stone-400 leading-relaxed">Let ZBot roam once. It uses Lidar to create a precise 3D floorplan in minutes, identifying rooms and obstacles.</p>
                    </motion.div>

                     {/* Step 2 */}
                     <motion.div 
                        whileHover={{ y: -10 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 text-stone-700 dark:text-stone-300 shadow-sm">
                             <Clock size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="font-serif text-2xl mb-3 dark:text-white">2. Set a Schedule</h3>
                        <p className="text-stone-500 dark:text-stone-400 leading-relaxed">Use the app to tell ZBot when and where to clean. Set "No-Go Zones" for pet bowls or play areas.</p>
                    </motion.div>

                     {/* Step 3 */}
                     <motion.div 
                        whileHover={{ y: -10 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 text-stone-700 dark:text-stone-300 shadow-sm">
                             <Box size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="font-serif text-2xl mb-3 dark:text-white">3. Enjoy Freedom</h3>
                        <p className="text-stone-500 dark:text-stone-400 leading-relaxed">Come home to spotless floors. ZBot automatically empties its dustbin and washes its mops at the dock.</p>
                    </motion.div>
                </div>
            </div>
        </Section>

        {/* Intro / Value Prop */}
        <Section id="features" className="py-32 bg-white dark:bg-stone-950">
          <div className="container mx-auto px-6 text-center mb-20">
             <span className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-4 block">The ZBot Difference</span>
             <h2 className="font-serif text-5xl md:text-6xl text-stone-900 dark:text-white mb-8">Scrub. Don't just sweep.</h2>
             <p className="text-xl text-stone-500 dark:text-stone-400 max-w-3xl mx-auto font-light leading-relaxed">
                Traditional robots push dirt around. ZBot uses a 4-stage active cleaning system to wash with fresh water and extract dirty water instantly.
             </p>
          </div>

          <div className="container mx-auto px-6">
             <TransformerDecoderDiagram />
          </div>
        </Section>

        {/* Capabilities Grid */}
        <Section className="py-32 bg-stone-50 dark:bg-stone-900">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard 
                        icon={<LayoutGrid size={28}/>}
                        title="Multi-Surface"
                        desc="Intelligently detects and adapts to hardwood, tile, marble, and automatically lifts pads for carpets."
                        delay={0}
                    />
                     <FeatureCard 
                        icon={<Smartphone size={28}/>}
                        title="App Control"
                        desc="Schedule cleanings, set no-go zones, and view real-time mapping from anywhere in the world."
                        delay={0.1}
                    />
                     <FeatureCard 
                        icon={<ShieldCheck size={28}/>}
                        title="Pet Friendly"
                        desc="Advanced AI vision identifies and avoids pet obstacles, toys, and unexpected messes."
                        delay={0.2}
                    />
                     <FeatureCard 
                        icon={<Sparkles size={28}/>}
                        title="Self-Cleaning"
                        desc="ZBot returns to the base to wash its own mops and dry them with hot air. Zero odors."
                        delay={0.3}
                    />
                </div>
            </div>
        </Section>

        {/* The Science: Mapping */}
        <Section id="mapping" className="py-32 bg-white dark:bg-stone-950 overflow-hidden">
            <div className="container mx-auto px-6">
                <SurfaceCodeDiagram />
            </div>
        </Section>

        {/* Scheduling Section */}
        <Section id="scheduler" className="py-32 bg-[#1c1917] text-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-4 block">Smart Scheduling</span>
                        <h2 className="font-serif text-5xl mb-6">Clean on your time.</h2>
                        <p className="text-lg text-stone-400 mb-8 leading-relaxed">
                            Set ZBot to clean when you leave for work, or schedule specific rooms for different days. With the ZBot App, you have total control over your home's hygiene without lifting a finger.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-stone-300"><Check size={18} className="text-orange-500"/> Syncs with your calendar</li>
                            <li className="flex items-center gap-3 text-stone-300"><Check size={18} className="text-orange-500"/> Do Not Disturb mode</li>
                            <li className="flex items-center gap-3 text-stone-300"><Check size={18} className="text-orange-500"/> Remote start/stop</li>
                        </ul>
                    </div>
                    <div>
                        <SchedulerInterface />
                    </div>
                </div>
            </div>
        </Section>

        {/* Story / Aesthetics */}
        <Section id="story" className="py-32 bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-white relative overflow-hidden">
             {/* Background visual */}
             <div className="absolute top-0 right-0 w-full h-full opacity-10 mix-blend-multiply dark:mix-blend-overlay pointer-events-none">
                 <QuantumComputerScene />
             </div>

             <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-stone-300 dark:border-stone-700 text-orange-600 dark:text-orange-400 text-xs font-bold tracking-widest uppercase rounded-full mb-6 bg-white dark:bg-stone-800">
                        <Star size={14}/> Design Philosophy
                    </div>
                    <h2 className="font-serif text-6xl mb-8 leading-tight">Soft on eyes.<br/>Tough on dirt.</h2>
                    <p className="text-xl text-stone-600 dark:text-stone-400 mb-6 leading-relaxed font-light">
                        We didn't just build a tool; we built a piece of furniture. ZBot's matte finish and soft curves blend seamlessly into modern home decor.
                    </p>
                    <p className="text-lg text-stone-600 dark:text-stone-400 mb-10 leading-relaxed font-light">
                        It moves with intention, avoiding collisions with a grace that feels almost alive.
                    </p>
                    <button 
                        onClick={() => setShowStory(true)}
                        className="group flex items-center gap-2 text-stone-900 dark:text-white border-b-2 border-orange-500 pb-1 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-sm uppercase tracking-widest font-bold"
                    >
                        Read the design story <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                </div>
             </div>
        </Section>

        {/* Specs */}
        <Section id="specs" className="py-32 bg-white dark:bg-stone-950">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-stone-400 font-bold tracking-widest text-xs uppercase mb-2 block">Technical Specifications</span>
                    <h2 className="font-serif text-4xl text-stone-900 dark:text-white">Engineered for Performance</h2>
                </div>
                <PerformanceMetricDiagram />
            </div>
        </Section>

        {/* Footer Call to Action */}
        <Section className="py-32 bg-stone-50 dark:bg-stone-900 text-center border-t border-stone-100 dark:border-stone-800">
            <div className="container mx-auto px-6">
                <h2 className="font-serif text-5xl md:text-7xl text-stone-900 dark:text-white mb-8">Come home to clean.</h2>
                <p className="text-stone-500 dark:text-stone-400 text-xl mb-10 max-w-2xl mx-auto">Join thousands of early adopters transforming their home care routine.</p>
                <button onClick={navigateToPreorder} className="px-12 py-6 bg-orange-500 text-white text-xl rounded-full font-medium hover:bg-orange-600 transition-all shadow-2xl hover:shadow-orange-500/40 transform hover:-translate-y-1">
                    Order ZBot Now - $899
                </button>
                <p className="mt-6 text-xs text-stone-400 uppercase tracking-widest font-bold">Free Shipping • 30-Day Trial • 2-Year Warranty</p>
            </div>
        </Section>
      </main>

      <footer className="bg-stone-950 dark:bg-black text-stone-400 py-16 border-t border-stone-900 dark:border-stone-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="text-center md:text-left">
                <div className="text-white font-serif font-bold text-3xl mb-2">ZBot</div>
                <p className="text-sm max-w-xs text-stone-500">Reinventing home care through autonomous robotics and beautiful design.</p>
            </div>
            <div className="flex flex-wrap gap-12 text-sm">
                <div className="flex flex-col gap-4">
                    <span className="text-white font-bold uppercase tracking-wider text-xs">Product</span>
                    <a href="#" className="hover:text-orange-500 transition-colors">Features</a>
                    <a href="#" className="hover:text-orange-500 transition-colors">Technology</a>
                    <a href="#" className="hover:text-orange-500 transition-colors">Accessories</a>
                </div>
                <div className="flex flex-col gap-4">
                    <span className="text-white font-bold uppercase tracking-wider text-xs">Company</span>
                    <a href="#" className="hover:text-orange-500 transition-colors">About Us</a>
                    <a href="#" className="hover:text-orange-500 transition-colors">Support</a>
                    <a href="#" className="hover:text-orange-500 transition-colors">Warranty</a>
                </div>
                <div className="flex flex-col gap-4">
                    <span className="text-white font-bold uppercase tracking-wider text-xs">Social</span>
                    <a href="#" className="hover:text-orange-500 transition-colors">Instagram</a>
                    <a href="#" className="hover:text-orange-500 transition-colors">Twitter</a>
                    <a href="#" className="hover:text-orange-500 transition-colors">YouTube</a>
                </div>
            </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-stone-900 dark:border-stone-800 text-center md:text-left text-xs text-stone-600 flex flex-col md:flex-row justify-between items-center">
            <div>© 2025 ZBot Robotics Inc. All rights reserved.</div>
            <div className="mt-4 md:mt-0 flex gap-6">
                <a href="#" className="hover:text-stone-400">Privacy Policy</a>
                <a href="#" className="hover:text-stone-400">Terms of Service</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
