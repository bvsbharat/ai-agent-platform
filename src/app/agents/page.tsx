'use client';

import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import CreateAgentModal from '@/components/CreateAgentModal';
import Header from '@/components/Header';



export default function AgentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const handleAgentCreated = () => {
    // Will be implemented when the agents feature is ready
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg text-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 font-mono">
            <span className="terminal-text">$</span> AI Agents
            <span className="block text-4xl mt-2 text-primary">--coming soon</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-muted-foreground font-mono">
            Our AI agents marketplace is under development. <br/>
            <span className="text-primary">{"// Check back soon for exciting new features"}</span>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 mb-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-12 h-12 text-primary animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            We&apos;re working hard to bring you a marketplace of powerful AI agents. 
            This feature will be available in the near future.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="btn-secondary"
            >
              Return Home
            </button>
          </div>
        </div>
      </main>

      {/* Create Agent Modal - keeping for future use */}
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAgentCreated={handleAgentCreated}
      />
    </div>
  );
}