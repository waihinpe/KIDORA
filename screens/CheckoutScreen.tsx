
import React, { useState } from 'react';
import { 
  ChevronLeft, MapPin, Truck, CreditCard, ChevronRight, ShieldCheck, 
  User, Phone, X, ArrowLeftRight 
} from 'lucide-react';
import { Product, TransactionType } from '../types';

interface CheckoutScreenProps {
  product: Product;
  transactionType: TransactionType;
  initialInspection: boolean;
  onBack: () => void;
  onOrderComplete: () => void;
}

type ShippingMethod = 'standard' | 'pickup';

interface AddressData {
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  building: string;
  roomNumber: string;
  city: string;
  district: string;
  postalCode: string;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ 
  product, 
  transactionType, 
  initialInspection, 
  onBack, 
  onOrderComplete 
}) => {
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [inspectionSelected, setInspectionSelected] = useState(initialInspection);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [address, setAddress] = useState<AddressData>({
    receiverName: 'Sarah Tan',
    receiverPhone: '+66 81 234 5678',
    receiverEmail: 'sarah.tan@email.com',
    building: 'Siam Paragon',
    roomNumber: 'Floor 3, Unit 12',
    city: 'Bangkok',
    district: 'Pathum Wan',
    postalCode: '10330'
  });

  const shippingFee = shippingMethod === 'standard' ? 150.00 : 0.00;
  const serviceFee = 450.00;
  
  // Trade logic: If trade, product price is effectively 0 in cash, replaced by exchange
  const productPrice = transactionType === 'buy' ? product.price : 0;
  const total = productPrice + shippingFee + (inspectionSelected ? serviceFee : 0);

  const handlePlaceOrder = () => {
    if (!address.receiverName || !address.receiverPhone || !address.postalCode) {
      alert("Please complete your delivery address details.");
      setIsAddressModalOpen(true);
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onOrderComplete();
    }, 2000);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] animate-in slide-in-from-right-4 duration-300 relative">
      {/* Header */}
      <div className="sticky top-0 bg-white z-50 px-6 pt-10 pb-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Checkout</h1>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-40">
        {/* Transaction Summary Header */}
        <div className="px-6 py-4 bg-white mb-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${transactionType === 'buy' ? 'bg-green-50 text-[#007d34]' : 'bg-amber-50 text-amber-600'}`}>
                    {transactionType === 'buy' ? <CreditCard size={18} /> : <ArrowLeftRight size={18} />}
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction Mode</p>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-wider">{transactionType === 'buy' ? 'Direct Purchase' : 'Item Swap / Trade'}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inspection</p>
                <p className={`text-xs font-black uppercase tracking-wider ${inspectionSelected ? 'text-blue-600' : 'text-gray-400'}`}>{inspectionSelected ? 'Enabled' : 'Disabled'}</p>
            </div>
        </div>

        {/* Shipping Address Display */}
        <div className="bg-white p-6 mb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Address</h3>
            <button onClick={() => setIsAddressModalOpen(true)} className="text-[10px] font-black text-[#007d34] uppercase tracking-widest">Change</button>
          </div>
          <button onClick={() => setIsAddressModalOpen(true)} className="w-full flex gap-4 text-left group">
            <div className="p-3 bg-gray-50 rounded-2xl text-[#007d34] h-fit group-hover:bg-[#e6f2eb] transition-colors"><MapPin size={20} /></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 mb-1">{address.receiverName} ({address.receiverPhone})</p>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">{address.roomNumber}, {address.building}<br />{address.district}, {address.city} {address.postalCode}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300 mt-1" />
          </button>
        </div>

        {/* Shipping Method */}
        <div className="bg-white p-6 mb-3 border-b border-gray-100">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Delivery Options</h3>
          <div className="space-y-3">
            <button onClick={() => setShippingMethod('standard')} className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all ${shippingMethod === 'standard' ? 'border-[#007d34] bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${shippingMethod === 'standard' ? 'bg-[#007d34] text-white' : 'bg-gray-50 text-gray-400'}`}><Truck size={20} /></div>
                <div className="text-left"><p className="text-sm font-bold text-gray-900">Standard Delivery</p><p className="text-[10px] text-gray-500 font-medium">Est. delivery: 3-5 working days</p></div>
              </div>
              <span className="text-sm font-black">THB {shippingFee.toFixed(2)}</span>
            </button>
          </div>
        </div>

        {/* Hygiene & Safety Inspection Service (Toggleable again in checkout) */}
        <div className="bg-white p-6 mb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kidora Guard™ Service</h3>
          </div>
          <button
            onClick={() => setInspectionSelected(!inspectionSelected)}
            className={`w-full flex flex-col items-start p-6 rounded-[32px] border-2 transition-all text-left relative overflow-hidden group ${inspectionSelected ? 'border-blue-500 bg-blue-50 shadow-xl shadow-blue-500/10' : 'border-gray-100 bg-white hover:border-gray-200'}`}
          >
            <div className="flex items-start gap-4 w-full relative z-10">
              <div className={`p-3.5 rounded-2xl transition-all ${inspectionSelected ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}>
                <ShieldCheck size={28} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className={`font-black text-base ${inspectionSelected ? 'text-blue-800' : 'text-gray-900'}`}>Hygiene Shield™</p>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${inspectionSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>THB {serviceFee.toFixed(2)}</span>
                </div>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">Full multi-point inspection & professional sanitization.</p>
              </div>
            </div>
          </button>
        </div>

        {/* Product Summary */}
        <div className="bg-white p-6 mb-3 border-b border-gray-100">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-[24px] overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
              <img src={product.images[0]} className="w-full h-full object-cover" alt="Product" />
            </div>
            <div className="flex-1 py-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">{product.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-[#007d34] font-black uppercase tracking-widest">{product.condition}</span>
                  {transactionType === 'trade' && <span className="text-[8px] bg-amber-50 text-amber-600 font-black px-1.5 rounded-md">TRADE-IN</span>}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm text-gray-400 font-medium">Qty: 1</p>
                <p className="text-lg font-black text-gray-900">
                    {transactionType === 'buy' ? `THB ${product.price}` : 'TRADE REQ'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Details (Conditional) */}
        {transactionType === 'trade' && (
          <div className="bg-amber-50 p-6 mb-3 border-b border-amber-100">
             <div className="flex items-center gap-3 mb-4">
                <ArrowLeftRight size={18} className="text-amber-600" />
                <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Your Offer</h3>
             </div>
             <button className="w-full bg-white p-5 rounded-[24px] border border-amber-200 border-dashed flex flex-col items-center justify-center gap-2 group hover:border-amber-400 transition-all">
                <div className="p-2 bg-amber-100 rounded-full text-amber-600 group-hover:scale-110 transition-transform">
                   <Plus size={20} />
                </div>
                <span className="text-[10px] font-black uppercase text-amber-600">Select Item to Trade</span>
             </button>
             <p className="text-[10px] text-amber-600/60 font-medium mt-3 text-center">Your item will be inspected by Kidora before the swap is completed.</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white p-6 mb-3 border-b border-gray-100 space-y-3">
          <div className="flex justify-between text-sm font-medium text-gray-500">
            <span>{transactionType === 'buy' ? 'Subtotal' : 'Trade Value Offset'}</span>
            <span className="text-gray-900">THB {productPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-500">
            <span>Shipping Fee</span>
            <span className="text-gray-900">THB {shippingFee.toFixed(2)}</span>
          </div>
          {inspectionSelected && (
            <div className="flex justify-between text-sm font-medium text-gray-500 animate-in slide-in-from-left-2">
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-blue-600" />Hygiene Shield™</span>
                <span className="text-gray-900">THB {serviceFee.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
            <span className="text-sm font-black text-gray-900">{transactionType === 'buy' ? 'Order Total' : 'Processing Total'}</span>
            <span className="text-xl font-black text-[#007d34]">THB {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 bg-[#e6f2eb] px-4 py-2 rounded-full border border-green-100/50 mb-3">
                <ShieldCheck size={14} className="text-[#007d34]" />
                <span className="text-[10px] font-black text-[#007d34] uppercase tracking-widest">Kidora Secure Escrow</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold leading-relaxed px-4">Funds held in escrow. Verified by the Kidora community for safety.</p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-md-mx-auto bg-white border-t border-gray-100 p-6 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-6">
          <div className="shrink-0">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Due</p>
            <p className="text-2xl font-black text-gray-900">THB {total.toFixed(2)}</p>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="flex-1 bg-[#007d34] text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-green-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? <Loader2Icon size={20} className="animate-spin" /> : <span>{transactionType === 'buy' ? 'Place Order' : 'Submit Trade'}</span>}
          </button>
        </div>
      </div>

      {/* Address Input Modal (Kept simple for brevity) */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsAddressModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 max-h-[90vh] flex flex-col">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 shrink-0" />
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-2xl font-black text-gray-900">Delivery Info</h2>
              <button onClick={() => setIsAddressModalOpen(false)} className="p-2 text-gray-400"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-8 pb-32">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Receiver Info</label>
                <div className="space-y-3">
                  <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} /><input name="receiverName" value={address.receiverName} onChange={handleAddressChange} placeholder="Full Name" className="w-full bg-gray-50 border border-gray-100 rounded-[22px] pl-12 pr-4 py-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none transition-all" /></div>
                  <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} /><input name="receiverPhone" value={address.receiverPhone} onChange={handleAddressChange} placeholder="Phone Number" className="w-full bg-gray-50 border border-gray-100 rounded-[22px] pl-12 pr-4 py-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none transition-all" /></div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8"><button onClick={() => setIsAddressModalOpen(false)} className="w-full bg-[#007d34] text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-green-900/20 active:scale-95 transition-all">Save Delivery Address</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fixed: Made className optional in Plus component
const Plus = ({ size, className }: { size: number, className?: string }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5v14" />
    </svg>
);

export default CheckoutScreen;

// Fixed: Made className optional in Loader2Icon component
const Loader2Icon = ({ size, className }: { size: number, className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
