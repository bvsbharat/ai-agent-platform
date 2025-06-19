'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, TrendingUp, Clock, ArrowRight, Bot, Zap, Shield, Users, Star, Download } from 'lucide-react';
import Link from 'next/link';
import AgentCard from '@/components/AgentCard';
import MCPCard from '@/components/MCPCard';
import RuleCard from '@/components/RuleCard';
import Header from '@/components/Header';
import Image from 'next/image';
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

interface MCP {
  _id: string;
  name: string;
  description: string;
  category: string;
  downloadCount?: number;
  installCount?: number;
  tags: string[];
}

interface Rule {
  _id: string;
  title: string;
  name?: string;
  description: string;
  category: string;
  likes: number;
  downloads: number;
  rating: number;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  trigger: string;
  actions: string[];
  conditions: any[];
}

export default function Home() {
  const [trendingAgents, setTrendingAgents] = useState<Agent[]>([]);
  const [trendingMCPs, setTrendingMCPs] = useState<MCP[]>([]);
  const [trendingRules, setTrendingRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTrendingData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch trending agents
      const agentsResponse = await fetch('/api/agents?sort=trending&limit=6');
      const agentsData = await agentsResponse.json();
      setTrendingAgents(agentsData.agents || []);

      // Fetch trending MCPs
      const mcpsResponse = await fetch('/api/mcps?sort=trending&limit=6');
      const mcpsData = await mcpsResponse.json();
      setTrendingMCPs(mcpsData.mcps || []);

      // Fetch trending rules (mock data for now)
      setTrendingRules([
        {
          _id: '1',
          title: 'Auto Email Responder',
          name: 'Auto Email Responder',
          description: 'Automatically respond to emails based on content analysis',
          category: 'Communication',
          tags: ['email', 'automation', 'ai'],
          author: 'AI Assistant',
          likes: 245,
          downloads: 1200,
          rating: 4.8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          trigger: 'email_received',
          actions: ['analyze_content', 'generate_response', 'send_email'],
          conditions: []
        },
        {
          _id: '2',
          title: 'Smart Calendar Scheduler',
          name: 'Smart Calendar Scheduler',
          description: 'Intelligently schedule meetings based on availability and preferences',
          category: 'Productivity',
          tags: ['calendar', 'scheduling', 'smart'],
          author: 'Productivity Pro',
          likes: 189,
          downloads: 890,
          rating: 4.6,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          trigger: 'meeting_request',
          actions: ['check_availability', 'suggest_times', 'book_meeting'],
          conditions: []
        },
        {
          _id: '3',
          title: 'Document Classifier',
          name: 'Document Classifier',
          description: 'Automatically categorize and organize documents using AI',
          category: 'Organization',
          tags: ['documents', 'classification', 'organization'],
          author: 'Doc Master',
          likes: 156,
          downloads: 670,
          rating: 4.4,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          trigger: 'document_upload',
          actions: ['analyze_content', 'categorize', 'move_to_folder'],
          conditions: []
        }
      ]);
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Use setTimeout to prevent blocking navigation
    const timeoutId = setTimeout(() => {
      fetchTrendingData();
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [fetchTrendingData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Redirect to search results or handle search
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section className="gradient-bg text-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold mb-6 font-mono">
            <span className="terminal-text">$</span> SuperAgents Hub
            <span className="block text-4xl mt-2 text-primary">--marketplace for AI automation</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-muted-foreground font-mono">
            Discover, create, and deploy AI agents, MCPs, and automation rules. <br/>
            <span className="text-primary">// Join the future of autonomous automation</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/agents" className="btn-primary inline-flex items-center gap-2 text-lg py-3 px-8">
              <Bot className="w-5 h-5" />
              Browse Agents
            </Link>
            <Link href="/mcps" className="btn-secondary inline-flex items-center gap-2 text-lg py-3 px-8">
              <Zap className="w-5 h-5" />
              Explore MCPs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary font-mono">10K+</div>
              <div className="text-muted-foreground font-mono">Active Agents</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary font-mono">5K+</div>
              <div className="text-muted-foreground font-mono">MCPs Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary font-mono">2K+</div>
              <div className="text-muted-foreground font-mono">Automation Rules</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary font-mono">50K+</div>
              <div className="text-muted-foreground font-mono">Community Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Trending Agents Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-mono flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                Trending Agents
              </h2>
              <p className="text-muted-foreground mt-2 font-mono">// Most popular AI agents this week</p>
            </div>
            <Link href="/agents" className="btn-secondary inline-flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <GridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingAgents.slice(0, 6).map((agent) => (
                <AgentCard key={agent._id} agent={agent} />
              ))}
            </div>
          )}
        </section>

        {/* Trending MCPs Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-mono flex items-center gap-3">
                <Zap className="w-8 h-8 text-primary" />
                Trending MCPs
              </h2>
              <p className="text-muted-foreground mt-2 font-mono">// Most downloaded Model Context Protocols</p>
            </div>
            <Link href="/mcps" className="btn-secondary inline-flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <GridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingMCPs.slice(0, 6).map((mcp) => (
                <MCPCard key={mcp._id} mcp={mcp} />
              ))}
            </div>
          )}
        </section>

        {/* Trending Rules Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-mono flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                Trending Rules
              </h2>
              <p className="text-muted-foreground mt-2 font-mono">// Most liked automation rules and guidelines</p>
            </div>
            <Link href="/rules" className="btn-secondary inline-flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <GridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingRules.slice(0, 3).map((rule) => (
                <RuleCard key={rule._id} rule={rule} />
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
          <h2 className="text-4xl font-bold mb-4 font-mono">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 font-mono">
            Join thousands of developers creating the next generation of AI automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/agents" className="btn-primary inline-flex items-center gap-2 text-lg py-3 px-8">
              <Plus className="w-5 h-5" />
              Create Agent
            </Link>
            <Link href="/mcps" className="btn-secondary inline-flex items-center gap-2 text-lg py-3 px-8">
              <Zap className="w-5 h-5" />
              Browse MCPs
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
