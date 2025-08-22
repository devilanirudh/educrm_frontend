import axios from 'axios';

const API_URL = '/api/v1';

// BookCategory services
export const getBookCategories = async () => {
  const response = await axios.get(`${API_URL}/book-categories/`);
  return response.data;
};

export const createBookCategory = async (category: any) => {
  const response = await axios.post(`${API_URL}/book-categories/`, category);
  return response.data;
};

export const updateBookCategory = async (id: number, category: any) => {
  const response = await axios.put(`${API_URL}/book-categories/${id}`, category);
  return response.data;
};

export const deleteBookCategory = async (id: number) => {
  const response = await axios.delete(`${API_URL}/book-categories/${id}`);
  return response.data;
};

// Book services
export const getBooks = async () => {
  const response = await axios.get(`${API_URL}/books/`);
  return response.data;
};

export const createBook = async (book: any) => {
  const response = await axios.post(`${API_URL}/books/`, book);
  return response.data;
};

export const updateBook = async (id: number, book: any) => {
  const response = await axios.put(`${API_URL}/books/${id}`, book);
  return response.data;
};

export const deleteBook = async (id: number) => {
  const response = await axios.delete(`${API_URL}/books/${id}`);
  return response.data;
};

// BookIssue services
export const getBookIssues = async () => {
  const response = await axios.get(`${API_URL}/book-issues/`);
  return response.data;
};

export const createBookIssue = async (issue: any) => {
  const response = await axios.post(`${API_URL}/book-issues/`, issue);
  return response.data;
};