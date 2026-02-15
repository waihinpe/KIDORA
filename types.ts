
export enum Screen {
  ONBOARDING = 'onboarding',
  HOME = 'home',
  EXPLORE = 'explore',
  SUSTAINABILITY = 'sustainability',
  PROFILE = 'profile',
  PRODUCT_DETAIL = 'product_detail',
  CHECKOUT = 'checkout',
  SELL = 'sell',
  LOGIN = 'login'
}

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

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  currency: string;
  images: string[];
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  age: string;
  location: string;
  sellerName: string;
  sellerRating: number;
  description: string;
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
  photos: string[];
}
