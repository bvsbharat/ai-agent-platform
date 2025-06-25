"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Calendar, ArrowRight, Bot, Zap, User } from "lucide-react";
import Link from "next/link";
import MCPCard from "@/components/MCPCard";
import Header from "@/components/Header";
import LoginModal from "@/components/LoginModal";

import { GridSkeleton } from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";

// Commented out as currently unused
// interface Agent {
//   id: string;
//   name: string;
//   description: string;
//   category: string;
//   author_name: string;
//   likes: number;
//   views: number;
//   created_at: string;
//   tags: string[];
// }

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
  downloads?: number;
  rating?: number;
}

// Commented out as currently unused
// interface Rule {
//   _id: string;
//   name: string;
//   description: string;
//   category: string;
//   downloads: number;
//   rating: number;
//   link?: string;
// }

export default function Home() {
  // const [trendingAgents, setTrendingAgents] = useState<Agent[]>([]);
  const [trendingMCPs, setTrendingMCPs] = useState<MCP[]>([]);
  // const [trendingRules, setTrendingRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Destructuring but not using authLoading
  const {
    /* loading: authLoading */
  } = useAuth();

  const fetchTrendingData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch trending MCPs
      const mcpsResponse = await fetch("/api/mcps?sort=trending&limit=24");
      const mcpsData = await mcpsResponse.json();
      setTrendingMCPs(mcpsData.mcps || []);

      // Commented out for now as these features are not yet implemented
      /*
      // Fetch trending agents
      const agentsResponse = await fetch("/api/agents?sort=trending&limit=6");
      const agentsData = await agentsResponse.json();
      setTrendingAgents(agentsData.agents || []);

      // Fetch trending rules (mock data for now)
      setTrendingRules([
        {
          _id: "1",
          name: "Auto Email Responder",
          description:
            "Automatically respond to emails based on content analysis",
          category: "Communication",
          downloads: 1200,
          rating: 4.8,
        },
      */
      /*
        {
          _id: "2",
          name: "Smart Calendar Scheduler",
          description:
            "Intelligently schedule meetings based on availability and preferences",
          category: "Productivity",
          downloads: 890,
          rating: 4.6,
        },
        {
          _id: "3",
          name: "Document Classifier",
          description:
            "Automatically categorize and organize documents using AI",
          category: "Organization",
          downloads: 670,
          rating: 4.4,
        },
      ]);
      */
    } catch (error) {
      console.error("Error fetching trending data:", error);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="gradient-bg text-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 font-mono animate-float">
            <span className="animate-title-glow">
              The AI Hub for Developers
            </span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-muted-foreground font-mono">
            Discover, create AI agents, MCPs and coding rules. <br />
            <span className="text-primary">
              {"// Join the future of autonomous automation"}
            </span>
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="btn-primary inline-flex items-center gap-2 text-lg py-3 px-8 opacity-70 cursor-not-allowed hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
              Agents (Coming Soon)
            </div>
            <Link
              href="/mcps"
              className="btn-secondary inline-flex items-center gap-2 text-lg py-3 px-8 hover:scale-105 transition-transform"
            >
              <Zap className="w-5 h-5 animate-pulse" />
              Explore MCPs
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* MCPs Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-mono flex items-center gap-3">
                <Zap className="w-8 h-8 text-primary" />
                MCPs
              </h2>
              <p className="text-muted-foreground mt-2 font-mono">
                {"// Model Context Protocols"}
              </p>
            </div>
            <Link
              href="/mcps"
              className="btn-secondary inline-flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <GridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingMCPs.slice(0, 12).map((mcp) => (
                <MCPCard key={mcp.id} mcp={mcp} />
              ))}
            </div>
          )}
        </section>

        {/* Featured Agents Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-mono flex items-center gap-3">
                <Bot className="w-8 h-8 text-primary" />
                Featured Agents
              </h2>
              <p className="text-muted-foreground mt-2 font-mono">
                {"// Discover powerful AI agents"}
              </p>
            </div>
            <Link
              href="#"
              className="btn-secondary inline-flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Code Assistant Pro</h3>
                  <p className="text-sm text-muted-foreground">by Windsurf</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Advanced code generation and refactoring with context-aware
                suggestions.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="category-badge">Development</span>
                </div>
                <Link href="#" className="text-primary text-sm hover:underline">
                  View Details
                </Link>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Data Analyzer</h3>
                  <p className="text-sm text-muted-foreground">by TREA</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Intelligent data processing and visualization with natural
                language queries.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="category-badge">Data Science</span>
                </div>
                <Link href="#" className="text-primary text-sm hover:underline">
                  View Details
                </Link>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Content Creator</h3>
                  <p className="text-sm text-muted-foreground">by Claude</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Generate high-quality content with customizable tone and style
                preferences.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="category-badge">Content</span>
                </div>
                <Link href="#" className="text-primary text-sm hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
          <h2 className="text-4xl font-bold mb-4 font-mono">
            Join the Movement
          </h2>
          <p className="text-xl text-muted-foreground mb-8 font-mono">
            Connect with other AI developers and shape the future of intelligent
            app development
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="btn-primary inline-flex items-center gap-2 text-lg py-3 px-8">
              <Plus className="w-5 h-5" />
              Create Your Agent
            </div>
            <Link
              href="/mcps"
              className="btn-secondary inline-flex items-center gap-2 text-lg py-3 px-8"
            >
              <User className="w-5 h-5" />
              Join Community
            </Link>
          </div>
        </section>
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          // Refresh data after successful login
          fetchTrendingData();
        }}
      />
    </div>
  );
}
