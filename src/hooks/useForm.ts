import { useQuery } from 'react-query';
import { formService } from '../services/formService';
import { FormSchema } from '../types/formBuilder';

export const useForm = (formKey: string) => {
  const { 
    data: formSchema, 
    isLoading: isFormSchemaLoading, 
    error: formSchemaError,
    isError: isFormSchemaError 
  } = useQuery<FormSchema>(
    ['form', formKey],
    async () => {
      try {
        // First try to get the existing form
        return await formService.getForm(formKey);
      } catch (error: any) {
        // If form doesn't exist and it's a default form (ends with _form), try to create it
        if (error.response?.status === 404 && formKey.endsWith('_form')) {
          const entityType = formKey.replace('_form', '');
          return await formService.getDefaultForm(entityType);
        }
        throw error;
      }
    },
    {
      retry: false, // Don't retry on 404 errors
      refetchOnWindowFocus: false,
    }
  );

  return {
    formSchema,
    isFormSchemaLoading,
    formSchemaError,
    isFormSchemaError,
  };
};