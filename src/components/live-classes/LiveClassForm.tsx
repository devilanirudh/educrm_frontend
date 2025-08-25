import React, { useState } from 'react';
import { useCreateLiveClass } from '../../hooks/useLiveClasses';
import { useClasses } from '../../hooks/useClasses';
import { LiveClassCreate } from '../../services/liveClasses';
// Simple toast replacement
const toast = {
  success: (message: string) => alert(`Success: ${message}`),
  error: (message: string) => alert(`Error: ${message}`)
};

interface LiveClassFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LiveClassForm: React.FC<LiveClassFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<LiveClassCreate>({
    topic: '',
    start_time: '',
    duration: 60,
    class_id: 0,
    description: '',
    max_participants: 50,
    is_password_protected: false,
    meeting_password: '',
    allow_join_before_host: true,
    mute_upon_entry: true,
    video_off_upon_entry: false,
    enable_chat: true,
    enable_whiteboard: true,
    enable_screen_sharing: true,
    enable_recording: true,
    enable_breakout_rooms: true,
    enable_polls: true,
    enable_reactions: true,
  });

  const createLiveClassMutation = useCreateLiveClass();
  const { classes, isClassesLoading: classesLoading } = useClasses();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.class_id) {
      toast.error('Please select a class');
      return;
    }

    try {
      // Ensure proper data types
      const submitData = {
        ...formData,
        class_id: parseInt(formData.class_id as any, 10),
        duration: parseInt(formData.duration as any, 10),
        max_participants: parseInt(formData.max_participants as any, 10)
      };
      
      await createLiveClassMutation.mutateAsync(submitData);
      toast.success('Live class scheduled successfully!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to schedule live class');
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Schedule Live Class</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Topic *
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter class topic"
            />
          </div>

          <div>
            <label htmlFor="class_id" className="block text-sm font-medium text-gray-700 mb-2">
              Class *
            </label>
            <select
              id="class_id"
              name="class_id"
              value={formData.class_id || ''}
              onChange={handleInputChange}
              required
              disabled={classesLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a class</option>
              {classes?.data?.map((cls: any) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} {cls.section && `- ${cls.section}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
              Start Time *
            </label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes) *
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              min="15"
              max="240"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter class description"
          />
        </div>

        {/* Meeting Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Meeting Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-2">
                Max Participants
              </label>
              <input
                type="number"
                id="max_participants"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleInputChange}
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_password_protected"
                  checked={formData.is_password_protected}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Password Protected</span>
              </label>
            </div>

            {formData.is_password_protected && (
              <div>
                <label htmlFor="meeting_password" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Password
                </label>
                <input
                  type="text"
                  id="meeting_password"
                  name="meeting_password"
                  value={formData.meeting_password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter meeting password"
                />
              </div>
            )}
          </div>
        </div>

        {/* Join Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Join Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="allow_join_before_host"
                checked={formData.allow_join_before_host}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Allow join before host</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="mute_upon_entry"
                checked={formData.mute_upon_entry}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Mute upon entry</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="video_off_upon_entry"
                checked={formData.video_off_upon_entry}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Video off upon entry</span>
            </label>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Feature Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enable_chat"
                checked={formData.enable_chat}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Chat</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="enable_whiteboard"
                checked={formData.enable_whiteboard}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Whiteboard</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="enable_screen_sharing"
                checked={formData.enable_screen_sharing}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Screen Sharing</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="enable_recording"
                checked={formData.enable_recording}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Recording</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="enable_breakout_rooms"
                checked={formData.enable_breakout_rooms}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Breakout Rooms</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="enable_polls"
                checked={formData.enable_polls}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Polls</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="enable_reactions"
                checked={formData.enable_reactions}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Reactions</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createLiveClassMutation.isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createLiveClassMutation.isLoading ? 'Scheduling...' : 'Schedule Class'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveClassForm;