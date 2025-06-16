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

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomConfigChange = (field: string, value: string | number | boolean) => {
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
        name: formData.name,
        description: formData.description,
        category: formData.category,
        creationMethod: formData.creationMethod === 'custom' ? 'custom-llm' : formData.creationMethod,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        creator: {
          id: 'demo-user-id',
          name: 'Demo User',
          email: 'demo@example.com',
        },
        deploymentStatus: 'published',
        ...(formData.creationMethod === 'prompt' && { prompt: formData.prompt }),
        ...(formData.creationMethod === 'custom' && { customLLMConfig: formData.customConfig }),
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-md shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground font-mono">create_new_agent()</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-mono">
                agent_name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-field"
                placeholder="enter agent name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-mono">
                description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input-field min-h-[100px] resize-none"
                placeholder="describe what your agent does"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-mono">
                category *
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
              <label className="block text-sm font-medium text-foreground mb-2 font-mono">
                tags
              </label>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder="enter tag"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      disabled={formData.tags.length === 1}
                      className="p-2 text-muted-foreground hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-mono"
                >
                  <Plus className="w-4 h-4" />
                  add_tag
                </button>
              </div>
            </div>
          </div>

          {/* Creation Method */}
          <div className="border-t border-border pt-6">
            <label className="block text-sm font-medium text-foreground mb-4 font-mono">
              creation_method *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleInputChange('creationMethod', 'prompt')}
                className={`p-4 border-2 rounded-md text-left transition-colors duration-200 ${
                  formData.creationMethod === 'prompt'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground font-mono">simple_prompt</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  // create agent with prompt description
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleInputChange('creationMethod', 'custom')}
                className={`p-4 border-2 rounded-md text-left transition-colors duration-200 ${
                  formData.creationMethod === 'custom'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground font-mono">custom_llm</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  // configure custom LLM settings
                </p>
              </button>
            </div>
          </div>

          {/* Configuration based on creation method */}
          {formData.creationMethod === 'prompt' ? (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-mono">
                agent_prompt *
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                className="input-field min-h-[120px] resize-none"
                placeholder="describe how your agent should behave..."
                required
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 font-mono">
                    model
                  </label>
                  <select
                    value={formData.customConfig.model}
                    onChange={(e) => handleCustomConfigChange('model', e.target.value)}
                    className="input-field"
                  >
                    <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                    <option value="gpt-4">gpt-4</option>
                    <option value="claude-3-sonnet">claude-3-sonnet</option>
                    <option value="claude-3-opus">claude-3-opus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 font-mono">
                    temperature: {formData.customConfig.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.customConfig.temperature}
                    onChange={(e) => handleCustomConfigChange('temperature', parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 font-mono">
                  max_tokens
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
                <label className="block text-sm font-medium text-foreground mb-2 font-mono">
                  system_prompt *
                </label>
                <textarea
                  value={formData.customConfig.systemPrompt}
                  onChange={(e) => handleCustomConfigChange('systemPrompt', e.target.value)}
                  className="input-field min-h-[120px] resize-none"
                  placeholder="define the system prompt for your agent..."
                  required
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-foreground bg-secondary hover:bg-muted rounded-md font-medium transition-colors duration-200 font-mono"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-md font-medium transition-colors duration-200 font-mono"
            >
              {isSubmitting ? 'creating...' : 'create_agent()'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}