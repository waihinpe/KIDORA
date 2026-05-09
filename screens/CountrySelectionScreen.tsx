
import React from 'react';
import { Globe, MapPin, ChevronRight } from 'lucide-react';
import { KidoraLogo } from './HomeScreen';

interface CountrySelectionScreenProps {
  onSelect: (country: string) => void;
}

const COUNTRIES = [
  { name: 'Singapore', icon: '🇸🇬', code: 'SG' },
  { name: 'Thailand', icon: '🇹🇭', code: 'TH' },
  { name: 'Indonesia', icon: '🇮🇩', code: 'ID' },
  { name: 'Malaysia', icon: '🇲🇾', code: 'MY' },
  { name: 'Vietnam', icon: '🇻🇳', code: 'VN' },
  { name: 'Philippines', icon: '🇵🇭', code: 'PH' },
];

const CountrySelectionScreen: React.FC<CountrySelectionScreenProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col h-full bg-white px-8 pt-16 pb-10 animate-in fade-in duration-500 overflow-y-auto hide-scrollbar">
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-6">
          <KidoraLogo size={64} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Select Your Country</h1>
        <p className="text-sm text-gray-500 font-medium">We'll show you items and shipping rates relevant to your location.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Globe size={14} className="text-[#007d34]" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Southeast Asia</span>
        </div>
        
        {COUNTRIES.map((country) => (
          <button
            key={country.code}
            onClick={() => onSelect(country.name)}
            className="w-full flex items-center justify-between p-5 rounded-[28px] bg-gray-50 border border-gray-100 hover:border-[#007d34] hover:bg-green-50 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{country.icon}</span>
              <div className="text-left">
                <p className="text-base font-black text-gray-900">{country.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kidora {country.code}</p>
              </div>
            </div>
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-300 group-hover:text-[#007d34] group-hover:border-[#007d34]/20 transition-all">
              <ChevronRight size={18} strokeWidth={3} />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl text-blue-500 shadow-sm">
          <MapPin size={18} />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Global Shipping</p>
          <p className="text-[11px] text-blue-600/80 font-medium leading-relaxed">
            Don't see your country? We're expanding fast! You can still browse and ship internationally between SEA hubs.
          </p>
        </div>
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Kidora Premium Circular Marketplace</p>
      </div>
    </div>
  );
};

export default CountrySelectionScreen;
