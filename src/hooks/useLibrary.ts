import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getBookCategories,
  createBookCategory,
  updateBookCategory,
  deleteBookCategory,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookIssues,
  createBookIssue,
} from '../services/library';

export const useLibrary = () => {
  const queryClient = useQueryClient();

  // Categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery(
    'bookCategories',
    getBookCategories
  );

  const { mutate: createCategory, isLoading: isCreatingCategory } = useMutation(
    (category: any) => createBookCategory(category),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bookCategories');
      },
    }
  );

  const { mutate: updateCategory, isLoading: isUpdatingCategory } = useMutation(
    ({ id, category }: { id: number; category: any }) => updateBookCategory(id, category),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bookCategories');
      },
    }
  );

  const { mutate: deleteCategory, isLoading: isDeletingCategory } = useMutation(
    (id: number) => deleteBookCategory(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bookCategories');
      },
    }
  );

  // Books
  const { data: books, isLoading: isBooksLoading } = useQuery(
    'books',
    getBooks
  );

  const { mutate: createBookMutation, isLoading: isCreatingBook } = useMutation(
    (book: any) => createBook(book),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('books');
      },
    }
  );

  const { mutate: updateBookMutation, isLoading: isUpdatingBook } = useMutation(
    ({ id, book }: { id: number; book: any }) => updateBook(id, book),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('books');
      },
    }
  );

  const { mutate: deleteBookMutation, isLoading: isDeletingBook } = useMutation(
    (id: number) => deleteBook(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('books');
      },
    }
  );

  // Issues
  const { data: issues, isLoading: isIssuesLoading } = useQuery(
    'bookIssues',
    getBookIssues
  );

  const { mutate: createIssue, isLoading: isCreatingIssue } = useMutation(
    (issue: any) => createBookIssue(issue),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bookIssues');
      },
    }
  );

  return {
    categories,
    isCategoriesLoading,
    createCategory,
    isCreatingCategory,
    updateCategory,
    isUpdatingCategory,
    deleteCategory,
    isDeletingCategory,
    books,
    isBooksLoading,
    createBook: createBookMutation,
    isCreatingBook,
    updateBook: updateBookMutation,
    isUpdatingBook,
    deleteBook: deleteBookMutation,
    isDeletingBook,
    issues,
    isIssuesLoading,
    createIssue,
    isCreatingIssue,
  };
};