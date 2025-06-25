'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, TrendingUp, Clock, Users, Code, Star } from 'lucide-react';
import Header from '@/components/Header';
import CreateRuleModal from '@/components/CreateRuleModal';

interface Rule {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  votes: number;
  views: number;
  createdAt: string;
  tags: string[];
  content: string;
}

const CATEGORIES = [
  'All',
  'TypeScript',
  'Python', 
  'Next.js',
  'React',
  'PHP',
  'JavaScript',
  'TailwindCSS',
  'Laravel',
  'C#',
  'Game Development'
];

const SAMPLE_RULES: Rule[] = [
  {
    id: '1',
    title: 'TypeScript',
    description: 'You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI and Tailwind.',
    category: 'TypeScript',
    author: 'cursor-community',
    votes: 22,
    views: 1250,
    createdAt: '2024-01-15',
    tags: ['typescript', 'react', 'nextjs'],
    content: 'You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI and Tailwind. Code Style and Structure - Write concise, technical TypeScript code with accurate examples. - Use functional and declarative programming patterns; avoid classes. - Prefer iteration and modularization over code duplication. - Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError). - Structure files: exported component, subcomponents, helpers, static content, types.'
  },
  {
    id: '2', 
    title: 'Python',
    description: 'You are an expert in Python, FastAPI, and scalable API development.',
    category: 'Python',
    author: 'dev-community',
    votes: 15,
    views: 890,
    createdAt: '2024-01-10',
    tags: ['python', 'fastapi', 'api'],
    content: 'You are an expert in Python, FastAPI, and scalable API development. Code Style and Structure - Write concise, idiomatic Python code with accurate examples. - Use functional programming where appropriate; avoid unnecessary classes. - Prefer iteration and modularization over code duplication. - Use descriptive variable names and follow PEP 8 conventions.'
  },
  {
    id: '3',
    title: 'Next.js',
    description: 'You are an expert in Next.js App Router, React, TypeScript, and modern web development.',
    category: 'Next.js',
    author: 'nextjs-team',
    votes: 12,
    views: 756,
    createdAt: '2024-01-08',
    tags: ['nextjs', 'react', 'typescript'],
    content: 'You are an expert in Next.js App Router, React, TypeScript, and modern web development. Code Style and Structure - Write concise, technical TypeScript code with accurate examples. - Use functional and declarative programming patterns; avoid classes. - Prefer iteration and modularization over code duplication.'
  },
  {
    id: '4',
    title: 'React',
    description: 'You are an expert in React, TypeScript, and modern frontend development.',
    category: 'React',
    author: 'react-community',
    votes: 12,
    views: 634,
    createdAt: '2024-01-05',
    tags: ['react', 'typescript', 'frontend'],
    content: 'You are an expert in React, TypeScript, and modern frontend development. Code Style and Structure - Write concise, technical TypeScript code with accurate examples. - Use functional and declarative programming patterns; avoid classes.'
  },
  {
    id: '5',
    title: 'PHP',
    description: 'You are an expert in PHP, Laravel, and backend development.',
    category: 'PHP',
    author: 'php-community',
    votes: 8,
    views: 445,
    createdAt: '2024-01-03',
    tags: ['php', 'laravel', 'backend'],
    content: 'You are an expert in PHP, Laravel, and backend development. Code Style and Structure - Write clean, readable PHP code following PSR standards. - Use object-oriented programming principles appropriately.'
  },
  {
    id: '6',
    title: 'JavaScript',
    description: 'You are an expert in JavaScript, ES6+, and modern web development.',
    category: 'JavaScript',
    author: 'js-community',
    votes: 5,
    views: 378,
    createdAt: '2024-01-01',
    tags: ['javascript', 'es6', 'web'],
    content: 'You are an expert in JavaScript, ES6+, and modern web development. Code Style and Structure - Write clean, modern JavaScript code using ES6+ features. - Use functional programming patterns where appropriate.'
  },
  {
    id: '7',
    title: 'TailwindCSS',
    description: 'You are an expert in Tailwind CSS and utility-first CSS framework.',
    category: 'TailwindCSS',
    author: 'tailwind-team',
    votes: 5,
    views: 289,
    createdAt: '2023-12-28',
    tags: ['tailwind', 'css', 'styling'],
    content: 'You are an expert in Tailwind CSS and utility-first CSS framework. Code Style and Structure - Use Tailwind utility classes effectively for responsive design. - Prefer utility classes over custom CSS when possible.'
  },
  {
    id: '8',
    title: 'Laravel',
    description: 'You are an expert in Laravel, PHP, and MVC architecture.',
    category: 'Laravel',
    author: 'laravel-community',
    votes: 5,
    views: 234,
    createdAt: '2023-12-25',
    tags: ['laravel', 'php', 'mvc'],
    content: 'You are an expert in Laravel, PHP, and MVC architecture. Code Style and Structure - Follow Laravel conventions and best practices. - Use Eloquent ORM effectively for database operations.'
  },
  {
    id: '9',
    title: 'C#',
    description: 'You are an expert in C#, .NET, and enterprise application development.',
    category: 'C#',
    author: 'dotnet-community',
    votes: 4,
    views: 198,
    createdAt: '2023-12-20',
    tags: ['csharp', 'dotnet', 'enterprise'],
    content: 'You are an expert in C#, .NET, and enterprise application development. Code Style and Structure - Follow C# coding conventions and best practices. - Use SOLID principles in object-oriented design.'
  },
  {
    id: '10',
    title: 'Game Development',
    description: 'You are an expert in game development, Unity, and interactive media.',
    category: 'Game Development',
    author: 'gamedev-community',
    votes: 4,
    views: 167,
    createdAt: '2023-12-18',
    tags: ['gamedev', 'unity', 'interactive'],
    content: 'You are an expert in game development, Unity, and interactive media. Code Style and Structure - Write efficient, performance-oriented code for games. - Use appropriate design patterns for game architecture.'
  }
];

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>(SAMPLE_RULES);
  const [filteredRules, setFilteredRules] = useState<Rule[]>(SAMPLE_RULES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    let filtered = rules;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(rule => rule.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(rule => 
        rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort rules
    if (sortBy === 'popular') {
      filtered.sort((a, b) => b.votes - a.votes);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredRules(filtered);
  }, [rules, selectedCategory, searchQuery, sortBy]);

  // Function to handle search queries
  const _handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateRule = (newRule: Omit<Rule, 'id' | 'votes' | 'views' | 'createdAt'>) => {
    const rule: Rule = {
      ...newRule,
      id: Date.now().toString(),
      votes: 0,
      views: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRules(prev => [rule, ...prev]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 font-mono">Popular Rules</h1>
            <p className="text-muted-foreground">Discover and share coding rules and best practices</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary mt-4 md:mt-0 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Submit Rule
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Sort Options */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 font-mono">Sort by</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSortBy('popular')}
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    sortBy === 'popular' 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Popular
                </button>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    sortBy === 'recent' 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Recent
                </button>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 font-mono">Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map((category) => {
                  const count = category === 'All' 
                    ? rules.length 
                    : rules.filter(rule => rule.category === category).length;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <span>{category}</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="// Search rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 pr-4 py-3 w-full"
                />
              </div>
            </div>

            {/* Rules Grid */}
            <div className="grid gap-4">
              {filteredRules.map((rule) => (
                <div key={rule.id} className="card p-6 hover:border-primary/20 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground font-mono">{rule.title}</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                          {rule.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{rule.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {rule.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground ml-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{rule.votes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{rule.views}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      <span>by {rule.author}</span>
                    </div>
                    <span>{new Date(rule.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredRules.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No rules found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Rule Modal */}
      <CreateRuleModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRule}
      />
    </div>
  );
}