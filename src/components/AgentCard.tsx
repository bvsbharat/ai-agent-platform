'use client';

import { useState } from 'react';
import { Eye, Play, Heart, User, Calendar, Tag, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Agent {
  _id: string;
  name: string;
  description: string;
  category: string;
  creator: {
    name: string;
    email: string;
  };
  metrics: {
    views: number;
    runs: number;
    likes: number;
  };
  createdAt: string;
  tags: string[];
}

interface AgentCardProps {
  agent: Agent;
  onUpdate: () => void;
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Assistant': 'bg-blue-100 text-blue-800',
    'Automation': 'bg-green-100 text-green-800',
    'Analytics': 'bg-purple-100 text-purple-800',
    'Content': 'bg-yellow-100 text-yellow-800',
    'Customer Service': 'bg-pink-100 text-pink-800',
    'Development': 'bg-indigo-100 text-indigo-800',
    'Education': 'bg-orange-100 text-orange-800',
    'Finance': 'bg-emerald-100 text-emerald-800',
    'Healthcare': 'bg-red-100 text-red-800',
    'Marketing': 'bg-cyan-100 text-cyan-800',
    'Other': 'bg-gray-100 text-gray-800'
  };
  return colors[category] || colors['Other'];
};

export default function AgentCard({ agent, onUpdate }: AgentCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [runResult, setRunResult] = useState<string | null>(null);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/agents/${agent._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user', // In a real app, this would come from auth
          action: isLiked ? 'unlike' : 'like'
        }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        onUpdate(); // Refresh the agents list to update metrics
      }
    } catch (error) {
      console.error('Error liking agent:', error);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);
    
    try {
      const response = await fetch(`/api/agents/${agent._id}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: 'Hello! Please introduce yourself and explain what you can do.',
          userId: 'demo-user'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setRunResult(result.response);
        onUpdate(); // Refresh to update run count
      }
    } catch (error) {
      console.error('Error running agent:', error);
      setRunResult('Error running agent. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this agent?')) {
      try {
        const response = await fetch(`/api/agents/${agent._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          onUpdate(); // Refresh the agents list
        }
      } catch (error) {
        console.error('Error deleting agent:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {agent.name}
          </h3>
          <span className={`category-badge ${getCategoryColor(agent.category)}`}>
            {agent.category}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    // Handle edit - in a real app, this would open an edit modal
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {agent.description}
      </p>

      {/* Tags */}
      {agent.tags && agent.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {agent.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {agent.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{agent.tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Creator Info */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
        <User className="w-4 h-4" />
        <span>{agent.creator.name}</span>
        <span>•</span>
        <Calendar className="w-4 h-4" />
        <span>{formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}</span>
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{agent.metrics.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Play className="w-4 h-4" />
            <span>{agent.metrics.runs}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
            <span>{agent.metrics.likes}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Running...' : 'Run'}
        </button>
        <button
          onClick={handleLike}
          className={`p-2 rounded-md transition-colors duration-200 ${
            isLiked
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Run Result */}
      {runResult && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Agent Response:</h4>
          <p className="text-sm text-gray-600 line-clamp-4">{runResult}</p>
        </div>
      )}
    </div>
  );
}