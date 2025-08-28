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

