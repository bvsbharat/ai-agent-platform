'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Sparkles, Settings } from 'lucide-react';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated: () => void;
}

const categories = [
  'Assistant',
  'Automation',
  'Analytics',
  'Content',
  'Customer Service',
  'Development',
  'Education',
  'Finance',
  'Healthcare',
  'Marketing',
  'Other'
];

export default function CreateAgentModal({
  isOpen,
  onClose,
  onAgentCreated,
}: CreateAgentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Assistant',
    tags: [''],
    creationMethod: 'prompt', // 'prompt' or 'custom'
    prompt: '',
    customConfig: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomConfigChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customConfig: {
        ...prev.customConfig,
        [field]: value,
      },
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: newTags,
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, ''],
    }));
  };

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      const newTags = formData.tags.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        tags: newTags,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const agentData = {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        creator: {
          name: 'Demo User',
          email: 'demo@example.com',
        },
      };

      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });

      if (response.ok) {
        onAgentCreated();
        onClose();
        // Reset form
        setFormData({
          name: '',
          description: '',
          category: 'Assistant',
          tags: [''],
          creationMethod: 'prompt',
          prompt: '',
          customConfig: {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 1000,
            systemPrompt: '',
          },
        });
      } else {
        const error = await response.json();
        alert(`Error creating agent: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Error creating agent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Agent</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-field"
                placeholder="Enter agent name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input-field min-h-[100px] resize-none"
                placeholder="Describe what your agent does"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="input-field"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      disabled={formData.tags.length === 1}
                      className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Creation Method */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Creation Method *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleInputChange('creationMethod', 'prompt')}
                className={`p-4 border-2 rounded-lg text-left transition-colors duration-200 ${
                  formData.creationMethod === 'prompt'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Simple Prompt</span>
                </div>
                <p className="text-sm text-gray-600">
                  Create an agent with a simple prompt description
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleInputChange('creationMethod', 'custom')}
                className={`p-4 border-2 rounded-lg text-left transition-colors duration-200 ${
                  formData.creationMethod === 'custom'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Custom LLM</span>
                </div>
                <p className="text-sm text-gray-600">
                  Configure custom LLM settings and parameters
                </p>
              </button>
            </div>
          </div>

          {/* Configuration based on creation method */}
          {formData.creationMethod === 'prompt' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Prompt *
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                className="input-field min-h-[120px] resize-none"
                placeholder="Describe how your agent should behave and what it should do..."
                required
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <select
                    value={formData.customConfig.model}
                    onChange={(e) => handleCustomConfigChange('model', e.target.value)}
                    className="input-field"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature: {formData.customConfig.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.customConfig.temperature}
                    onChange={(e) => handleCustomConfigChange('temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={formData.customConfig.maxTokens}
                  onChange={(e) => handleCustomConfigChange('maxTokens', parseInt(e.target.value))}
                  className="input-field"
                  min="1"
                  max="4000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Prompt *
                </label>
                <textarea
                  value={formData.customConfig.systemPrompt}
                  onChange={(e) => handleCustomConfigChange('systemPrompt', e.target.value)}
                  className="input-field min-h-[120px] resize-none"
                  placeholder="Define the system prompt for your custom agent..."
                  required
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200"
            >
              {isSubmitting ? 'Creating...' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}