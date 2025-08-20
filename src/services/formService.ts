import { FormSchema } from '../types/schema';

const API_ENDPOINT = '/api/forms'; // Mock endpoint

// Mocking fetch to simulate network delay and API calls
const mockFetch = (url: string, options?: RequestInit): Promise<Response> => {
  console.log('Mock fetch:', url, options);
  return new Promise(resolve => {
    setTimeout(() => {
      if (options?.method === 'POST' && url.endsWith(API_ENDPOINT)) {
        const body = JSON.parse(options.body as string);
        localStorage.setItem(`form_${body.id}`, JSON.stringify(body));
        resolve(new Response(JSON.stringify(body), { status: 201 }));
      } else if (options?.method === 'GET' && url.startsWith(`${API_ENDPOINT}/`)) {
        const id = url.split('/').pop();
        const data = localStorage.getItem(`form_${id}`);
        if (data) {
          resolve(new Response(data, { status: 200 }));
        } else {
          resolve(new Response(JSON.stringify({ message: 'Not Found' }), { status: 404 }));
        }
      }
    }, 500);
  });
};

export const formService = {
  saveSchema: async (schema: FormSchema): Promise<FormSchema> => {
    // Save to localStorage for quick preview
    localStorage.setItem("eschool_form_schema", JSON.stringify(schema));

    // Save to mock API
    const response = await mockFetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schema),
    });
    if (!response.ok) {
      throw new Error('Failed to save form to API');
    }
    return response.json();
  },

  loadSchema: async (id: string): Promise<FormSchema | null> => {
    // Load from mock API
    const response = await mockFetch(`${API_ENDPOINT}/${id}`, { method: 'GET' });
    if (response.ok) {
      return response.json();
    }
    return null;
  },

  loadSchemaFromLocalStorage: (): FormSchema | null => {
    const raw = localStorage.getItem("eschool_form_schema");
    return raw ? JSON.parse(raw) : null;
  },
};