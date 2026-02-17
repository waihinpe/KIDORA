
import { Product } from './types';

export const PRIMARY_COLOR = '#007d34';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bugaboo Fox 3 Stroller',
    brand: 'Bugaboo',
    price: 850,
    originalPrice: 1600,
    currency: 'SGD',
    images: [
      'https://images.unsplash.com/photo-1591084728795-1149fb3a288d?auto=format&fit=crop&q=90&w=1600',
      'https://images.unsplash.com/photo-1594913785162-e6786b42dea3?auto=format&fit=crop&q=90&w=1600'
    ],
    condition: 'Like New',
    age: '0-4 years',
    location: 'Orchard, Singapore',
    sellerName: 'Sarah L.',
    sellerRating: 4.9,
    description: 'Barely used Bugaboo Fox 3 in Forest Green. Clean, no stains, includes rain cover. Perfect for city walks and rougher terrain alike.',
    impact: { co2Saved: 12.5, waterSaved: 150 }
  },
  {
    id: '2',
    name: 'Lovevery Play Gym',
    brand: 'Lovevery',
    price: 110,
    originalPrice: 220,
    currency: 'SGD',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=90&w=1600',
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=90&w=1600'
    ],
    condition: 'Good',
    age: '0-12 months',
    location: 'Bangkok, Thailand',
    sellerName: 'Naree P.',
    sellerRating: 4.7,
    description: 'Award-winning play gym for baby’s first year. Complete set with all accessories.',
    impact: { co2Saved: 3.2, waterSaved: 40 }
  },
  {
    id: '3',
    name: 'Ergobaby Omni 360 Carrier',
    brand: 'Ergobaby',
    price: 95,
    originalPrice: 250,
    currency: 'SGD',
    images: [
      'https://images.unsplash.com/photo-1544070078-a212eda27b49?auto=format&fit=crop&q=90&w=1600',
      'https://images.unsplash.com/photo-1602738328654-51ab2330b8b4?auto=format&fit=crop&q=90&w=1600'
    ],
    condition: 'Like New',
    age: '0-48 months',
    location: 'Jakarta, Indonesia',
    sellerName: 'Maya K.',
    sellerRating: 5.0,
    description: 'Pure black cotton. Only used twice for traveling. Super comfortable for long durations.',
    impact: { co2Saved: 4.1, waterSaved: 60 }
  },
  {
    id: '4',
    name: 'Wooden Balance Bike',
    brand: 'Kinderfeets',
    price: 45,
    originalPrice: 120,
    currency: 'SGD',
    images: [
      'https://images.unsplash.com/photo-1531323380760-700126848eac?auto=format&fit=crop&q=90&w=1600',
      'https://images.unsplash.com/photo-1530328308490-b88ca3ad1bc7?auto=format&fit=crop&q=90&w=1600'
    ],
    condition: 'Fair',
    age: '2-5 years',
    location: 'Kuala Lumpur, Malaysia',
    sellerName: 'Jessica W.',
    sellerRating: 4.5,
    description: 'Classic wooden design. Some scratches on the frame but mechanically very sturdy.',
    impact: { co2Saved: 8.4, waterSaved: 30 }
  },
  {
    id: '5',
    name: 'Stokke Tripp Trapp Chair',
    brand: 'Stokke',
    price: 280,
    originalPrice: 450,
    currency: 'SGD',
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=90&w=1600',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=90&w=1600'
    ],
    condition: 'Good',
    age: '6 months+',
    location: 'Sentosa, Singapore',
    sellerName: 'Emily T.',
    sellerRating: 4.8,
    description: 'The chair that grows with the child. Oak natural finish. Includes baby set attachment.',
    impact: { co2Saved: 15.2, waterSaved: 200 }
  },
  {
    id: '6',
    name: 'Cotton Swaddle Set',
    brand: 'Aden + Anais',
    price: 35,
    originalPrice: 75,
    currency: 'SGD',
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=90&w=1600',
      'https://images.unsplash.com/photo-152277165306-03612f00a6e0?auto=format&fit=crop&q=90&w=1600'
    ],
    condition: 'New',
    age: '0-6 months',
    location: 'Manila, Philippines',
    sellerName: 'Rina G.',
    sellerRating: 4.9,
    description: 'Pack of 3 organic muslin swaddles. Breathable and soft. Never opened.',
    impact: { co2Saved: 1.5, waterSaved: 80 }
  }
];

export const SEA_LOCATIONS = ['Singapore', 'Bangkok', 'Jakarta', 'Kuala Lumpur', 'Manila', 'Ho Chi Minh'];
