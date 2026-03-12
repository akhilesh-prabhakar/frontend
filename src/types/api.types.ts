export type AuthResponse = {
  userId: string;
  name: string;
  email: string;
  token: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};
