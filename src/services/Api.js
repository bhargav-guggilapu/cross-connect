import axios from "axios";
import { API_ENDPOINTS } from "./EndPoints";

const apiClient = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async () => {
  return await apiClient.get(API_ENDPOINTS.PRODUCTS);
};

export const createProduct = async (payload) => {
  return await apiClient.post(API_ENDPOINTS.PRODUCTS, payload);
};

export const getOrders = async () => {
  return await apiClient.get(API_ENDPOINTS.ORDERS);
};
