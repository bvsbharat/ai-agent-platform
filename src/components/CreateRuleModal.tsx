'use client';

import { useState } from 'react';
import { X, Code, Tag, User, FileText } from 'lucide-react';

interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rule: {
    title: string;
    description: string;
    category: string;
    author: string;
    tags: string[];
    content: string;
  }) => void;
}

const CATEGORIES = [
  'TypeScript',
  'Python', 
  'Next.js',
  'React',
  'PHP',
  'JavaScript',
  'TailwindCSS',
  'Laravel',
  'C#',
  'Game Development',
  'Other'
];

export default function CreateRuleModal({ isOpen, onClose, onSubmit }: CreateRuleModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TypeScript',
    author: '',
    tags: '',
    content: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Rule content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      author: formData.author.trim(),
      tags,
      content: formData.content.trim()
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'TypeScript',
      author: '',
      tags: '',
      content: ''
    });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground font-mono">Create New Rule</h2>
            <p className="text-sm text-muted-foreground mt-1">Share your coding rules and best practices</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              <Code className="w-4 h-4 inline mr-2" />
              Rule Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., TypeScript Best Practices"
              className={`input-field w-full ${
                errors.title ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Short Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of what this rule covers..."
              rows={3}
              className={`input-field w-full resize-none ${
                errors.description ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category and Author Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="input-field w-full"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-foreground mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Author *
              </label>
              <input
                id="author"
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Your name or username"
                className={`input-field w-full ${
                  errors.author ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="typescript, react, nextjs (comma separated)"
              className="input-field w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate tags with commas. These help others find your rule.
            </p>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              Rule Content *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="You are an expert in [technology]. Code Style and Structure - Write concise, technical code with accurate examples..."
              rows={8}
              className={`input-field w-full resize-none font-mono text-sm ${
                errors.content ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Write the complete rule content that will be used by AI assistants.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Create Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}