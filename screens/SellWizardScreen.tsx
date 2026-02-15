
import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Camera, Plus, CheckCircle2, Zap, Loader2, Info, Search, X, 
  ChevronRight, UploadCloud, Save, Check, Baby, Move, Wand2, Sparkles, 
  Image as ImageIcon, AlertCircle, Edit3, ShoppingCart, Gamepad2, Shirt, 
  Milk, Bed, ShieldCheck, BookOpen, Bath, LucideIcon, Flame, Droplets, CheckSquare
} from 'lucide-react';
import { PRIMARY_COLOR } from '../constants';
import { getAIPricingSuggestion, enhanceProductPhoto } from '../services/geminiService';
import { NewListing } from '../types';

interface SellWizardScreenProps {
  onClose: () => void;
  onPublish: (listing: NewListing) => void;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  color: string;
  isTrending?: boolean;
}

const CATEGORIES: Category[] = [
  { id: 'strollers', name: 'Strollers', description: 'Prams, buggies & travel systems', icon: ShoppingCart, bgColor: 'bg-blue-50', color: 'text-blue-600', isTrending: true },
  { id: 'toys', name: 'Toys', description: 'Educational, plush & outdoor play', icon: Gamepad2, bgColor: 'bg-orange-50', color: 'text-orange-600', isTrending: true },
  { id: 'clothing', name: 'Clothing', description: 'Outfits, shoes & seasonal wear', icon: Shirt, bgColor: 'bg-pink-50', color: 'text-pink-600' },
  { id: 'feeding', name: 'Feeding', description: 'High chairs, pumps & bottles', icon: Milk, bgColor: 'bg-yellow-50', color: 'text-yellow-600' },
  { id: 'nursery', name: 'Nursery', description: 'Cots, bedding & decor', icon: Bed, bgColor: 'bg-purple-50', color: 'text-purple-600' },
  { id: 'gear', name: 'Safety Gear', description: 'Car seats, monitors & gates', icon: ShieldCheck, bgColor: 'bg-green-50', color: 'text-green-600' },
  { id: 'books', name: 'Books', description: 'Picture books, early learning', icon: BookOpen, bgColor: 'bg-indigo-50', color: 'text-indigo-600' },
  { id: 'bath', name: 'Bath & Potty', description: 'Tubs, towels & trainers', icon: Bath, bgColor: 'bg-cyan-50', color: 'text-cyan-600' },
];

const AGE_RANGES = [
  '0-6 months', 
  '6-12 months', 
  '1-2 years', 
  '2-4 years', 
  '4-6 years', 
  '6+ years'
];

const CONDITION_DEFS: Record<string, string> = {
  'New': 'Unused, in original packaging with tags.',
  'Like New': 'Used a few times, no visible signs of wear.',
  'Good': 'Minor visible wear, well-cared for.',
  'Fair': 'Visible wear but fully functional.'
};

const SellWizardScreen: React.FC<SellWizardScreenProps> = ({ onClose, onPublish }) => {
  const [step, setStep] = useState(1);
  const [listing, setListing] = useState<NewListing>({
    name: '',
    brand: '',
    category: '',
    condition: 'Like New',
    originalPrice: 0,
    price: 0,
    description: '',
    age: '0-12 months',
    photos: []
  });
  
  const [cleaningService, setCleaningService] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [enhancingIdx, setEnhancingIdx] = useState<number | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for progressive image loading and feedback
  const [loadedPhotos, setLoadedPhotos] = useState<Set<string>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [enhancedPhotos, setEnhancedPhotos] = useState<Set<string>>(new Set());
  const [justEnhanced, setJustEnhanced] = useState<number | null>(null);

  const totalSteps = 5;

  useEffect(() => {
    const savedDraft = localStorage.getItem('kidora_listing_draft');
    const savedStep = localStorage.getItem('kidora_listing_step');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setListing({ ...parsed, photos: [] });
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
    if (savedStep) {
      setStep(parseInt(savedStep, 10));
    }
  }, []);

  const saveDraft = () => {
    setSaveStatus('saving');
    localStorage.setItem('kidora_listing_draft', JSON.stringify({ ...listing, photos: [] }));
    localStorage.setItem('kidora_listing_step', step.toString());
    
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  const clearDraft = () => {
    localStorage.removeItem('kidora_listing_draft');
    localStorage.removeItem('kidora_listing_step');
  };

  const handleNext = async () => {
    if (step === 2 && listing.name && listing.originalPrice) {
      setLoadingAI(true);
      const res = await getAIPricingSuggestion({
        name: listing.name,
        brand: listing.brand,
        originalPrice: listing.originalPrice,
        condition: listing.condition
      });
      setAiResult(res);
      setListing(prev => ({ ...prev, price: res.suggestedPrice }));
      setLoadingAI(false);
      setStep(3);
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      clearDraft();
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

      // Simulate upload progress for each new photo
      newPhotoUrls.forEach(url => {
        let progress = 0;
        setUploadProgress(prev => ({ ...prev, [url]: 0 }));
        
        const interval = setInterval(() => {
          progress += Math.random() * 20 + 10;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
              setUploadProgress(prev => {
                const next = { ...prev };
                delete next[url];
                return next;
              });
            }, 1200);
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
    const photoToRemove = listing.photos[index];
    setListing(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setLoadedPhotos(prev => {
      const next = new Set(prev);
      next.delete(photoToRemove);
      return next;
    });
    setEnhancedPhotos(prev => {
      const next = new Set(prev);
      next.delete(photoToRemove);
      return next;
    });
    setUploadProgress(prev => {
      const next = { ...prev };
      delete next[photoToRemove];
      return next;
    });
    URL.revokeObjectURL(photoToRemove);
  };

  const blobToBase64 = (url: string): Promise<{ data: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve({ data: base64String, mimeType: blob.type });
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  const handleEnhance = async (idx: number) => {
    if (enhancingIdx !== null) return;
    setEnhancingIdx(idx);
    const oldUrl = listing.photos[idx];
    try {
      const { data, mimeType } = await blobToBase64(oldUrl);
      const enhancedUrl = await enhanceProductPhoto(data, mimeType);
      
      const newPhotos = [...listing.photos];
      newPhotos[idx] = enhancedUrl;
      
      setLoadedPhotos(prev => {
        const next = new Set(prev);
        next.delete(oldUrl); 
        return next;
      });
      setEnhancedPhotos(prev => {
        const next = new Set(prev);
        next.add(enhancedUrl);
        return next;
      });
      setListing({ ...listing, photos: newPhotos });
      setJustEnhanced(idx);
      setTimeout(() => setJustEnhanced(null), 2500);
    } catch (err) {
      console.error("Failed to enhance", err);
      alert("AI Enhancement failed. Please try again later.");
    } finally {
      setEnhancingIdx(null);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    
    const newPhotos = [...listing.photos];
    const item = newPhotos[draggedIdx];
    newPhotos.splice(draggedIdx, 1);
    newPhotos.splice(idx, 0, item);
    setListing({ ...listing, photos: newPhotos });
    setDraggedIdx(idx);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const filteredCategories = CATEGORIES.filter(c => 
    c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.description.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const getPriceValidation = () => {
    if (!aiResult) return null;
    const suggested = aiResult.suggestedPrice;
    const current = listing.price;
    const original = listing.originalPrice;
    
    const minReasonable = Math.round(suggested * 0.8);
    const maxReasonable = Math.round(suggested * 1.2);
    
    if (current > original) {
      return { 
        type: 'error' as const, 
        message: `Price cannot exceed original retail (SGD ${original})` 
      };
    }
    
    if (current < minReasonable) {
      return { 
        type: 'warning' as const, 
        message: 'This price is significantly lower than average.' 
      };
    }
    
    if (current > maxReasonable) {
      return { 
        type: 'warning' as const, 
        message: 'This price is higher than similar items. Might sell slower.' 
      };
    }
    
    return null;
  };

  const validation = getPriceValidation();

  const renderStepIndicator = () => (
    <div className="flex gap-2 px-6 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div 
          key={i + 1} 
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i + 1 <= step ? 'bg-[#007d34]' : 'bg-gray-100'}`} 
        />
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1: // Photos
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="px-6">
              <h2 className="text-2xl font-bold text-gray-900">Add some photos</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Bright, clear photos help items sell faster.</p>
            </div>

            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange}
            />

            <div className="px-6">
              <button 
                onClick={triggerFileUpload}
                className="w-full bg-[#e6f2eb] border-2 border-dashed border-[#007d34]/30 rounded-[32px] py-10 flex flex-col items-center justify-center gap-3 transition-all hover:bg-[#d9ede1] group active:scale-[0.98]"
              >
                <div className="p-4 bg-white rounded-2xl text-[#007d34] shadow-sm group-hover:scale-110 transition-transform">
                  <UploadCloud size={32} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-[#007d34] uppercase tracking-wider">Upload from Device</p>
                  <p className="text-[10px] text-[#007d34]/60 font-bold uppercase tracking-widest mt-1">Select up to 6 photos</p>
                </div>
              </button>
            </div>

            <div className="px-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Photos ({listing.photos.length}/6)</p>
                {listing.photos.length > 1 && (
                  <p className="text-[9px] font-bold text-[#007d34] uppercase tracking-widest flex items-center gap-1.5 bg-[#e6f2eb] px-3 py-1 rounded-full">
                    <Move size={10} />
                    Drag to reorder
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {listing.photos.map((photo, idx) => {
                  const isLoaded = loadedPhotos.has(photo);
                  const progress = uploadProgress[photo] || 0;
                  const isUploading = progress > 0 && progress <= 100 && uploadProgress.hasOwnProperty(photo);
                  const isEnhanced = enhancedPhotos.has(photo);
                  const isJustEnhanced = justEnhanced === idx;

                  return (
                    <div 
                      key={photo}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`aspect-square rounded-[24px] overflow-hidden bg-gray-50 border border-gray-100 relative group cursor-grab active:cursor-grabbing transition-all duration-300 ${draggedIdx === idx ? 'opacity-40 scale-95 shadow-inner' : 'opacity-100 scale-100 shadow-sm'}`}
                    >
                      {/* Progressive Loading Shimmer */}
                      {!isLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                      )}

                      <img 
                        src={photo} 
                        onLoad={() => onImageLoad(photo)}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${isUploading ? 'blur-[4px] scale-110' : ''}`} 
                        alt={`Preview ${idx + 1}`} 
                      />
                      
                      {/* Upload Progress Overlay */}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 gap-3 z-30 animate-in fade-in duration-300">
                           {progress < 100 ? (
                             <>
                               <div className="flex flex-col items-center gap-1">
                                 <Loader2 size={16} className="text-[#00ff6a] animate-spin" />
                                 <div className="text-[8px] font-black text-white uppercase tracking-widest">Uploading</div>
                               </div>
                               <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden border border-white/10">
                                  <div 
                                    className="h-full bg-[#00ff6a] transition-all duration-300 shadow-[0_0_12px_#00ff6a]" 
                                    style={{ width: `${progress}%` }} 
                                  />
                               </div>
                               <span className="text-[8px] font-black text-white/70">{Math.round(progress)}%</span>
                             </>
                           ) : (
                             <div className="flex flex-col items-center gap-2 animate-in zoom-in-75 duration-300">
                                <div className="p-2.5 bg-[#007d34] rounded-full text-white shadow-xl scale-110 animate-pulse">
                                   <Check size={20} strokeWidth={4} />
                                </div>
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Ready</span>
                             </div>
                           )}
                        </div>
                      )}

                      {/* AI Enhanced Badge */}
                      {isEnhanced && !isUploading && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[7px] font-black px-2 py-1 rounded-lg shadow-lg border border-white/20 animate-in zoom-in-75 z-20 shadow-orange-500/20">
                           <Sparkles size={8} fill="currentColor" />
                           <span className="uppercase tracking-widest">AI READY</span>
                        </div>
                      )}

                      {/* Success Animation for AI Enhancement */}
                      {isJustEnhanced && (
                        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none overflow-hidden">
                            <div className="absolute inset-0 bg-[#007d34]/20 animate-out fade-out duration-1000 fill-mode-forwards" />
                            <div className="p-3 bg-white rounded-full shadow-2xl animate-in zoom-in-50 spin-in-90 duration-700">
                                <Sparkles size={32} className="text-amber-500 fill-amber-500" />
                            </div>
                        </div>
                      )}

                      {/* Action Overlays (Hidden during upload) */}
                      {isLoaded && !isUploading && (
                        <div className="absolute inset-x-2 bottom-2 flex justify-between gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnhance(idx);
                            }}
                            disabled={enhancingIdx !== null}
                            className={`p-2 rounded-xl shadow-xl border border-white/20 active:scale-90 transition-all ${enhancingIdx === idx ? 'bg-[#007d34] text-white' : isEnhanced ? 'bg-amber-500 text-white border-amber-400' : 'bg-white/90 backdrop-blur text-[#007d34] hover:bg-white'}`}
                          >
                            {enhancingIdx === idx ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} strokeWidth={3} />}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removePhoto(idx);
                            }}
                            className="p-2 bg-red-500/90 backdrop-blur text-white rounded-xl shadow-xl border border-white/20 hover:bg-red-600 active:scale-90 transition-all"
                          >
                            <X size={12} strokeWidth={3} />
                          </button>
                        </div>
                      )}

                      {/* Labels */}
                      {isLoaded && idx === 0 && (
                        <div className="absolute top-2 left-2 bg-[#007d34] text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl shadow-lg border border-white/20 animate-in zoom-in-75 z-10">
                          Main
                        </div>
                      )}

                      {/* AI Processing Overlay */}
                      {enhancingIdx === idx && (
                        <div className="absolute inset-0 bg-[#007d34]/70 backdrop-blur-xl flex flex-col items-center justify-center text-white p-4 z-40 animate-in fade-in duration-300">
                          <div className="relative mb-4">
                             <div className="w-16 h-16 border-4 border-white/20 border-t-[#00ff6a] rounded-full animate-spin shadow-inner" />
                             <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" />
                          </div>
                          <div className="text-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1">AI Cleaning</span>
                            <div className="flex gap-1 justify-center">
                              <div className="w-1 h-1 bg-[#00ff6a] rounded-full animate-bounce [animation-delay:-0.3s]" />
                              <div className="w-1 h-1 bg-[#00ff6a] rounded-full animate-bounce [animation-delay:-0.15s]" />
                              <div className="w-1 h-1 bg-[#00ff6a] rounded-full animate-bounce" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fallback for Processing */}
                      {!isLoaded && !isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                             <ImageIcon size={20} className="text-gray-200 animate-pulse" />
                             <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Decoding</span>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
                    </div>
                  );
                })}
                
                {Array.from({ length: Math.max(0, 6 - listing.photos.length) }).map((_, i) => (
                  <button 
                    key={`empty-${i}`}
                    onClick={triggerFileUpload}
                    className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-[24px] flex flex-col items-center justify-center text-gray-300 transition-all hover:border-[#007d34]/30 hover:bg-gray-100 active:scale-95"
                  >
                    {listing.photos.length === 0 && i === 0 ? (
                      <>
                        <Camera size={24} />
                        <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">Main</span>
                      </>
                    ) : (
                      <Plus size={20} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6">
              <div className="bg-[#e6f2eb] p-6 rounded-[32px] flex gap-5 border border-[#007d34]/10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-5%] w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="p-3 bg-white rounded-2xl text-[#007d34] shadow-sm shrink-0 h-fit">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div className="space-y-1.5 relative z-10">
                  <p className="text-[11px] text-[#007d34] font-black uppercase tracking-widest">Premium AI Studio</p>
                  <p className="text-[11px] text-[#007d34]/70 leading-relaxed font-semibold">
                    Our AI removes messy backgrounds and balances lighting in seconds. 
                    <span className="block mt-1 text-[#007d34] font-black">Professional photos sell 4x faster!</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2: // Details
        return (
          <div className="space-y-8 px-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tell us about it</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Details help moms find exactly what they need.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Name</label>
                <input 
                  className="w-full bg-gray-50 border border-gray-100 rounded-[20px] p-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none transition-all shadow-sm"
                  placeholder="e.g. Bugaboo Fox 3 Stroller"
                  value={listing.name}
                  onChange={(e) => setListing({...listing, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                <button 
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="w-full flex items-center justify-between bg-gray-50 border border-gray-100 rounded-[20px] p-4 text-sm font-semibold text-left shadow-sm hover:bg-gray-100 transition-colors group"
                >
                  {listing.category ? (
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-[#e6f2eb] rounded-lg">
                        {React.createElement(CATEGORIES.find(c => c.name === listing.category)?.icon || ImageIcon, { size: 16, className: 'text-[#007d34]' })}
                      </div>
                      <span className="text-gray-900">{listing.category}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Select a category</span>
                  )}
                  <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand</label>
                  <input 
                    className="w-full bg-gray-50 border border-gray-100 rounded-[20px] p-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none transition-all shadow-sm"
                    placeholder="e.g. Bugaboo"
                    value={listing.brand}
                    onChange={(e) => setListing({...listing, brand: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Retail Price</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-100 rounded-[20px] p-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none transition-all shadow-sm"
                    placeholder="SGD"
                    value={listing.originalPrice || ''}
                    onChange={(e) => setListing({...listing, originalPrice: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Age Range</label>
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase text-[#007d34] tracking-widest opacity-60">
                    <Baby size={10} />
                    <span>Selected: {listing.age}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {AGE_RANGES.map(age => (
                    <button 
                      key={age}
                      onClick={() => setListing({...listing, age})}
                      className={`px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border shadow-sm flex items-center justify-center gap-2 ${listing.age === age ? 'bg-[#007d34] text-white border-[#007d34] shadow-[#007d34]/20' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
                    >
                      {listing.age === age && <Check size={12} strokeWidth={4} />}
                      <span>{age}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condition</label>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                  {Object.keys(CONDITION_DEFS).map(c => (
                    <div key={c} className="relative group shrink-0">
                      <button 
                        onClick={() => setListing({...listing, condition: c})}
                        className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${listing.condition === c ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
                      >
                        <span>{c}</span>
                        <Info size={12} className={listing.condition === c ? 'text-white/60' : 'text-gray-300'} />
                      </button>
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-900 text-white text-[10px] p-3 rounded-2xl opacity-0 group-hover:opacity-100 group-active:opacity-100 pointer-events-none transition-opacity z-50 shadow-2xl">
                        <p className="font-black uppercase tracking-widest mb-1 text-[8px] text-white/50">{c}</p>
                        {CONDITION_DEFS[c]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                   <p className="text-[10px] font-medium text-gray-500 italic flex items-center gap-2">
                    <Info size={10} className="text-gray-400" />
                    {CONDITION_DEFS[listing.condition]}
                   </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // AI Pricing
        return (
          <div className="space-y-6 px-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dynamic Pricing</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Our AI analyzed thousands of sales across SEA.</p>
            </div>
            {loadingAI ? (
               <div className="flex flex-col items-center justify-center py-20 gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-[#007d34]/10 border-t-[#007d34] rounded-full animate-spin" />
                    <Zap size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#007d34] fill-current opacity-80" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-gray-900">Evaluating your item...</p>
                    <p className="text-xs text-gray-400 font-medium">Checking local market benchmarks</p>
                  </div>
               </div>
            ) : (
              <div className="space-y-8">
                <div className={`bg-gradient-to-br transition-all duration-500 ${validation?.type === 'error' ? 'from-red-600 to-red-800' : 'from-[#007d34] to-[#015e27]'} rounded-[40px] p-10 text-white text-center relative overflow-hidden shadow-xl shadow-green-900/20`}>
                   <div className="relative z-10">
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-5">Your Listing Price</p>
                    
                    <div className="flex items-center justify-center gap-3 group">
                        <span className="text-3xl font-black opacity-60">SGD</span>
                        <input 
                            type="number"
                            className="bg-transparent border-none text-6xl font-black text-center w-40 outline-none focus:ring-0 placeholder-white/20"
                            value={listing.price || ''}
                            onChange={(e) => setListing({...listing, price: Number(e.target.value)})}
                            placeholder="0"
                        />
                        <Edit3 size={24} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-3">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                            <Zap size={12} fill="white" className="animate-pulse" />
                            <span>AI Suggested: SGD {aiResult?.suggestedPrice}</span>
                        </div>
                        
                        <div className="text-[10px] font-bold text-white/60 flex items-center gap-1.5">
                            <CheckCircle2 size={12} />
                            Recommended Range: SGD {Math.round(aiResult?.suggestedPrice * 0.8)} - {Math.round(aiResult?.suggestedPrice * 1.2)}
                        </div>
                    </div>
                   </div>
                   <div className="absolute top-[-40%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                   <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-[#00ff6a]/10 rounded-full blur-2xl" />
                </div>

                {validation && (
                  <div className={`flex items-start gap-4 p-5 rounded-[28px] border animate-in slide-in-from-top-2 duration-300 ${validation.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                    <div className={`p-2 rounded-xl bg-white shadow-sm shrink-0 ${validation.type === 'error' ? 'text-red-500' : 'text-orange-500'}`}>
                        <AlertCircle size={18} />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-xs font-black uppercase tracking-wider">{validation.type === 'error' ? 'Pricing Limit' : 'Price Advisory'}</p>
                        <p className="text-[11px] font-medium opacity-80">{validation.message}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">AI Intelligence Report</p>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium italic">"{aiResult?.reasoning}"</p>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-green-50 rounded-[28px] border border-green-100/50">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white rounded-2xl text-[#007d34] shadow-sm">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[#007d34] uppercase tracking-wider">Resale Index</span>
                        <span className="text-[10px] text-green-600 font-bold opacity-70">High search volume for this brand</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-white bg-[#007d34] px-3 py-1.5 rounded-xl uppercase tracking-widest">{aiResult?.marketTrend} Trend</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 4: // Cleaning Process
        return (
          <div className="space-y-6 px-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cleaning & Prep</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Spotless items get 5-star reviews and sell faster.</p>
            </div>

            <div className="space-y-4">
               {/* Option 1: DIY */}
               <button
                  onClick={() => setCleaningService(false)}
                  className={`w-full flex items-start gap-4 p-5 rounded-[28px] border-2 transition-all text-left group ${!cleaningService ? 'border-[#007d34] bg-[#e6f2eb]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
               >
                  <div className={`p-3 rounded-2xl transition-colors ${!cleaningService ? 'bg-[#007d34] text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                     <CheckSquare size={24} />
                  </div>
                  <div className="flex-1">
                     <p className={`font-black text-sm ${!cleaningService ? 'text-[#007d34]' : 'text-gray-900'}`}>I'll clean it myself</p>
                     <p className="text-[11px] font-medium text-gray-500 mt-1 leading-relaxed">I will ensure the item is washed, sanitized, and fully prepped for the next family.</p>
                  </div>
               </button>

               {/* Option 2: Kidora Refresh */}
               <button
                  onClick={() => setCleaningService(true)}
                  className={`w-full flex items-start gap-4 p-5 rounded-[28px] border-2 transition-all text-left overflow-hidden relative group ${cleaningService ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
               >
                  {cleaningService && <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />}
                  <div className={`p-3 rounded-2xl relative z-10 transition-colors ${cleaningService ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                     <Droplets size={24} />
                  </div>
                  <div className="flex-1 relative z-10">
                     <div className="flex justify-between items-center mb-1">
                         <p className={`font-black text-sm ${cleaningService ? 'text-blue-700' : 'text-gray-900'}`}>Kidora Refresh™</p>
                         <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${cleaningService ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>SGD 15.00</span>
                     </div>
                     <p className="text-[11px] font-medium text-gray-500 leading-relaxed">Professional deep cleaning, UV sanitization, and fabric steaming done by our experts.</p>
                  </div>
               </button>
            </div>

            {/* Contextual Info Box */}
            <div className={`p-6 rounded-[28px] border transition-all duration-300 ${cleaningService ? 'bg-white border-blue-100 shadow-xl shadow-blue-900/5' : 'bg-gray-50 border-gray-100'}`}>
                {cleaningService ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <Sparkles size={16} className="text-blue-500" />
                           <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">What's Included</h4>
                        </div>
                        <ul className="space-y-3">
                           {['Eco-friendly deep stain removal', 'Medical-grade UV-C sterilization', 'Fabric steaming and pressing', 'Fee simply deducted from your final sale'].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                 {item}
                              </li>
                           ))}
                        </ul>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                           <ShieldCheck size={16} className="text-[#007d34]" />
                           <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">DIY Checklist</h4>
                        </div>
                        <ul className="space-y-3">
                           {['Machine wash all removable fabrics', 'Wipe down hard surfaces with child-safe cleaner', 'Check all buckles, wheels, and joints for debris'].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                 <div className="w-1.5 h-1.5 rounded-full bg-[#007d34] shrink-0" />
                                 {item}
                              </li>
                           ))}
                        </ul>
                    </div>
                )}
            </div>
          </div>
        );
      case 5: // Summary
        return (
          <div className="space-y-6 px-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review Listing</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Final check before other moms see it!</p>
            </div>
            <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50">
              <div className="h-56 bg-gray-50 relative">
                 {listing.photos.length > 0 ? (
                   <img src={listing.photos[0]} className="w-full h-full object-cover" alt="Cover" />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                      <Camera size={64} strokeWidth={1.5} />
                   </div>
                 )}
                 <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 text-gray-600">
                    {listing.photos.length || 0} Photos Added
                 </div>
              </div>
              <div className="p-8 space-y-4">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-black text-xl text-gray-900">{listing.name}</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-[#007d34] uppercase tracking-widest">{listing.brand}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{listing.condition}</span>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-[#007d34]">SGD {listing.price}</span>
                 </div>
                 <div className="flex gap-2 py-2">
                    <span className="bg-gray-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100">{listing.age}</span>
                    <span className="bg-green-50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#007d34] border border-green-100">~4.2kg CO2 saved</span>
                 </div>

                 {/* Financial Breakdown */}
                 <div className="pt-4 border-t border-gray-100 space-y-2.5">
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                       <span>Selling Price</span>
                       <span className="text-gray-900">SGD {listing.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                       <span>Kidora Platform Fee (10%)</span>
                       <span className="text-red-500">- SGD {(listing.price * 0.1).toFixed(2)}</span>
                    </div>
                    {cleaningService && (
                      <div className="flex justify-between text-xs font-bold text-gray-500">
                         <span>Kidora Refresh™ Service</span>
                         <span className="text-red-500">- SGD 15.00</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expected Earnings</span>
                       <span className="text-2xl font-black text-[#007d34]">
                         SGD {Math.max(0, listing.price - (listing.price * 0.1) - (cleaningService ? 15 : 0)).toFixed(2)}
                       </span>
                    </div>
                 </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center leading-relaxed font-bold px-8">
              By publishing, you confirm your item is genuine and follows Kidora safety standards.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="pt-8 px-6 pb-4 flex items-center justify-between">
        <button onClick={onClose} className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {step} of {totalSteps}</h1>
        
        <button 
          onClick={saveDraft}
          disabled={saveStatus !== 'idle'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all active:scale-95 ${saveStatus === 'saved' ? 'bg-[#007d34] text-white border-[#007d34]' : 'bg-white text-[#007d34] border-[#007d34]/20 hover:bg-green-50'}`}
        >
          {saveStatus === 'saving' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saveStatus === 'saved' ? (
            <Check size={14} strokeWidth={3} />
          ) : (
            <Save size={14} />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Draft'}
          </span>
        </button>
      </div>

      {renderStepIndicator()}

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        {renderStep()}
      </div>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 flex flex-col max-h-[85vh]">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 shrink-0" />
            
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black text-gray-900">Category</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6 font-medium">Where does your item belong?</p>

            <div className="relative mb-6 shrink-0">
              <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                <Search size={18} />
              </div>
              <input 
                type="text"
                placeholder="Search categories (e.g. prams, toys)..."
                className="w-full bg-gray-50 border border-gray-100 rounded-[24px] pl-11 pr-11 py-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none transition-all shadow-inner"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
              {categorySearch && (
                <button 
                  onClick={() => setCategorySearch('')}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="overflow-y-auto hide-scrollbar space-y-4 pb-6">
              {filteredCategories.length > 0 ? (
                <div className="space-y-3">
                  {filteredCategories.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => {
                        setListing({...listing, category: cat.name});
                        setIsCategoryModalOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-[28px] transition-all border group active:scale-[0.98] ${listing.category === cat.name ? 'bg-gradient-to-r from-[#007d34] to-[#015e27] border-[#007d34] text-white shadow-xl shadow-green-900/10' : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200'}`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${listing.category === cat.name ? 'bg-white/20' : cat.bgColor}`}>
                        {React.createElement(cat.icon, { size: 28, className: listing.category === cat.name ? 'text-white' : cat.color })}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[12px] font-black uppercase tracking-widest ${listing.category === cat.name ? 'text-white' : 'text-gray-900'}`}>
                            {cat.name}
                          </span>
                          {cat.isTrending && (
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-tighter ${listing.category === cat.name ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'}`}>
                              <Flame size={8} fill="currentColor" />
                              Trending
                            </div>
                          )}
                        </div>
                        <p className={`text-[10px] font-medium line-clamp-1 ${listing.category === cat.name ? 'text-white/60' : 'text-gray-400'}`}>
                          {cat.description}
                        </p>
                      </div>
                      {listing.category === cat.name ? (
                        <div className="p-1 bg-white/20 rounded-full">
                          <Check size={16} className="text-white" strokeWidth={4} />
                        </div>
                      ) : (
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 space-y-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Search size={24} className="text-gray-200" />
                  </div>
                  <p className="text-sm font-bold text-gray-400 px-10">No categories found matching "{categorySearch}"</p>
                  <button 
                    onClick={() => setCategorySearch('')}
                    className="text-[#007d34] text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-8 left-6 right-6 flex gap-3 max-w-md mx-auto">
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="flex-1 bg-gray-50 text-gray-900 py-4.5 rounded-[22px] font-black border border-gray-100 hover:bg-gray-100 transition-colors uppercase tracking-widest text-[10px] active:scale-95"
          >
            Back
          </button>
        )}
        <button 
          onClick={handleNext}
          disabled={loadingAI || (step === 1 && (listing.photos.length === 0 || (Object.values(uploadProgress) as number[]).some(p => p > 0 && p < 100))) || (step === 2 && (!listing.name || !listing.category || !listing.originalPrice)) || (step === 3 && validation?.type === 'error')}
          className={`flex-[2] bg-[#007d34] text-white py-4.5 rounded-[22px] font-black shadow-2xl shadow-green-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none uppercase tracking-widest text-[10px]`}
        >
          {loadingAI ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <span>{step === totalSteps ? 'Publish Listing' : 'Next Step'}</span>
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default SellWizardScreen;
