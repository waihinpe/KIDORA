
export enum Screen {
  ONBOARDING = 'onboarding',
  HOME = 'home',
  EXPLORE = 'explore',
  SUSTAINABILITY = 'sustainability',
  PROFILE = 'profile',
  PRODUCT_DETAIL = 'product_detail',
  CHECKOUT = 'checkout',
  SELL = 'sell',
  LOGIN = 'login',
  COUNTRY_SELECTION = 'country_selection'
}

export type TransactionType = 'buy' | 'trade';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  rating: number;
  reviewsCount: number;
  totalEarnings: number;
}

export type Gender = 'Boy' | 'Girl' | 'Unisex';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  currency: string;
  images: string[];
  condition: 'Brand new (open box)' | 'Pre-loved' | 'Well-loved' | 'New but try once' | 'Donation' | 'New';
  age: string;
  gender: Gender;
  location: string;
  sellerName: string;
  sellerRating: number;
  description: string;
  isVerified?: boolean;
  verificationDetails?: string;
  impact: {
    co2Saved: number;
    waterSaved: number;
  };
}

export interface ImpactStats {
  treesSaved: number;
  waterSaved: number;
  co2Offset: number;
  itemsReused: number;
}

export interface NewListing {
  name: string;
  brand: string;
  category: string;
  condition: string;
  originalPrice: number;
  price: number;
  description: string;
  age: string;
  gender: Gender;
  photos: string[];
  isVerified?: boolean;
  verificationDetails?: string;
}
