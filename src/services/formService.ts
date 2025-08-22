import axios from 'axios';
import { FormSchema } from '../types/form';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const formService = {
  async createForm(schema: FormSchema) {
    const response = await axios.post(`${API_URL}/forms`, schema);
    return response.data;
  },

  async getForm(formKey: string) {
    const response = await axios.get(`${API_URL}/forms/${formKey}`);
    return response.data;
  },

  async getDefaultForm(entityType: string) {
    const response = await axios.get(`${API_URL}/forms/default/${entityType}`);
    return response.data;
  },

  async updateForm(formKey: string, schema: FormSchema) {
    const response = await axios.put(`${API_URL}/forms/${formKey}`, schema);
    return response.data;
  },

  async deleteForm(formKey: string) {
    const response = await axios.delete(`${API_URL}/forms/${formKey}`);
    return response.data;
  },

  async getForms() {
    const response = await axios.get(`${API_URL}/forms`);
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
    const response = await axios.post(`${API_URL}/form-submissions`, {
      form_id: formId,
      data,
    });
    return response.data;
  },

  async getSubmissions(formId: number) {
    const response = await axios.get(`${API_URL}/form-submissions/${formId}`);
    return response.data;
  },
};

export { formService };
