
import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, X, 
  ChevronRight, UploadCloud, 
  LucideIcon, Package, Recycle, Heart, Shield
} from 'lucide-react';
import { getAIPricingSuggestion, verifyProductAuthenticity } from '../services/geminiService';
import { NewListing } from '../types';

interface SellWizardScreenProps {
  onClose: () => void;
  onPublish: (listing: NewListing) => void;
}

const AGE_RANGES = [
  '0-3 month',
  '3-6 month',
  '6-9 month',
  '9-12 month',
  '12-18 month',
  '18-24 month',
  '2 years old',
  '3 years old',
  '4 years old',
  '5 years old'
];

const GENDERS = ['Boy', 'Girl', 'Unisex'];

const CONDITION_DEFS: Record<string, { description: string, subtext: string, icon: LucideIcon }> = {
  'New': { description: 'Brand new, in original packaging with tags.', subtext: 'Never Used', icon: Package },
  'Brand new (open box)': { description: 'New item, but packaging has been opened.', subtext: 'Open Box', icon: Package },
  'New but try once': { description: 'Tried on once, but never used outdoors.', subtext: 'Like New', icon: Package },
  'Pre-loved': { description: 'Gently used and looking for a new home.', subtext: 'Gently Used', icon: Recycle },
  'Well-loved': { description: 'Shows signs of use but still functional.', subtext: 'Used', icon: Recycle },
  'Donation': { description: 'Free for someone who needs it.', subtext: 'Free', icon: Heart }
};

const SellWizardScreen: React.FC<SellWizardScreenProps> = ({ onClose, onPublish }) => {
  const [step, setStep] = useState(1);
  const [listing, setListing] = useState<NewListing>({
    name: '',
    brand: '',
    category: '',
    condition: 'Pre-loved',
    originalPrice: 0,
    price: 0,
    description: '',
    age: '0-3 month',
    gender: 'Unisex',
    photos: []
  });
  
  const [loadingAI, setLoadingAI] = useState(false);
  const [verificationReport, setVerificationReport] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [, setLoadedPhotos] = useState<Set<string>>(new Set());
  const [, setUploadProgress] = useState<Record<string, number>>({});

  const totalSteps = 5;

  const handleNext = async () => {
    if (step === 2 && listing.name && listing.originalPrice) {
      setLoadingAI(true);
      try {
        const [pricingRes, verifyRes] = await Promise.all([
          getAIPricingSuggestion({
            name: listing.name,
            brand: listing.brand,
            originalPrice: listing.originalPrice,
            condition: listing.condition
          }),
          verifyProductAuthenticity({
            name: listing.name,
            brand: listing.brand,
            description: listing.description,
            price: listing.originalPrice * 0.6, // Estimate for verification
            originalPrice: listing.originalPrice
          })
        ]);
        
        setListing(prev => ({ 
          ...prev, 
          price: listing.condition === 'Donation' ? 0 : pricingRes.suggestedPrice,
          isVerified: verifyRes.isVerified,
          verificationDetails: verifyRes.verificationReport
        }));
        setVerificationReport(verifyRes.verificationReport);
      } catch (error) {
        console.error("AI processing failed:", error);
      } finally {
        setLoadingAI(false);
        setStep(3);
      }
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onPublish(listing);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 6 - listing.photos.length);
      const newPhotoUrls = newFiles.map((file: File) => URL.createObjectURL(file));
      
      setListing(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotoUrls]
      }));

      newPhotoUrls.forEach(url => {
        let progress = 0;
        setUploadProgress(prev => ({ ...prev, [url]: 0 }));
        const interval = setInterval(() => {
          progress += Math.random() * 20 + 10;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          setUploadProgress(prev => ({ ...prev, [url]: progress }));
        }, 120);
      });
    }
  };

  const onImageLoad = (url: string) => {
    setLoadedPhotos(prev => {
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  };

  const removePhoto = (index: number) => {
    setListing(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="px-6">
              <h2 className="text-2xl font-bold text-gray-900">Add some photos</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Bright, clear photos help items sell faster.</p>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileChange} />
            <div className="px-6">
              <button onClick={() => fileInputRef.current?.click()} className="w-full bg-[#e6f2eb] border-2 border-dashed border-[#007d34]/30 rounded-[32px] py-10 flex flex-col items-center justify-center gap-3 transition-all hover:bg-[#d9ede1] group">
                <div className="p-4 bg-white rounded-2xl text-[#007d34] shadow-sm"><UploadCloud size={32} /></div>
                <div className="text-center">
                  <p className="text-sm font-black text-[#007d34] uppercase tracking-wider">Upload from Device</p>
                  <p className="text-[10px] text-[#007d34]/60 font-bold uppercase tracking-widest mt-1">Select up to 6 photos</p>
                </div>
              </button>
            </div>
            <div className="px-6 grid grid-cols-3 gap-3">
              {listing.photos.map((photo, idx) => (
                <div key={photo} className="aspect-square rounded-[24px] overflow-hidden bg-gray-50 border border-gray-100 relative shadow-sm">
                  <img src={photo} onLoad={() => onImageLoad(photo)} className="w-full h-full object-cover" alt="" />
                  <button onClick={() => removePhoto(idx)} className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg shadow-lg"><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 px-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tell us about it</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Details help moms find exactly what they need.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Name</label>
                <input className="w-full bg-gray-50 border border-gray-100 rounded-[20px] p-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none transition-all shadow-sm" placeholder="e.g. Bugaboo Fox 3 Stroller" value={listing.name} onChange={(e) => setListing({...listing, name: e.target.value})} />
              </div>
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condition</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(CONDITION_DEFS).map(([c, def]) => (
                    <button 
                      key={c}
                      onClick={() => setListing({...listing, condition: c})}
                      className={`flex flex-col items-center gap-2 p-4 rounded-[24px] border-2 transition-all ${listing.condition === c ? 'border-[#007d34] bg-[#e6f2eb]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                    >
                      <div className={`p-2 rounded-xl ${listing.condition === c ? 'bg-[#007d34] text-white' : 'bg-gray-50 text-gray-400'}`}>
                        <def.icon size={20} />
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-black text-gray-900 leading-tight">{c}</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">{def.subtext}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Original Price</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-[20px] p-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none transition-all shadow-sm" placeholder="THB" value={listing.originalPrice || ''} onChange={(e) => setListing({...listing, originalPrice: Number(e.target.value)})} />
              </div>
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age Range</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_RANGES.map(age => (
                    <button 
                      key={age}
                      onClick={() => setListing({...listing, age})}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${listing.age === age ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-100'}`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                <div className="flex gap-3">
                  {GENDERS.map(gender => (
                      <button 
                        key={gender}
                        onClick={() => setListing({...listing, gender: gender as 'Boy' | 'Girl' | 'Unisex'})}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${listing.gender === gender ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-400 border-gray-100'}`}
                      >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
      case 4:
      case 5:
        return (
          <div className="px-6 space-y-6">
            <h2 className="text-2xl font-bold">Review Price & Details</h2>
            <div className="bg-gray-900 text-white p-10 rounded-[40px] text-center shadow-xl">
               <p className="text-[10px] font-black uppercase opacity-60 mb-2">Set Your Price</p>
               <div className="flex items-center justify-center gap-2">
                 <span className="text-2xl font-black opacity-40">THB</span>
                 <input type="number" className="bg-transparent border-none text-6xl font-black text-center w-40 outline-none" value={listing.price || ''} onChange={(e) => setListing({...listing, price: Number(e.target.value)})} />
               </div>
            </div>
            <div className="bg-white border border-gray-100 p-6 rounded-[32px] space-y-4 shadow-sm">
                <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-gray-400">Condition</span><span className="text-sm font-black text-gray-900">{listing.condition}</span></div>
                <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-gray-400">Original</span><span className="text-sm font-black text-gray-900">THB {listing.originalPrice}</span></div>
            </div>
            
            {verificationReport && (
              <div className="bg-green-50 border border-green-100 p-6 rounded-[32px] space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-[#007d34]">
                  <Shield size={16} fill="currentColor" fillOpacity={0.2} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Gemini Authenticity Report</span>
                </div>
                <p className="text-xs font-medium text-gray-700 leading-relaxed">{verificationReport}</p>
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="pt-8 px-6 pb-4 flex items-center justify-between">
        <button onClick={onClose} className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500"><ChevronLeft size={20} /></button>
        <h1 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {step} of {totalSteps}</h1>
        <div className="w-10" />
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">{renderStep()}</div>
      <div className="absolute bottom-8 left-6 right-6 flex gap-3 max-w-md mx-auto">
        {step > 1 && <button onClick={() => setStep(step - 1)} className="flex-1 bg-gray-50 text-gray-900 py-4.5 rounded-[22px] font-black border border-gray-100">Back</button>}
            <button onClick={handleNext} className="flex-[2] bg-[#007d34] text-white py-4.5 rounded-[22px] font-black flex items-center justify-center gap-3 disabled:opacity-50" disabled={loadingAI}>
          <span>{step === totalSteps ? 'Publish' : 'Next Step'}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default SellWizardScreen;
