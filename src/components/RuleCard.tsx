'use client';

import React from 'react';
import { Shield, ExternalLink, Star, Download } from 'lucide-react';

interface Rule {
  _id: string;
  name: string;
  description: string;
  category: string;
  downloads: number;
  rating: number;
  link?: string;
}

interface RuleCardProps {
  rule: Rule;
}

export default function RuleCard({ rule }: RuleCardProps) {
  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {rule.name}
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>{rule.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{rule.downloads.toLocaleString()}</span>
          </div>
        </div>
        
        <button className="btn-primary text-xs px-3 py-1">
          View Rule
        </button>
      </div>
    </div>
  );
}