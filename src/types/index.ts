export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  msg: string;
  token: string;
  user: User;
}

export interface Route {
  id: number;
  title: string;
  desc: string;
  image: { uri: string };
  visited: boolean;
  hotel?: { name: string };
  restaurant?: { name: string };
}

export interface Destination {
  name: string;
  image: { uri: string };
}

export interface Business {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  features: string[];
  photos: string[];
  price: {
    nightly: number;
  };
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// New interfaces for travel planning system
export interface UserPreferences {
  destination?: string;
  budget?: 'low' | 'medium' | 'high' | string;
  duration?: string;
  interests?: string[];
  accommodation?: string;
  food?: string;
  transport?: string;
  travelStyle?: string;
}

export interface Option {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'hotel' | 'restaurant' | 'activity' | 'transport';
  rating: number;
  features: string[];
}

export interface Selections {
  hotel?: Option;
  restaurant?: Option;
  activity?: Option;
  transport?: Option;
}

export interface SavedRoute {
  id: string;
  preferences: UserPreferences;
  selections: Selections;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

