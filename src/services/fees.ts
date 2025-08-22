import api from './api';

export interface FeeStructure {
  id: number;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  academic_year: string;
  class_id?: number;
}

export interface Invoice {
  id: number;
  student_id: number;
  fee_structure_id: number;
  amount_due: number;
  due_date: string;
  status: string;
}

export interface Transaction {
  id: number;
  invoice_id: number;
  amount_paid: number;
  payment_date: string;
  payment_method: string;
  status: string;
  receipt_number: string;
}

export const createFeeStructure = async (data: Omit<FeeStructure, 'id'>) => {
  const response = await api.post<FeeStructure>('/fees/structures', data);
  return response.data;
};

export const getFeeStructures = async () => {
  const response = await api.get<FeeStructure[]>('/fees/structures');
  return response.data;
};

export const createInvoice = async (data: Omit<Invoice, 'id'>) => {
  const response = await api.post<Invoice>('/invoices', data);
  return response.data;
};

export const getInvoices = async () => {
  const response = await api.get<Invoice[]>('/invoices');
  return response.data;
};

export const createPayment = async (data: Omit<Transaction, 'id' | 'payment_date'>) => {
  const response = await api.post<Transaction>('/payments', data);
  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get<Transaction[]>('/transactions');
  return response.data;
};

export const getRecentTransactions = async () => {
  const response = await api.get<Transaction[]>('/transactions/recent');
  return response.data;
};