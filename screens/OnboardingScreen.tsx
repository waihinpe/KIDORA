
import React, { useState } from 'react';
import { ChevronRight, Leaf, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { KidoraLogo } from './HomeScreen';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  {
    title: "Eco-Conscious Parenting",
    description: "Join 12k+ moms in SEA giving premium gear a second life. Reduce your carbon footprint with every reuse.",
    icon: <Leaf size={40} className="text-[#007d34]" />,
    bg: "bg-[#e6f2eb]",
    emoji: "🌱"
  },
  {
    title: "Premium Gear, Smart Savings",
    description: "Access brands like Bugaboo and Stokke at up to 70% off retail. Quality gear shouldn't cost the Earth.",
    icon: <Sparkles size={40} className="text-amber-500" />,
    bg: "bg-amber-50",
    emoji: "💎"
  },
  {
    title: "Verified Mom Community",
    description: "Shop with peace of mind. Every high-impact item is quality-checked and every seller is verified.",
    icon: <ShieldCheck size={40} className="text-blue-500" />,
    bg: "bg-blue-50",
    emoji: "🤝",
    isLogoStep: true
  }
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentData = ONBOARDING_STEPS[step];

  return (
    <div className="flex flex-col h-full bg-white px-8 pt-20 pb-12 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10">
        {/* Visual Container */}
        <div className={`w-48 h-48 ${currentData.bg} rounded-[64px] flex items-center justify-center relative shadow-inner animate-in zoom-in-75 duration-500`}>
          {currentData.isLogoStep ? (
            <KidoraLogo size={100} />
          ) : (
            <div className="text-6xl">{currentData.emoji}</div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-white p-4 rounded-3xl shadow-xl">
            {currentData.icon}
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 max-w-xs animate-in slide-in-from-bottom-4 duration-500 delay-200">
          <h1 className="text-3xl font-black text-gray-900 leading-tight">
            {currentData.title}
          </h1>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            {currentData.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2.5">
          {ONBOARDING_STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#007d34]' : 'w-1.5 bg-gray-100'}`} 
            />
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-6">
        <button 
          onClick={handleNext}
          className="w-full bg-[#007d34] text-white py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-green-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <span>{step === ONBOARDING_STEPS.length - 1 ? "Start Your Journey" : "Next Step"}</span>
          {step === ONBOARDING_STEPS.length - 1 ? <ArrowRight size={18} strokeWidth={3} /> : <ChevronRight size={18} strokeWidth={3} />}
        </button>

        {step < ONBOARDING_STEPS.length - 1 && (
          <button 
            onClick={onComplete}
            className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
          >
            Skip Intro
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
