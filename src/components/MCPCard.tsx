"use client";

import React from "react";
import { Zap, ExternalLink, Star, Play } from "lucide-react";
import Image from "next/image";

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

interface MCPCardProps {
  mcp: MCP;
}

export default function MCPCard({ mcp }: MCPCardProps) {
  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted">
            {mcp.logo ? (
              <Image
                src={mcp.logo}
                alt={`${mcp.name} logo`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {mcp.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {mcp.plan}
              </span>
              {mcp.active && (
                <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>
          </div>
        </div>
        {mcp.link && (
          <a
            href={mcp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {mcp.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {mcp.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{mcp.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <button className="btn-primary text-xs px-3 py-1 flex items-center gap-1">
          <Play className="w-3 h-3" />
          Install
        </button>
      </div>
    </div>
  );
}
