import api from './api';

export interface RoleConfig {
  roles: Record<string, any>;
  modules: Record<string, any>;
  hierarchy: Record<string, string[]>;
  defaults: Record<string, string>;
  email_mapping: Record<string, string>;
  domain_mapping: Record<string, string>;
}

export interface Role {
  name: string;
  description: string;
  permissions: string[];
  level: number;
  color: string;
  icon: string;
}

export interface Module {
  name: string;
  description: string;
  roles: string[];
}

export const roleManagementService = {
  // Get full role configuration
  getFullConfig: async (): Promise<{ success: boolean; config: RoleConfig }> => {
    const response = await api.get('/role-management/config');
    return response.data;
  },

  // Get all roles
  getAllRoles: async (): Promise<{ success: boolean; roles: Record<string, any> }> => {
    const response = await api.get('/role-management/roles');
    return response.data;
  },

  // Get specific role info
  getRoleInfo: async (roleName: string): Promise<{ success: boolean; role: any }> => {
    const response = await api.get(`/role-management/roles/${roleName}`);
    return response.data;
  },

  // Update role
  updateRole: async (params: { roleName: string; roleData: any }): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/role-management/roles/${params.roleName}`, params.roleData);
    return response.data;
  },

  // Get all modules
  getAllModules: async (): Promise<{ success: boolean; modules: Record<string, any> }> => {
    const response = await api.get('/role-management/modules');
    return response.data;
  },

  // Update module
  updateModule: async (params: { moduleName: string; moduleData: any }): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/role-management/modules/${params.moduleName}`, params.moduleData);
    return response.data;
  },

  // Get role permissions
  getRolePermissions: async (roleName: string): Promise<{ success: boolean; role: string; permissions: string[] }> => {
    const response = await api.get(`/role-management/permissions/${roleName}`);
    return response.data;
  },

  // Get module access
  getModuleAccess: async (moduleName: string): Promise<{ success: boolean; module: string; roles: string[] }> => {
    const response = await api.get(`/role-management/access/${moduleName}`);
    return response.data;
  },

  // Check user access
  checkUserAccess: async (userRole: string, moduleName: string): Promise<{ success: boolean; user_role: string; module: string; can_access: boolean }> => {
    const response = await api.post('/role-management/check-access', { userRole, moduleName });
    return response.data;
  },

  // Check user permission
  checkUserPermission: async (userRole: string, permission: string): Promise<{ success: boolean; user_role: string; permission: string; has_permission: boolean }> => {
    const response = await api.post('/role-management/check-permission', { userRole, permission });
    return response.data;
  },

  // Get role hierarchy
  getRoleHierarchy: async (): Promise<{ success: boolean; hierarchy: Record<string, string[]> }> => {
    const response = await api.get('/role-management/hierarchy');
    return response.data;
  },

  // Check if can manage role
  checkCanManageRole: async (managerRole: string, targetRole: string): Promise<{ success: boolean; manager_role: string; target_role: string; can_manage: boolean }> => {
    const response = await api.post('/role-management/can-manage', { managerRole, targetRole });
    return response.data;
  },

  // Email mapping methods
  getEmailMapping: async (): Promise<{ success: boolean; email_mapping: Record<string, string>; domain_mapping: Record<string, string> }> => {
    const response = await api.get('/role-management/email-mapping');
    return response.data;
  },

  addEmailMapping: async (email: string, role: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/role-management/email-mapping', { email, role });
    return response.data;
  },

  removeEmailMapping: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/role-management/email-mapping/${email}`);
    return response.data;
  },

  checkEmailRole: async (email: string): Promise<{ success: boolean; email: string; assigned_role: string; is_mapped: boolean }> => {
    const response = await api.post('/role-management/check-email-role', { email });
    return response.data;
  },
};
