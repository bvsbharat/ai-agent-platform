'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, TrendingUp, Clock, Filter, Grid, List } from 'lucide-react';
import AgentCard from '@/components/AgentCard';
import CreateAgentModal from '@/components/CreateAgentModal';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import { GridSkeleton } from '@/components/LoadingSpinner';

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

interface AgentsResponse {
  agents: Agent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const CATEGORIES = [
  'All',
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

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'trending' | 'search'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchAgents = useCallback(async (sort: string = 'newest', search: string = '', category: string = 'All', page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sort,
        limit: '12',
        page: page.toString()
      });
      
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      
      const response = await fetch(`/api/agents?${params}`);
      const data: AgentsResponse = await response.json();
      
      setAgents(data.agents || []);
      setPagination(data.pagination || {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      });
    } catch (error) {
      console.error('Error fetching agents:', error);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let sort = 'newest';
    if (activeTab === 'trending') sort = 'trending';
    
    // Use setTimeout to prevent blocking navigation
    const timeoutId = setTimeout(() => {
      fetchAgents(sort, searchQuery, selectedCategory, 1);
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [activeTab, searchQuery, selectedCategory, fetchAgents]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('search');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePageChange = (newPage: number) => {
    let sort = 'newest';
    if (activeTab === 'trending') sort = 'trending';
    
    fetchAgents(sort, searchQuery, selectedCategory, newPage);
  };

  const handleAgentCreated = () => {
    // Refresh the agents list
    let sort = 'newest';
    if (activeTab === 'trending') sort = 'trending';
    
    fetchAgents(sort, searchQuery, selectedCategory, pagination.page);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section className="gradient-bg text-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 font-mono">
            <span className="terminal-text">$</span> Browse AI Agents
            <span className="block text-4xl mt-2 text-primary">--discover & deploy</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-muted-foreground font-mono">
            Explore thousands of AI agents created by the community. <br/>
            <span className="text-primary">// Find the perfect agent for your automation needs</span>
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2 text-lg py-3 px-8"
          >
            <Plus className="w-5 h-5" />
            Create Your Own Agent
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex space-x-1 bg-card border border-border rounded-md p-1 shadow-sm mb-4 lg:mb-0">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium font-mono transition-colors ${
                activeTab === 'new'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Clock className="w-4 h-4" />
              new
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium font-mono transition-colors ${
                activeTab === 'trending'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              trending
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium font-mono transition-colors ${
                activeTab === 'search'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Search className="w-4 h-4" />
              search
            </button>
          </div>

          <div className="flex items-center gap-4">
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Agent
            </button>
          </div>
        </div>

        {/* Agents Grid */}
        {loading ? (
          <GridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent._id} agent={agent} />
            ))}
          </div>
        )}

        {agents.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              No agents found. Try adjusting your search or category filter.
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary"
            >
              Create the First Agent
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-muted-foreground font-mono">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Create Agent Modal */}
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAgentCreated={handleAgentCreated}
      />
    </div>
  );
}