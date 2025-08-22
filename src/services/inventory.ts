import api from './api';

// InventoryCategory services
export const getInventoryCategories = async () => {
  const response = await api.get('/inventory-categories/');
  return response.data;
};

export const createInventoryCategory = async (category: any) => {
  const response = await api.post('/inventory-categories/', category);
  return response.data;
};

export const updateInventoryCategory = async (id: number, category: any) => {
  const response = await api.put(`/inventory-categories/${id}`, category);
  return response.data;
};

export const deleteInventoryCategory = async (id: number) => {
  const response = await api.delete(`/inventory-categories/${id}`);
  return response.data;
};

// InventoryItem services
export const getInventoryItems = async () => {
  const response = await api.get('/inventory-items/');
  return response.data;
};

export const createInventoryItem = async (item: any) => {
  const response = await api.post('/inventory-items/', item);
  return response.data;
};

export const updateInventoryItem = async (id: number, item: any) => {
  const response = await api.put(`/inventory-items/${id}`, item);
  return response.data;
};

export const deleteInventoryItem = async (id: number) => {
  const response = await api.delete(`/inventory-items/${id}`);
  return response.data;
};

// InventoryIssue services
export const getInventoryIssues = async () => {
  const response = await api.get('/inventory-issues/');
  return response.data;
};

export const createInventoryIssue = async (issue: any) => {
  const response = await api.post('/inventory-issues/', issue);
  return response.data;
};