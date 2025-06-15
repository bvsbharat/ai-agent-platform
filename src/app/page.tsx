'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, TrendingUp, Clock, Eye, Play, Heart, Filter } from 'lucide-react';
import AgentCard from '@/components/AgentCard';
import CreateAgentModal from '@/components/CreateAgentModal';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';

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

export default function Home() {
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

  const fetchAgents = async (sort: string = 'newest', search: string = '', category: string = 'All', page: number = 1) => {
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
      
      setAgents(data.agents);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let sort = 'newest';
    if (activeTab === 'trending') sort = 'trending';
    
    fetchAgents(sort, searchQuery, selectedCategory, 1);
  }, [activeTab, searchQuery, selectedCategory]);

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
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Create AI Agents
            <span className="block text-4xl mt-2 text-blue-200">Effortlessly</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Build and publish powerful AI agents with simple prompts or custom LLM configurations. 
            Join thousands of developers creating the future of AI automation.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Your First Agent
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-4 lg:mb-0">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'new'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Clock className="w-4 h-4" />
              New
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'trending'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Search className="w-4 h-4" />
              Search
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

        {/* Search Bar (visible when search tab is active) */}
        {activeTab === 'search' && (
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search agents by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Agents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {agents.map((agent) => (
                <AgentCard key={agent._id} agent={agent} onUpdate={handleAgentCreated} />
              ))}
            </div>

            {agents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'search' && searchQuery
                    ? 'No agents found'
                    : 'No agents available'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'search' && searchQuery
                    ? 'Try adjusting your search terms or filters'
                    : 'Be the first to create an AI agent!'}
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Agent
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
                <span className="text-gray-600">
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
          </>
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
