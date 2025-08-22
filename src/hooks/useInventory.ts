import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getInventoryCategories,
  createInventoryCategory,
  updateInventoryCategory,
  deleteInventoryCategory,
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryIssues,
  createInventoryIssue,
} from '../services/inventory';

export const useInventory = () => {
  const queryClient = useQueryClient();

  // Categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery(
    'inventoryCategories',
    getInventoryCategories
  );

  const { mutate: createCategory, isLoading: isCreatingCategory } = useMutation(
    (category: any) => createInventoryCategory(category),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventoryCategories');
      },
    }
  );

  const { mutate: updateCategory, isLoading: isUpdatingCategory } = useMutation(
    ({ id, category }: { id: number; category: any }) => updateInventoryCategory(id, category),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventoryCategories');
      },
    }
  );

  const { mutate: deleteCategory, isLoading: isDeletingCategory } = useMutation(
    (id: number) => deleteInventoryCategory(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventoryCategories');
      },
    }
  );

  // Items
  const { data: items, isLoading: isItemsLoading } = useQuery(
    'inventoryItems',
    getInventoryItems
  );

  const { mutate: createItem, isLoading: isCreatingItem } = useMutation(
    (item: any) => createInventoryItem(item),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventoryItems');
      },
    }
  );

  const { mutate: updateItem, isLoading: isUpdatingItem } = useMutation(
    ({ id, item }: { id: number; item: any }) => updateInventoryItem(id, item),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventoryItems');
      },
    }
  );

  const { mutate: deleteItem, isLoading: isDeletingItem } = useMutation(
    (id: number) => deleteInventoryItem(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventoryItems');
      },
    }
  );

  // Issues
  const { data: issues, isLoading: isIssuesLoading } = useQuery(
    'inventoryIssues',
    getInventoryIssues
  );

  const { mutate: createIssue, isLoading: isCreatingIssue } = useMutation(
    (issue: any) => createInventoryIssue(issue),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventoryIssues');
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
    items,
    isItemsLoading,
    createItem,
    isCreatingItem,
    updateItem,
    isUpdatingItem,
    deleteItem,
    isDeletingItem,
    issues,
    isIssuesLoading,
    createIssue,
    isCreatingIssue,
  };
};