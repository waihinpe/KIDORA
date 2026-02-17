
import React, { useState } from 'react';
import { ChevronLeft, MapPin, Truck, Store, CreditCard, ChevronRight, ShieldCheck, Zap, Info, Wallet, Smartphone, User, Phone, Mail, Home, Building2, Map as MapIcon, Hash, X, Loader2, Sparkles, Droplets, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface CheckoutScreenProps {
  product: Product;
  onBack: () => void;
  onOrderComplete: () => void;
}

type ShippingMethod = 'standard' | 'pickup';
type PaymentMethod = 'card' | 'grabpay' | 'bank';

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

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ product, onBack, onOrderComplete }) => {
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [inspectionSelected, setInspectionSelected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Address State
  const [address, setAddress] = useState<AddressData>({
    receiverName: 'Sarah Tan',
    receiverPhone: '+65 9123 4567',
    receiverEmail: 'sarah.tan@email.com',
    building: 'Ion Orchard',
    roomNumber: '#12-34',
    city: 'Singapore',
    district: 'Orchard',
    postalCode: '238801'
  });

  const shippingFee = shippingMethod === 'standard' ? 5.00 : 0.00;
  const serviceFee = 15.00;
  const total = product.price + shippingFee + (inspectionSelected ? serviceFee : 0);

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
              <span className="text-sm font-black">SGD 5.00</span>
            </button>
            <button onClick={() => setShippingMethod('pickup')} className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all ${shippingMethod === 'pickup' ? 'border-[#007d34] bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${shippingMethod === 'pickup' ? 'bg-[#007d34] text-white' : 'bg-gray-50 text-gray-400'}`}><Store size={20} /></div>
                <div className="text-left"><p className="text-sm font-bold text-gray-900">Self Pick-up</p><p className="text-[10px] text-gray-500 font-medium">Coordinate with seller directly</p></div>
              </div>
              <span className="text-sm font-black">FREE</span>
            </button>
          </div>
        </div>

        {/* Hygiene & Safety Inspection Service */}
        <div className="bg-white p-6 mb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kidora Guard™ Service</h3>
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">
                <ShieldCheck size={10} />
                <span className="text-[8px] font-black uppercase tracking-widest">Recommended</span>
            </div>
          </div>
          <button
            onClick={() => setInspectionSelected(!inspectionSelected)}
            className={`w-full flex flex-col items-start p-6 rounded-[32px] border-2 transition-all text-left relative overflow-hidden group mb-4 ${inspectionSelected ? 'border-blue-500 bg-blue-50 shadow-xl shadow-blue-500/10' : 'border-gray-100 bg-white hover:border-gray-200'}`}
          >
            {inspectionSelected && <div className="absolute top-[-50%] right-[-10%] w-48 h-48 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />}
            <div className="flex items-start gap-4 w-full relative z-10">
              <div className={`p-3.5 rounded-2xl transition-all ${inspectionSelected ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}>
                <ShieldCheck size={28} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className={`font-black text-base ${inspectionSelected ? 'text-blue-800' : 'text-gray-900'}`}>Hygiene & Safety Shield™</p>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${inspectionSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>SGD {serviceFee.toFixed(2)}</span>
                </div>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">Full multi-point inspection & professional sanitization before the item reaches you.</p>
              </div>
            </div>
          </button>

          {/* Detailed Inspection Checklist */}
          {inspectionSelected && (
            <div className="bg-white border border-blue-100 rounded-[24px] p-5 space-y-4 animate-in slide-in-from-top-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-blue-600" />
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Multi-Point Verification</span>
              </div>
              <div className="grid grid-cols-1 gap-y-3">
                {[
                  { title: 'Hygiene & Sanitization', desc: 'Hospital-grade UV-C treatment & deep fabric steam clean.', icon: Droplets },
                  { title: 'Structural Integrity', desc: 'Frame, joint, and chassis stress test to ensure 100% safety.', icon: ShieldCheck },
                  { title: 'Hardware Performance', desc: 'Brakes, wheels, and harnesses checked for smooth operation.', icon: Zap }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 shrink-0"><item.icon size={12} /></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-900">{item.title}</p>
                      <p className="text-[9px] text-gray-400 font-medium leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-gray-50 flex items-center gap-2 text-[9px] font-black text-[#007d34] uppercase tracking-widest">
                <CheckCircle2 size={12} />
                <span>Certificate of Hygiene included</span>
              </div>
            </div>
          )}
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
                  {inspectionSelected && <span className="text-[8px] bg-blue-50 text-blue-600 font-black px-1.5 rounded-md">INSURED</span>}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm text-gray-400 font-medium">Qty: 1</p>
                <p className="text-lg font-black text-gray-900">SGD {product.price}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 mb-3 border-b border-gray-100">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Method</h3>
          <div className="space-y-3">
            <button onClick={() => setPaymentMethod('card')} className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all ${paymentMethod === 'card' ? 'border-[#007d34] bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${paymentMethod === 'card' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-400'}`}><CreditCard size={20} /></div>
                <div className="text-left"><p className="text-sm font-bold text-gray-900">Credit / Debit Card</p><p className="text-[10px] text-gray-500 font-medium">Visa •••• 4242</p></div>
              </div>
            </button>
            <button onClick={() => setPaymentMethod('grabpay')} className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all ${paymentMethod === 'grabpay' ? 'border-[#007d34] bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl bg-white border border-gray-100 ${paymentMethod === 'grabpay' ? 'text-green-600' : 'text-gray-400'}`}><Smartphone size={20} /></div>
                <p className="text-sm font-bold text-gray-900">GrabPay</p>
              </div>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 mb-3 border-b border-gray-100 space-y-3">
          <div className="flex justify-between text-sm font-medium text-gray-500"><span>Subtotal</span><span className="text-gray-900">SGD {product.price.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm font-medium text-gray-500"><span>Shipping Fee</span><span className="text-gray-900">SGD {shippingFee.toFixed(2)}</span></div>
          {inspectionSelected && (
            <div className="flex justify-between text-sm font-medium text-gray-500 animate-in slide-in-from-left-2">
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-blue-600" />Hygiene & Safety Shield™</span>
                <span className="text-gray-900">SGD {serviceFee.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-50 flex justify-between items-center"><span className="text-sm font-black text-gray-900">Order Total</span><span className="text-xl font-black text-[#007d34]">SGD {total.toFixed(2)}</span></div>
        </div>

        <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 bg-[#e6f2eb] px-4 py-2 rounded-full border border-green-100/50 mb-3">
                <ShieldCheck size={14} className="text-[#007d34]" />
                <span className="text-[10px] font-black text-[#007d34] uppercase tracking-widest">Kidora Secure Escrow</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold leading-relaxed px-4">Protected by our buyer protection program. Funds held until delivery is confirmed.</p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 p-6 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-6">
          <div className="shrink-0">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Final Total</p>
            <p className="text-2xl font-black text-gray-900">SGD {total.toFixed(2)}</p>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="flex-1 bg-[#007d34] text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-2xl shadow-green-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {isProcessing ? <Loader2Icon size={20} className="animate-spin" /> : <span>Place Order</span>}
          </button>
        </div>
      </div>

      {/* Address Input Modal */}
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
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location Details</label>
                <div className="space-y-3">
                  <div className="relative"><Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} /><input name="building" value={address.building} onChange={handleAddressChange} placeholder="Building Name" className="w-full bg-gray-50 border border-gray-100 rounded-[22px] pl-12 pr-4 py-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none transition-all" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative"><Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} /><input name="roomNumber" value={address.roomNumber} onChange={handleAddressChange} placeholder="Unit #" className="w-full bg-gray-50 border border-gray-100 rounded-[22px] pl-12 pr-4 py-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none transition-all" /></div>
                    <div className="relative"><MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} /><input name="postalCode" value={address.postalCode} onChange={handleAddressChange} placeholder="Postal Code" className="w-full bg-gray-50 border border-gray-100 rounded-[22px] pl-12 pr-4 py-4 text-sm font-semibold focus:bg-white focus:border-[#007d34] outline-none transition-all" /></div>
                  </div>
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

export default CheckoutScreen;

const Loader2Icon = ({ size, className }: { size: number, className: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
