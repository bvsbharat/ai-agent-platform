'use client';

import React from 'react';
import { Users, Clock } from 'lucide-react';
import Header from '@/components/Header';

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg text-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 font-mono">
            <span className="terminal-text">$</span> Community Members
            <span className="block text-4xl mt-2 text-primary">--coming soon</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-muted-foreground font-mono">
            Our community members directory is under development. <br/>
            <span className="text-primary">Stay tuned for updates!</span>
          </p>

          <div className="flex justify-center items-center mt-12">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-primary/30 rounded-full animate-pulse"></div>
              <Clock className="w-16 h-16 text-primary relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center font-mono">
            <span className="text-primary">{"// "}</span>
            Coming Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Member Profiles</h3>
              <p className="text-muted-foreground text-center">
                Create your profile, showcase your skills, and connect with other AI developers.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Collaboration</h3>
              <p className="text-muted-foreground text-center">
                Find partners for your AI projects and collaborate on cutting-edge solutions.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Community Forums</h3>
              <p className="text-muted-foreground text-center">
                Engage in discussions, share ideas, and get help from the community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}