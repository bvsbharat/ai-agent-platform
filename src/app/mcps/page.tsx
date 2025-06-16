'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, TrendingUp, Clock, ExternalLink, Download, Star } from 'lucide-react';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';

interface MCP {
  _id: string;
  id: string;
  name: string;
  description: string;
  link: string;
  logo: string;
  company_id: string;
  slug: string;
  active: boolean;
  plan: string;
  order: number;
  owner_id: string;
  created_at: string;
  installCount: number;
  category: string;
  tags: string[];
}

interface MCPsResponse {
  mcps: MCP[];
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
  'Testing',
  'Browser',
  'Automation',
  'API',
  'Database',
  'AI/ML',
  'Development',
  'Security',
  'Monitoring',
  'Deployment',
  'General'
];

export default function MCPsPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'trending' | 'search'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mcps, setMcps] = useState<MCP[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchMCPs = async (sort: string = 'newest', search: string = '', category: string = 'All', page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sort,
        limit: '12',
        page: page.toString()
      });
      
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      
      const response = await fetch(`/api/mcps?${params}`);
      const data: MCPsResponse = await response.json();
      
      setMcps(data.mcps || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching MCPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncMCPs = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/mcps', {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        // Refresh the MCPs list
        await fetchMCPs(activeTab === 'trending' ? 'trending' : 'newest', searchQuery, selectedCategory, 1);
      }
    } catch (error) {
      console.error('Error syncing MCPs:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    let sort = 'newest';
    if (activeTab === 'trending') sort = 'trending';
    
    fetchMCPs(sort, searchQuery, selectedCategory, 1);
  }, [activeTab, searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('search');
  };

  const handlePageChange = (newPage: number) => {
    const sort = activeTab === 'trending' ? 'trending' : 'newest';
    fetchMCPs(sort, searchQuery, selectedCategory, newPage);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-mono mb-2">
                MCP Servers
              </h1>
              <p className="text-muted-foreground">
                Discover and install Model Context Protocol servers for enhanced AI capabilities
              </p>
            </div>
            <button
              onClick={syncMCPs}
              disabled={syncing}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {syncing ? 'Syncing...' : 'Sync MCPs'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'new'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Latest
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'trending'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Popular
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* MCPs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-muted rounded"></div>
                  <div className="h-6 w-16 bg-muted rounded"></div>
                </div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {mcps.map((mcp) => (
                <MCPCard key={mcp._id} mcp={mcp} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-muted-foreground">
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

        {mcps.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              No MCPs found. Try adjusting your search or category filter.
            </div>
            <button
              onClick={syncMCPs}
              className="btn-primary"
            >
              Sync MCPs from Directory
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function MCPCard({ mcp }: { mcp: MCP }) {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2 font-mono">
            {mcp.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {mcp.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      {mcp.tags && mcp.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {mcp.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {mcp.installCount || 0}
          </span>
          <span className="px-2 py-1 bg-muted rounded text-xs">
            {mcp.category}
          </span>
        </div>
        <span className="text-xs">
          {mcp.plan}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={mcp.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex-1 text-center flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View on GitHub
        </a>
      </div>
    </div>
  );
}