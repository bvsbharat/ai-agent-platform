"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Calendar,
  MapPin,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Clock,
  Users,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ExternalLink,
  Video,
} from "lucide-react";
import Header from "@/components/Header";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Hackathon {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
  attendees: number;
  imageUrl: string;
  eventUrl: string;
  isOnline: boolean;
}

export default function HackathonPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const fetchHackathons = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hackathons`);

      if (!response.ok) {
        throw new Error("Failed to fetch hackathons");
      }

      const data = await response.json();
      setHackathons(data.hackathons);
    } catch (err) {
      console.error("Error fetching hackathons:", err);
      setError("Failed to load hackathons. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  // Group hackathons by date
  const groupedHackathons = useMemo(() => {
    return hackathons.reduce((acc, hackathon) => {
      const date = hackathon.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(hackathon);
      return acc;
    }, {} as Record<string, Hackathon[]>);
  }, [hackathons]);

  // Sort dates
  const sortedDates = Object.keys(groupedHackathons).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  // Format date for display
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const dayOfWeek = date.toLocaleString("default", { weekday: "long" });

    // Check if date is today
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return { day, month, dayOfWeek, isToday };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,anim=false,background=white,quality=75,width=1080/discovery/sf-desktop.jpg"
            alt="Tech Hackathons"
            className="w-full h-full object-cover"
            width={1080}
            height={500}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h2 className="text-sm uppercase tracking-widest mb-2 text-primary">
                What's Happening in
              </h2>
              <h1 className="text-5xl font-bold mb-4 text-foreground">
                Tech Hackathons
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Join innovative minds, collaborate on exciting projects, and
                push the boundaries of technology at our upcoming hackathon
                events.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Events</h2>

        {/* Tabs */}
        <div className="flex space-x-2 w-fit">
          <button
            className={`px-4 py-1.5 rounded-full text-sm ${
              activeTab === "upcoming"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm ${
              activeTab === "past"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-destructive">{error}</p>
            <button onClick={fetchHackathons} className="mt-4 btn-primary">
              Try Again
            </button>
          </div>
        ) : hackathons.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No events found.</p>
          </div>
        ) : (
          <div className="space-y-8 mt-6">
            {sortedDates.map((date) => {
              const dateObj = new Date(date);
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);

              let dateLabel = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              const isToday = dateObj.toDateString() === today.toDateString();
              const isTomorrow =
                dateObj.toDateString() === tomorrow.toDateString();

              if (isToday) dateLabel = "Today";
              if (isTomorrow) dateLabel = "Tomorrow";

              const dayOfWeek = dateObj.toLocaleDateString("en-US", {
                weekday: "long",
              });

              return (
                <div key={date} className="mb-8">
                  {/* Date header */}
                  <div className="mb-4 flex items-center">
                    <div className="flex flex-col">
                      <div className="text-lg font-semibold text-foreground">
                        {dateLabel}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {dayOfWeek}
                      </div>
                    </div>
                    <div className="ml-4 h-0.5 flex-grow bg-border"></div>
                  </div>

                  {/* Events column */}
                  <div className="space-y-4">
                    {groupedHackathons[date].map((hackathon) => (
                      <EventCard key={hackathon.id} hackathon={hackathon} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

interface EventCardProps {
  hackathon: Hackathon;
}

function EventCard({ hackathon }: EventCardProps) {
  return (
    <div className="flex bg-card rounded-lg overflow-hidden hover:bg-secondary transition-all duration-300 mb-4">
      {/* Event image */}
      <div className="relative h-24 w-24 flex-shrink-0 ml-4 my-4 mr-4">
        <Image
          src={hackathon.imageUrl}
          alt={hackathon.title}
          fill
          className="object-cover rounded-md"
        />

        {/* LIVE tag - only show if online */}
        {hackathon.isOnline && (
          <div className="absolute top-0 left-0 text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-sm">
            LIVE
          </div>
        )}
      </div>

      {/* Event content */}
      <div className="flex-1 p-4 flex flex-col justify-center relative">
        {/* Time */}
        <div className="text-xs text-primary font-medium mb-1">
          {hackathon.time}
        </div>

        <h3 className="text-lg font-bold text-foreground">{hackathon.title}</h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <span className="flex items-center">
            {hackathon.isOnline ? (
              <>
                <Video className="w-4 h-4 mr-1" />
                <span>Zoom</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-1" />
                <span>{hackathon.location}</span>
              </>
            )}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{hackathon.attendees}</span>
          </span>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          <span>By {hackathon.organizer}</span>
        </div>
      </div>

      {/* Status tag */}
      <div className="w-24 flex-shrink-0 flex items-center justify-center p-4">
        <div className="bg-secondary text-primary text-xs font-medium px-3 py-1 rounded-full">
          {hackathon.isOnline ? "Online" : "In Person"}
        </div>
      </div>
    </div>
  );
}
