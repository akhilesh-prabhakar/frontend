"use client";

import axios from "axios";
import type { AuthResponse, Order, Product } from "@/types/api.types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authApi = {
  signup: async (payload: { name: string; email: string; password: string }) => {
    const { data } = await api.post<AuthResponse>("/auth/signup", payload);
    return data;
  },
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },
};

export const productApi = {
  list: async () => {
    const { data } = await api.get<{ products: Product[] }>("/products");
    return data.products;
  },
  create: async (payload: { name: string; price: number; stock: number }) => {
    const { data } = await api.post<Product>("/products", payload);
    return data;
  },
  update: async (id: string, payload: { name: string; price: number; stock: number }) => {
    const { data } = await api.put<Product>(`/products/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await api.delete<{ success: boolean }>(`/products/${id}`);
    return data.success;
  },
};

export const orderApi = {
  list: async () => {
    const { data } = await api.get<{ orders: Order[] }>("/orders");
    return data.orders;
  },
  create: async (payload: { productId: string; quantity: number }) => {
    const { data } = await api.post<Order>("/orders", payload);
    return data;
  },
  update: async (
    id: string,
    payload: { productId: string; quantity: number; status: string },
  ) => {
    const { data } = await api.put<Order>(`/orders/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await api.delete<{ success: boolean }>(`/orders/${id}`);
    return data.success;
  },
};

export default api;
