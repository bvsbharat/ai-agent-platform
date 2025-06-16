'use client';

import { useState } from 'react';
import { Eye, Download, Heart, User, Calendar, Tag, MoreVertical, Edit, Trash2, Bot, Zap, BarChart3, FileText, Headphones, Code, GraduationCap, DollarSign, Heart as HeartIcon, Megaphone, HelpCircle } from 'lucide-react';
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
    'Assistant': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    'Automation': 'bg-green-500/20 text-green-400 border border-green-500/30',
    'Analytics': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    'Content': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'Customer Service': 'bg-pink-500/20 text-pink-400 border border-pink-500/30',
    'Development': 'bg-primary/20 text-primary border border-primary/30',
    'Education': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    'Finance': 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    'Healthcare': 'bg-red-500/20 text-red-400 border border-red-500/30',
    'Marketing': 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    'Other': 'bg-muted text-muted-foreground border border-border'
  };
  return colors[category] || colors['Other'];
};

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: any } = {
    'Assistant': Bot,
    'Automation': Zap,
    'Analytics': BarChart3,
    'Content': FileText,
    'Customer Service': Headphones,
    'Development': Code,
    'Education': GraduationCap,
    'Finance': DollarSign,
    'Healthcare': HeartIcon,
    'Marketing': Megaphone,
    'Other': HelpCircle
  };
  return icons[category] || icons['Other'];
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

  const handleInstall = async () => {
    setIsRunning(true);
    
    try {
      // Simulate installation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would handle the actual installation
      console.log('Installing agent:', agent.name);
      
      // Show success message or redirect to installed agents
      alert(`Agent "${agent.name}" has been installed successfully!`);
      
      onUpdate(); // Refresh to update metrics
    } catch (error) {
      console.error('Error installing agent:', error);
      alert('Error installing agent. Please try again.');
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

  const CategoryIcon = getCategoryIcon(agent.category);

  return (
    <div className="code-card group h-80 w-80">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CategoryIcon className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground line-clamp-1 font-mono">
              {agent.name}
            </h3>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium font-mono ${getCategoryColor(agent.category)}`}>
            {agent.category}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    // Handle edit - in a real app, this would open an edit modal
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted font-mono"
                >
                  <Edit className="w-4 h-4" />
                  edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete();
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 font-mono"
                >
                  <Trash2 className="w-4 h-4" />
                  delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm mb-3 line-clamp-2 font-mono">
        <span className="text-primary">// </span>{agent.description}
      </p>

      {/* Tags */}
      {agent.tags && agent.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {agent.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-mono"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {agent.tags.length > 2 && (
            <span className="text-xs text-muted-foreground font-mono">+{agent.tags.length - 2} more</span>
          )}
        </div>
      )}

      {/* Creator Info */}
      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground font-mono">
        <User className="w-4 h-4" />
        <span className="truncate">{agent.creator.name}</span>
        <span>•</span>
        <Calendar className="w-4 h-4" />
        <span className="truncate">{formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}</span>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground font-mono">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{agent.metrics.views}</span>
        </div>
        <div className="flex items-center gap-1">
          <Download className="w-4 h-4" />
          <span>{agent.metrics.runs}</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className={`w-4 h-4 ${isLiked ? 'text-red-400 fill-current' : ''}`} />
          <span>{agent.metrics.likes}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleInstall}
          disabled={isRunning}
          className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-mono"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              installing...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              install
            </>
          )}
        </button>
        <button
          onClick={() => {
            const traeUrl = `https://s.trae.ai/a/${agent._id}`;
            // Try multiple methods to open the Trae app
            const link = document.createElement('a');
            link.href = traeUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted transition-colors font-mono"
        >
          try
        </button>
        <button
          onClick={handleLike}
          className={`p-2 border rounded-md transition-colors font-mono ${
            isLiked
              ? 'border-red-400/50 text-red-400 bg-red-500/10'
              : 'border-border text-muted-foreground hover:bg-muted'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>


    </div>
  );
}