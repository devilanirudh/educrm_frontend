import api from './api';

// BookCategory services
export const getBookCategories = async () => {
  const response = await api.get('/book-categories/');
  return response.data;
};

export const createBookCategory = async (category: any) => {
  const response = await api.post('/book-categories/', category);
  return response.data;
};

export const updateBookCategory = async (id: number, category: any) => {
  const response = await api.put(`/book-categories/${id}`, category);
  return response.data;
};

export const deleteBookCategory = async (id: number) => {
  const response = await api.delete(`/book-categories/${id}`);
  return response.data;
};

// Book services
export const getBooks = async () => {
  const response = await api.get('/books/');
  return response.data;
};

export const createBook = async (book: any) => {
  const response = await api.post('/books/', book);
  return response.data;
};

export const updateBook = async (id: number, book: any) => {
  const response = await api.put(`/books/${id}`, book);
  return response.data;
};

export const deleteBook = async (id: number) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

// BookIssue services
export const getBookIssues = async () => {
  const response = await api.get('/book-issues/');
  return response.data;
};

export const createBookIssue = async (issue: any) => {
  const response = await api.post('/book-issues/', issue);
  return response.data;
};