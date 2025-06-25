"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { TrendingUp, Clock, Download } from "lucide-react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import Image from "next/image";
import LoadingSpinner, { GridSkeleton } from "@/components/LoadingSpinner";

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
  "All",
  "Testing",
  "Browser",
  "Automation",
  "API",
  "Database",
  "AI/ML",
  "Development",
  "Security",
  "Monitoring",
  "Deployment",
  "General",
];

export default function MCPsPage() {
  const [activeTab, setActiveTab] = useState<"new" | "trending" | "search">(
    "new"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mcps, setMcps] = useState<MCP[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchMCPs = useCallback(
    async (
      sort: string = "newest",
      search: string = "",
      category: string = "All",
      page: number = 1,
      append: boolean = false
    ) => {
      if (!append) setLoading(true);
      try {
        const params = new URLSearchParams({
          sort,
          limit: "12",
          page: page.toString(),
        });

        if (search) params.append("search", search);
        if (category !== "All") params.append("category", category);

        const response = await fetch(`/api/mcps?${params}`);
        const data: MCPsResponse = await response.json();

        if (append) {
          setMcps((prev) => [...prev, ...(data.mcps || [])]);
        } else {
          setMcps(data.mcps || []);
        }

        setPagination(
          data.pagination || {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          }
        );

        setHasMore(data.pagination?.hasNext || false);
      } catch (error) {
        console.error("Error fetching MCPs:", error);
        if (!append) setMcps([]);
      } finally {
        if (!append) setLoading(false);
      }
    },
    []
  );

  const syncMCPs = async () => {
    setSyncing(true);
    try {
      const response = await fetch("/api/mcps", {
        method: "POST",
      });
      const result = await response.json();

      if (result.success) {
        // Refresh the MCPs list
        await fetchMCPs(
          activeTab === "trending" ? "trending" : "newest",
          searchQuery,
          selectedCategory,
          1
        );
      }
    } catch (error) {
      console.error("Error syncing MCPs:", error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    let sort = "newest";
    if (activeTab === "trending") sort = "trending";

    // Use setTimeout to prevent blocking navigation
    const timeoutId = setTimeout(() => {
      fetchMCPs(sort, searchQuery, selectedCategory, 1);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [activeTab, searchQuery, selectedCategory, fetchMCPs]);

  // Function to handle search queries
  const _handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab("search");
  };

  const lastMCPElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const sort = activeTab === "trending" ? "trending" : "newest";
          fetchMCPs(
            sort,
            searchQuery,
            selectedCategory,
            pagination.page + 1,
            true
          );
        }
      });
      if (node) observer.current.observe(node);
    },
    [
      loading,
      hasMore,
      activeTab,
      searchQuery,
      selectedCategory,
      pagination.page,
      fetchMCPs,
    ]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-mono mb-2">
                MCP Servers
              </h1>
              <p className="text-muted-foreground">
                Discover and install Model Context Protocol servers for enhanced
                AI capabilities
              </p>
            </div>
            <button
              onClick={syncMCPs}
              disabled={syncing}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {syncing ? "Syncing..." : "Sync MCPs"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "new"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Latest
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "trending"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
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
        {loading && mcps.length === 0 ? (
          <GridSkeleton count={8} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {mcps.map((mcp, index) => {
                if (mcps.length === index + 1) {
                  return (
                    <MCPCard
                      ref={lastMCPElementRef}
                      key={mcp._id + index}
                      mcp={mcp}
                    />
                  );
                } else {
                  return <MCPCard key={mcp.id} mcp={mcp} />;
                }
              })}
            </div>

            {/* Loading indicator for lazy loading */}
            {loading && mcps.length > 0 && (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            )}
          </>
        )}

        {mcps.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              No MCPs found. Try adjusting your search or category filter.
            </div>
            <button onClick={syncMCPs} className="btn-primary">
              Sync MCPs from Directory
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const MCPCard = React.forwardRef<HTMLDivElement, { mcp: MCP }>(
  ({ mcp }, ref) => {
    return (
      <div
        ref={ref}
        className="card p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full flex flex-col relative overflow-hidden"
      >
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium border border-primary/20">
            {mcp.category}
          </span>
        </div>

        {/* Header with Logo and Name */}
        <div className="flex items-start gap-3 mb-4 pr-20">
          {/* MCP Logo */}
          <div className="flex-shrink-0">
            {mcp.logo ? (
              <Image
                src={mcp.logo}
                alt={`${mcp.name} logo`}
                width={40}
                height={40}
                className="rounded-lg shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = "/mcp-logo.svg";
                }}
              />
            ) : (
              <Image
                src="/mcp-logo.svg"
                alt="MCP logo"
                width={40}
                height={40}
                className="rounded-lg shadow-sm"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground mb-2 font-mono text-base truncate">
              {mcp.name}
            </h3>
          </div>
        </div>

        {/* Full Width Description */}
        <div className="mb-6">
          <p
            className="text-sm text-muted-foreground leading-relaxed"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {mcp.description}
          </p>
        </div>

        {/* Tags */}
        {mcp.tags && mcp.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {mcp.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full font-medium border bg-muted text-muted-foreground border-border transition-colors hover:scale-105"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions with Install Count */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <a
            href={mcp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-install text-xs px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-all hover:scale-105"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </a>
        </div>
      </div>
    );
  }
);

MCPCard.displayName = "MCPCard";
