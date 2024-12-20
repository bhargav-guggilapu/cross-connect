import axios from "axios";
import queryString from "query-string";
import { API_ENDPOINTS } from "./EndPoints";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createUser = async (userData) => {
  return await apiClient.post(API_ENDPOINTS.USERS, userData);
};

export const updateUser = async (userData) => {
  return await apiClient.put(
    `${API_ENDPOINTS.USERS}/${userData._id}`,
    userData
  );
};

export const updateAgentDeliveries = async (id) => {
  return await apiClient.get(
    `${API_ENDPOINTS.USERS}/updateDeliveries?id=${id}`
  );
};

export const getUserByEmail = async (email) => {
  return await apiClient.get(
    `${API_ENDPOINTS.USERS}/getByEmail?email=${email}`
  );
};

export const getAgentsByZipCode = async (zipCode) => {
  return await apiClient.get(
    `${API_ENDPOINTS.USERS}/getAgentsByZipCode?zipCode=${zipCode}`
  );
};

export const getProhibitedItems = async () => {
  return await apiClient.get(`${API_ENDPOINTS.PROHIBITED_ITEMS}`);
};

export const getOrder = async (filters) => {
  const query = queryString.stringify(filters);

  return await apiClient.get(`${API_ENDPOINTS.ORDERS}?${query}`);
};

export const createOrder = async (order) => {
  return await apiClient.post(`${API_ENDPOINTS.ORDERS}`, order);
};

export const updateOrder = async (order, filters) => {
  const query = queryString.stringify(filters);

  return await apiClient.put(`${API_ENDPOINTS.ORDERS}?${query}`, order);
};

export const getOrdersByAgent = async (agent) => {
  return await apiClient.get(
    `${API_ENDPOINTS.ORDERS}/getOrdersByAgent?agent=${agent}`
  );
};

export const getClientSecret = async (orderId, tipAmount) => {
  return await apiClient.post(`/create-payment-intent`, { orderId, tipAmount });
};

export const cancelPayment = async (id) => {
  return await apiClient.post(`/cancel-payment-intent`, { id });
};

export const sendEmail = async (to, subject, html) => {
  return await apiClient.post(`/send-email`, { to, subject, html });
};
