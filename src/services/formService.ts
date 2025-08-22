import api from './api';
import { FormSchema } from '../types/form';

const formService = {
  async createForm(schema: FormSchema) {
    const response = await api.post('/forms', schema);
    return response.data;
  },

  async getForm(formKey: string) {
    const response = await api.get(`/forms/${formKey}`);
    return response.data;
  },

  async getDefaultForm(entityType: string) {
    const response = await api.get(`/forms/default/${entityType}`);
    return response.data;
  },

  async updateForm(formKey: string, schema: FormSchema) {
    const response = await api.put(`/forms/${formKey}`, schema);
    return response.data;
  },

  async deleteForm(formKey: string) {
    const response = await api.delete(`/forms/${formKey}`);
    return response.data;
  },

  async getForms() {
    const response = await api.get('/forms');
    return response.data;
  },

  async formExists(formKey: string) {
    try {
      await this.getForm(formKey);
      return true;
    } catch (error) {
      return false;
    }
  },

  async createOrUpdateForm(schema: FormSchema) {
    if (schema.key && await this.formExists(schema.key)) {
      return await this.updateForm(schema.key, schema);
    } else {
      return await this.createForm(schema);
    }
  },

  async submitForm(formId: number, data: any) {
    const response = await api.post('/form-submissions', {
      form_id: formId,
      data,
    });
    return response.data;
  },

  async getSubmissions(formId: number) {
    const response = await api.get(`/form-submissions/${formId}`);
    return response.data;
  },
};

export { formService };
