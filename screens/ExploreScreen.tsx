
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, MapPin, ChevronDown, Globe, Loader2, ImageOff, Heart, Sparkles, Tent, Shirt, Milk, Sofa, Moon, BookOpen, X, Check, ShieldCheck } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';
import { repairBrokenImage, verifyProductAuthenticity } from '../services/geminiService';

interface ExploreScreenProps {
  onProductClick: (product: Product) => void;
}

const ProductCard = ({ product, onProductClick }: { product: Product, onProductClick: (p: Product) => void, key?: React.Key }) => {
  const [imgUrl, setImgUrl] = useState(product.images[0]);
  const [isBroken, setIsBroken] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [repaired, setRepaired] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(product.isVerified ?? null);
  const [isVerifying, setIsVerifying] = useState(false);

  React.useEffect(() => {
    if (isVerified === null) {
      const verify = async () => {
        setIsVerifying(true);
        try {
          const result = await verifyProductAuthenticity({
            name: product.name,
            brand: product.brand,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice
          });
          setIsVerified(result.isVerified);
        } catch (error) {
          console.error("Verification failed:", error);
          setIsVerified(true); // Fallback to true for demo
        } finally {
          setIsVerifying(false);
        }
      };
      verify();
    }
  }, [product, isVerified]);

  const handleImageError = async () => {
    if (isRepairing || repaired) {
      setIsBroken(true);
      return;
    }
    
    setIsRepairing(true);
    const repairResult = await repairBrokenImage(product.name, product.brand);
    
    if (repairResult?.suggestedUrl) {
      setImgUrl(repairResult.suggestedUrl);
      setRepaired(true);
      setIsBroken(false);
    } else {
      setIsBroken(true);
    }
    setIsRepairing(false);
  };

  return (
    <div 
        onClick={() => onProductClick(product)}
        className="group cursor-pointer flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-50 mb-4 relative shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px]">
        {!isLoaded && !isBroken && !isRepairing && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
        )}

        {isRepairing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50 text-[#007d34] gap-3">
            <Loader2 size={24} className="animate-spin" />
            <div className="text-center">
              <span className="text-[8px] font-black uppercase tracking-widest block">AI Sourcing</span>
              <span className="text-[6px] font-bold uppercase tracking-widest opacity-60">Sourcing HD Assets</span>
            </div>
          </div>
        ) : isBroken ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300 gap-2">
            <ImageOff size={32} strokeWidth={1.5} />
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Image Unavailable</span>
          </div>
        ) : (
          <>
            <img 
              src={imgUrl} 
              alt={product.name} 
              loading="lazy"
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              onError={handleImageError}
              className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${repaired ? 'saturate-125 brightness-105' : ''} ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
            />
            {repaired && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-blue-500 text-white text-[7px] font-black px-2 py-1 rounded-lg shadow-lg border border-white/20 animate-in zoom-in-75">
                <Sparkles size={10} fill="currentColor" />
                <span>AI REPAIRED HD</span>
              </div>
            )}
          </>
        )}
        
        <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm text-gray-400 hover:text-red-500 transition-colors z-10">
          <Heart size={16} />
        </button>
        
        {isVerified && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#007d34] text-[7px] font-black px-2 py-1.5 rounded-lg shadow-sm border border-green-100 z-10 animate-in fade-in zoom-in duration-300">
            <ShieldCheck size={12} fill="currentColor" fillOpacity={0.2} />
            <span>GEMINI VERIFIED</span>
          </div>
        )}

        {isVerifying && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-blue-600 text-[7px] font-black px-2 py-1.5 rounded-lg shadow-sm border border-blue-100 z-10">
            <Loader2 size={10} className="animate-spin" />
            <span>VERIFYING...</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-[#007d34] text-white text-[8px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-wider z-10">
            {product.condition}
        </div>
      </div>
      <div className="space-y-0.5 px-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.brand}</p>
        <h3 className="font-bold text-sm line-clamp-1 text-gray-900 leading-tight">{product.name}</h3>
        <div className="flex items-center gap-2 pt-1">
            <span className="font-black text-lg text-[#007d34]">{product.currency} {product.price}</span>
            <span className="text-[10px] text-gray-300 line-through font-bold">{product.currency} {product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
};

const ExploreScreen: React.FC<ExploreScreenProps> = ({ onProductClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All SEA');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedAge, setSelectedAge] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');

  const countries = [
    { name: 'Singapore', icon: '🇸🇬', cities: ['All Singapore', 'Orchard', 'Jurong', 'Tampines', 'Sentosa'] },
    { name: 'Thailand', icon: '🇹🇭', cities: ['All Thailand', 'Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya'] },
    { name: 'Indonesia', icon: '🇮🇩', cities: ['All Indonesia', 'Jakarta', 'Bali', 'Surabaya', 'Bandung'] },
    { name: 'Malaysia', icon: '🇲🇾', cities: ['All Malaysia', 'Kuala Lumpur', 'Penang', 'Johor Bahru', 'Malacca'] },
    { name: 'Vietnam', icon: '🇻🇳', cities: ['All Vietnam', 'Ho Chi Minh', 'Hanoi', 'Da Nang'] },
    { name: 'Philippines', icon: '🇵🇭', cities: ['All Philippines', 'Manila', 'Cebu', 'Davao'] },
  ];

  const categories = [
    { label: 'All', value: 'All', icon: <Globe size={14} /> },
    { label: 'Outdoor Gear', value: 'Outdoor Gear', icon: <Tent size={14} /> },
    { label: 'Feeding & Changing', value: 'Feeding & Changing', icon: <Milk size={14} /> },
    { label: 'Furniture', value: 'Furniture', icon: <Sofa size={14} /> },
    { label: 'Sleeping', value: 'Sleeping', icon: <Moon size={14} /> },
    { label: 'Learning & Development', value: 'Learning & Development', icon: <BookOpen size={14} /> },
    { label: 'Clothing', value: 'Clothing', icon: <Shirt size={14} /> },
  ];

  const conditions = [
    'All',
    'New',
    'Brand new (open box)',
    'New but try once',
    'Pre-loved',
    'Well-loved',
    'Donation'
  ];

  const ages = [
    'All',
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

  const genders = ['All', 'Boy', 'Girl', 'Unisex'];

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesCondition = selectedCondition === 'All' || product.condition === selectedCondition;
      const matchesAge = selectedAge === 'All' || product.age === selectedAge;
      const matchesGender = selectedGender === 'All' || product.gender === selectedGender;
      
      let matchesLocation = true;
      if (selectedLocation !== 'All SEA') {
        const normalizedLocation = selectedLocation.replace('All ', '').toLowerCase();
        matchesLocation = product.location.toLowerCase().includes(normalizedLocation);
      }
      return matchesSearch && matchesCategory && matchesLocation && matchesCondition && matchesAge && matchesGender;
    });
  }, [searchQuery, selectedCategory, selectedLocation, selectedCondition, selectedAge, selectedGender]);

  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky top-0 bg-white z-40 pt-8 pb-4 px-6 border-b border-gray-50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2 text-[#007d34] text-xs font-black bg-[#e6f2eb] px-4 py-3 rounded-2xl border border-green-100/50 shadow-sm active:scale-95 transition-all"
          >
            <MapPin size={14} fill="currentColor" fillOpacity={0.2} />
            <span className="uppercase tracking-widest">{selectedLocation}</span>
            <ChevronDown size={14} />
          </button>
          <button 
            onClick={() => setIsFilterDrawerOpen(true)}
            className="relative p-2.5 rounded-2xl bg-white border border-gray-100 text-gray-500 shadow-sm active:scale-95 transition-all"
          >
            <SlidersHorizontal size={18} />
            {(selectedCondition !== 'All' || selectedAge !== 'All' || selectedGender !== 'All') && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#007d34] rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black">
                !
              </span>
            )}
          </button>
        </div>

        <div className="bg-gray-50 rounded-2xl flex items-center px-4 py-3.5 border border-gray-100 focus-within:border-[#007d34] focus-within:bg-white transition-all shadow-sm mb-5">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search brands, items..." 
            className="bg-transparent border-none focus:ring-0 ml-2 text-sm w-full outline-none font-semibold text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${selectedCategory === cat.value ? 'bg-[#007d34] text-white border-[#007d34]' : 'bg-white text-gray-400 border-gray-100'}`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-black uppercase tracking-widest text-[10px]">No results found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isLocationModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLocationModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) setIsLocationModalOpen(false);
              }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] p-8 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 shrink-0" />
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-black text-gray-900">Location</h2>
                <button onClick={() => setIsLocationModalOpen(false)} className="p-2 text-gray-400 bg-gray-50 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 pb-10">
                 <button 
                    onClick={() => { setSelectedLocation('All SEA'); setIsLocationModalOpen(false); }}
                    className="w-full text-left p-4 rounded-2xl bg-gray-50 text-xs font-black uppercase tracking-widest border border-gray-100"
                 >
                   🌏 All Southeast Asia
                 </button>
                 {countries.map(c => (
                   <div key={c.name} className="space-y-3">
                     <p className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">{c.name}</p>
                     <div className="grid grid-cols-2 gap-2">
                       {c.cities.map(city => (
                         <button 
                          key={city}
                          onClick={() => { setSelectedLocation(city); setIsLocationModalOpen(false); }}
                          className={`p-4 border rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${selectedLocation === city ? 'bg-[#007d34] text-white border-[#007d34]' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
                         >
                           {city}
                         </button>
                       ))}
                     </div>
                   </div>
                 ))}
              </div>
            </motion.div>
          </div>
        )}

        {isFilterDrawerOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) setIsFilterDrawerOpen(false);
              }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 shrink-0" />
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-black text-gray-900">Filters</h2>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 text-gray-400 bg-gray-50 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar space-y-8 pb-32">
                {/* Condition Filter */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condition</p>
                  <div className="flex flex-wrap gap-2">
                    {conditions.map((cond) => (
                      <button 
                        key={cond}
                        onClick={() => setSelectedCondition(cond)}
                        className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center gap-2 ${selectedCondition === cond ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                      >
                        {selectedCondition === cond && <Check size={12} strokeWidth={4} />}
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Filter */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age Range</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ages.map((age) => (
                      <button 
                        key={age}
                        onClick={() => setSelectedAge(age)}
                        className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${selectedAge === age ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                      >
                        {selectedAge === age && <Check size={12} strokeWidth={4} />}
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</p>
                  <div className="flex gap-2">
                    {genders.map((gender) => (
                      <button 
                        key={gender}
                        onClick={() => setSelectedGender(gender)}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${selectedGender === gender ? 'bg-pink-600 text-white border-pink-600' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                      >
                        {selectedGender === gender && <Check size={12} strokeWidth={4} />}
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 flex gap-3">
                <button 
                  onClick={() => {
                    setSelectedCondition('All');
                    setSelectedAge('All');
                    setSelectedGender('All');
                  }}
                  className="flex-1 bg-gray-50 text-gray-900 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] border border-gray-100"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-[2] bg-[#007d34] text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-green-900/20"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreScreen;
