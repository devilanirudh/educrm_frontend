// // import { FormSchema } from '../types/schema';

// // const API_ENDPOINT = '/api/forms'; // Mock endpoint

// // // Mocking fetch to simulate network delay and API calls
// // const mockFetch = (url: string, options?: RequestInit): Promise<Response> => {
// //   console.log('Mock fetch:', url, options);
// //   return new Promise(resolve => {
// //     setTimeout(() => {
// //       if (options?.method === 'POST' && url.endsWith(API_ENDPOINT)) {
// //         const body = JSON.parse(options.body as string);
// //         localStorage.setItem(`form_${body.id}`, JSON.stringify(body));
// //         resolve(new Response(JSON.stringify(body), { status: 201 }));
// //       } else if (options?.method === 'GET' && url.startsWith(`${API_ENDPOINT}/`)) {
// //         const id = url.split('/').pop();
// //         const data = localStorage.getItem(`form_${id}`);
// //         if (data) {
// //           resolve(new Response(data, { status: 200 }));
// //         } else {
// //           resolve(new Response(JSON.stringify({ message: 'Not Found' }), { status: 404 }));
// //         }
// //       }
// //     }, 500);
// //   });
// // };

// // export const formService = {
// //   saveSchema: async (schema: FormSchema): Promise<FormSchema> => {
// //     // Save to localStorage for quick preview
// //     localStorage.setItem("eschool_form_schema", JSON.stringify(schema));

// //     // Save to mock API
// //     const response = await mockFetch(API_ENDPOINT, {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify(schema),
// //     });
// //     if (!response.ok) {
// //       throw new Error('Failed to save form to API');
// //     }
// //     return response.json();
// //   },

// //   loadSchema: async (id: string): Promise<FormSchema | null> => {
// //     // Load from mock API
// //     const response = await mockFetch(`${API_ENDPOINT}/${id}`, { method: 'GET' });
// //     if (response.ok) {
// //       return response.json();
// //     }
// //     return null;
// //   },

// //   loadSchemaFromLocalStorage: (): FormSchema | null => {
// //     const raw = localStorage.getItem("eschool_form_schema");
// //     return raw ? JSON.parse(raw) : null;
// //   },
// // };




import { FormSchema } from '../types/schema';

// Mock endpoint for form schemas
const SCHEMA_API_ENDPOINT = '/api/forms';
// Mock endpoint prefix for submitted form data
const DATA_API_ENDPOINT_PREFIX = '/api/data';

// Helper to get localStorage key for submitted data
const getSubmittedDataKey = (entityType: string) => `submitted_data_${entityType}`;

// Mocking fetch to simulate network delay and API calls
const mockFetch = (url: string, options?: RequestInit): Promise<Response> => {
  console.log('Mock fetch:', url, options);
  return new Promise(resolve => {
    setTimeout(() => {
      // Handle saving/loading form schemas
      if (url.startsWith(SCHEMA_API_ENDPOINT)) {
        if (options?.method === 'POST') {
          const body = JSON.parse(options.body as string);
          localStorage.setItem(`form_schema_${body.id}`, JSON.stringify(body));
          localStorage.setItem("eschool_form_schema", JSON.stringify(body)); // Also update the last saved schema
          resolve(new Response(JSON.stringify({ message: 'Schema saved successfully', data: body }), { status: 201 }));
        } else if (options?.method === 'GET') {
          const id = url.split('/').pop();
          const data = localStorage.getItem(`form_schema_${id}`);
          if (data) {
            resolve(new Response(data, { status: 200 }));
          } else {
            resolve(new Response(JSON.stringify({ message: 'Not Found' }), { status: 404 }));
          }
        }
      } 
      // 🆕 NEW: Handle submitting form data
      else if (url.startsWith(DATA_API_ENDPOINT_PREFIX)) {
        const parts = url.split('/');
        const entityType = parts[parts.length - 1]; // e.g., 'students', 'teachers'

        if (options?.method === 'POST') {
          const submittedData = JSON.parse(options.body as string);
          const currentDataRaw = localStorage.getItem(getSubmittedDataKey(entityType));
          const currentData = currentDataRaw ? JSON.parse(currentDataRaw) : [];
          
          const newData = { id: Date.now().toString(), ...submittedData }; // Assign a mock ID
          currentData.push(newData);
          localStorage.setItem(getSubmittedDataKey(entityType), JSON.stringify(currentData));
          
          resolve(new Response(JSON.stringify({ message: `${entityType} data submitted successfully!`, data: newData }), { status: 201 }));
        } else if (options?.method === 'GET') {
             const currentDataRaw = localStorage.getItem(getSubmittedDataKey(entityType));
             const currentData = currentDataRaw ? JSON.parse(currentDataRaw) : [];
             resolve(new Response(JSON.stringify({ message: `Fetched ${entityType} data`, data: currentData }), { status: 200 }));
        }
      }
      else {
        resolve(new Response(JSON.stringify({ message: 'Mock API endpoint not found' }), { status: 404 }));
      }
    }, 500);
  });
};

export const formService = {
  saveSchema: async (schema: FormSchema): Promise<any> => { // Changed return type to any for mock response
    // Save to localStorage for quick preview (already handled in mockFetch)
    const response = await mockFetch(SCHEMA_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schema),
    });
    if (!response.ok) {
      throw new Error('Failed to save form schema to mock API');
    }
    return response.json();
  },

  loadSchema: async (id: string): Promise<FormSchema | null> => {
    const response = await mockFetch(`${SCHEMA_API_ENDPOINT}/${id}`, { method: 'GET' });
    if (response.ok) {
      return response.json();
    }
    return null;
  },

  loadSchemaFromLocalStorage: (): FormSchema | null => {
    const raw = localStorage.getItem("eschool_form_schema");
    return raw ? JSON.parse(raw) : null;
  },

  // 🆕 NEW: Function to submit form data to mock backend
  submitFormData: async (entityType: string, data: Record<string, any>): Promise<any> => {
    const response = await mockFetch(`${DATA_API_ENDPOINT_PREFIX}/${entityType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to submit data for ${entityType}`);
    }
    return response.json();
  },

  // 🆕 NEW: Function to get submitted data from mock backend
  getSubmittedData: async (entityType: string): Promise<any[]> => {
    const response = await mockFetch(`${DATA_API_ENDPOINT_PREFIX}/${entityType}`, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Failed to fetch submitted data for ${entityType}`);
    }
    const result = await response.json();
    return result.data || [];
  }
};
