import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  createFeeStructure,
  getFeeStructures,
  createInvoice,
  getInvoices,
  createPayment,
  getTransactions,
  getRecentTransactions,
  FeeStructure,
  Invoice,
  Transaction,
} from '../services/fees';

export const useFeeStructures = () => {
  return useQuery('feeStructures', getFeeStructures);
};

export const useInvoices = () => {
  return useQuery('invoices', getInvoices);
};

export const useTransactions = () => {
  return useQuery('transactions', getTransactions);
};

export const useRecentTransactions = () => {
  return useQuery('recentTransactions', getRecentTransactions);
};

export const useCreateFeeStructure = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: Omit<FeeStructure, 'id'>) => createFeeStructure(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('feeStructures');
      },
    }
  );
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation((data: Omit<Invoice, 'id'>) => createInvoice(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('invoices');
    },
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: Omit<Transaction, 'id' | 'payment_date'>) => createPayment(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transactions');
        queryClient.invalidateQueries('recentTransactions');
      },
    }
  );
};

export const useFees = () => {
  const { data: feeStructures, isLoading: isFeeStructuresLoading } = useFeeStructures();
  const { data: invoices, isLoading: isInvoicesLoading } = useInvoices();
  const { data: transactions, isLoading: isTransactionsLoading } = useTransactions();
  const { data: recentTransactions, isLoading: isRecentTransactionsLoading } = useRecentTransactions();

  const { mutate: createFeeStructure } = useCreateFeeStructure();
  const { mutate: createInvoice } = useCreateInvoice();
  const { mutate: createPayment } = useCreatePayment();

  return {
    feeStructures,
    isFeeStructuresLoading,
    invoices,
    isInvoicesLoading,
    transactions,
    isTransactionsLoading,
    recentTransactions,
    isRecentTransactionsLoading,
    createFeeStructure,
    createInvoice,
    createPayment,
  };
};