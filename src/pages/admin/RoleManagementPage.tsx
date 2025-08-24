import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { roleManagementService } from '../../services/roleManagement';
import { 
  ShieldCheckIcon, 
  AcademicCapIcon, 
  UserGroupIcon, 
  UserIcon,
  CogIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Role {
  name: string;
  description: string;
  permissions: string[];
  level: number;
  color: string;
  icon: string;
}

interface Module {
  name: string;
  description: string;
  roles: string[];
}

const RoleManagementPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [showEmailMapping, setShowEmailMapping] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newEmailRole, setNewEmailRole] = useState('');
  const [checkEmail, setCheckEmail] = useState('');
  const [emailCheckResult, setEmailCheckResult] = useState<any>(null);
  const [showEmailCheckModal, setShowEmailCheckModal] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch role configuration
  const { data: configData, isLoading, error } = useQuery(
    'roleConfig',
    roleManagementService.getFullConfig,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Update role mutation
  const updateRoleMutation = useMutation(
    roleManagementService.updateRole,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('roleConfig');
        setEditingRole(null);
      },
    }
  );

  // Update module mutation
  const updateModuleMutation = useMutation(
    roleManagementService.updateModule,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('roleConfig');
        setEditingModule(null);
      },
    }
  );

  const roles = configData?.config?.roles || {};
  const modules = configData?.config?.modules || {};

  const getRoleIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      'shield-check': ShieldCheckIcon,
      'academic-cap': AcademicCapIcon,
      'user-group': UserGroupIcon,
      'user': UserIcon,
      'cog': CogIcon,
    };
    return icons[iconName] || UserIcon;
  };

  const handleRoleEdit = (roleName: string) => {
    setEditingRole(roles[roleName]);
    setSelectedRole(roleName);
  };

  const handleModuleEdit = (moduleName: string) => {
    setEditingModule(modules[moduleName]);
    setSelectedModule(moduleName);
  };

  const handleRoleSave = () => {
    if (editingRole && selectedRole) {
      updateRoleMutation.mutate({
        roleName: selectedRole,
        roleData: editingRole,
      });
    }
  };

  const handleModuleSave = () => {
    if (editingModule && selectedModule) {
      updateModuleMutation.mutate({
        moduleName: selectedModule,
        moduleData: editingModule,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading role configuration</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Role Management</h1>
          <p className="text-gray-600">Configure roles, permissions, and module access</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowEmailMapping(!showEmailMapping)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {showEmailMapping ? 'Hide' : 'Show'} Email-Role Mapping
          </button>
        </div>

        {showEmailMapping && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Email-Role Mapping</h2>
            
            {/* Check Email Role */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Check Email Role</h3>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter email to check"
                  value={checkEmail}
                  onChange={(e) => setCheckEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    if (checkEmail) {
                      roleManagementService.checkEmailRole(checkEmail).then((result: any) => {
                        setEmailCheckResult(result);
                        setShowEmailCheckModal(true);
                      });
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Check
                </button>
              </div>
            </div>

            {/* Add Email Mapping */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Add Email Mapping</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newEmailRole}
                  onChange={(e) => setNewEmailRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {Object.entries(roles).map(([roleName, role]: [string, any]) => (
                    <option key={roleName} value={roleName}>{role.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (newEmail && newEmailRole) {
                      roleManagementService.addEmailMapping(newEmail, newEmailRole).then(() => {
                        queryClient.invalidateQueries('roleConfig');
                        setNewEmail('');
                        setNewEmailRole('');
                        // Success notification could be added here
                      });
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add Mapping
                </button>
              </div>
            </div>

            {/* Email Mappings List */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Current Email Mappings</h3>
              <div className="space-y-2">
                {configData?.config?.email_mapping && Object.entries(configData.config.email_mapping as Record<string, string>).map(([email, role]) => (
                  <div key={email} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <span className="font-medium">{email}</span>
                      <span className="text-gray-500 ml-2">→ {role}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove mapping for ${email}?`)) {
                          roleManagementService.removeEmailMapping(email).then(() => {
                            queryClient.invalidateQueries('roleConfig');
                            // Success notification could be added here
                          });
                        }
                      }}
                      className="px-2 py-1 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Roles Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Roles</h2>
              <CogIcon className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {Object.entries(roles).map(([roleName, role]: [string, any]) => {
                const IconComponent = getRoleIcon(role.icon);
                return (
                  <div
                    key={roleName}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRole === roleName
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRole(roleName)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: role.color + '20' }}
                        >
                          <IconComponent 
                            className="h-5 w-5" 
                            style={{ color: role.color }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{role.name}</h3>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoleEdit(roleName);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modules Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Modules</h2>
              <CogIcon className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {Object.entries(modules).map(([moduleName, module]: [string, any]) => (
                <div
                  key={moduleName}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedModule === moduleName
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedModule(moduleName)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{module.name}</h3>
                      <p className="text-sm text-gray-500">{module.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {module.roles?.map((role: string) => (
                          <span
                            key={role}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModuleEdit(moduleName);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role Edit Modal */}
        {editingRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Role: {selectedRole}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingRole.description}
                    onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissions (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingRole.permissions.join(', ')}
                    onChange={(e) => setEditingRole({ 
                      ...editingRole, 
                      permissions: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={editingRole.color}
                    onChange={(e) => setEditingRole({ ...editingRole, color: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingRole(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoleSave}
                  disabled={updateRoleMutation.isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {updateRoleMutation.isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Module Edit Modal */}
        {editingModule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Module: {selectedModule}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingModule.name}
                    onChange={(e) => setEditingModule({ ...editingModule, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingModule.description}
                    onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accessible Roles (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingModule.roles.join(', ')}
                    onChange={(e) => setEditingModule({ 
                      ...editingModule, 
                      roles: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingModule(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModuleSave}
                  disabled={updateModuleMutation.isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {updateModuleMutation.isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Check Result Modal */}
        {showEmailCheckModal && emailCheckResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Email Role Check Result</h3>
                <button
                  onClick={() => setShowEmailCheckModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-900">{emailCheckResult.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Assigned Role:</span>
                  <span className="text-gray-900">{emailCheckResult.assigned_role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Is Mapped:</span>
                  <span className={`font-medium ${emailCheckResult.is_mapped ? 'text-green-600' : 'text-red-600'}`}>
                    {emailCheckResult.is_mapped ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowEmailCheckModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagementPage;
