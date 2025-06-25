"use client";

import React from "react";
import { Shield, ExternalLink, Star, Download } from "lucide-react";

interface Rule {
  id: string;
  title: string;
  description: string;
  category: string;
  author_name: string;
  votes: number;
  views: number;
  created_at: string;
  tags: string[];
  content: string;
  link?: string; // Optional link property
}

interface RuleCardProps {
  rule: Rule;
  onViewRule?: (rule: Rule) => void;
}

export default function RuleCard({ rule, onViewRule }: RuleCardProps) {
  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {rule.title}
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {rule.category}
            </span>
          </div>
        </div>
        {rule.link && (
          <a
            href={rule.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {rule.description}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-3 h-3" />
          <span>{rule?.votes} votes</span>
        </div>
        <div className="flex items-center gap-2">
          <Download className="w-3 h-3" />
          <span>{rule?.views} views</span>
        </div>
        <span>
          By {rule?.author_name} on{" "}
          {new Date(rule.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {rule.tags && Array.isArray(rule.tags) && rule.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-secondary px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex justify-end">
        {onViewRule && (
          <button
            onClick={() => onViewRule(rule)}
            className="text-sm text-primary hover:underline"
          >
            View Rule
          </button>
        )}
      </div>
    </div>
  );
}
