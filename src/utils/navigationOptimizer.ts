'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

// Navigation optimizer to prevent blocking during route transitions
export function useOptimizedNavigation() {
  const router = useRouter();

  const navigateWithPreload = useCallback((href: string) => {
    // Preload the route before navigation
    router.prefetch(href);
    
    // Use setTimeout to prevent blocking current page
    setTimeout(() => {
      router.push(href);
    }, 0);
  }, [router]);

  const navigateWithDelay = useCallback((href: string, delay: number = 100) => {
    // Add a small delay to allow current operations to complete
    setTimeout(() => {
      router.push(href);
    }, delay);
  }, [router]);

  return {
    navigateWithPreload,
    navigateWithDelay,
    router
  };
}

// Utility to debounce data fetching
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Utility to create non-blocking async operations
export function createNonBlockingAsync<T>(
  asyncFn: () => Promise<T>,
  onSuccess?: (result: T) => void,
  onError?: (error: Error) => void
) {
  return () => {
    setTimeout(async () => {
      try {
        const result = await asyncFn();
        onSuccess?.(result);
      } catch (error) {
        onError?.(error as Error);
      }
    }, 0);
  };
}

// Performance monitoring for data fetching
export class DataFetchMonitor {
  private static instance: DataFetchMonitor;
  private fetchTimes: Map<string, number> = new Map();
  private slowFetchThreshold = 2000; // 2 seconds

  static getInstance(): DataFetchMonitor {
    if (!DataFetchMonitor.instance) {
      DataFetchMonitor.instance = new DataFetchMonitor();
    }
    return DataFetchMonitor.instance;
  }

  startFetch(key: string): void {
    this.fetchTimes.set(key, Date.now());
  }

  endFetch(key: string): number {
    const startTime = this.fetchTimes.get(key);
    if (!startTime) return 0;
    
    const duration = Date.now() - startTime;
    this.fetchTimes.delete(key);
    
    if (duration > this.slowFetchThreshold) {
      console.warn(`Slow fetch detected for ${key}: ${duration}ms`);
    }
    
    return duration;
  }

  wrapFetch<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    this.startFetch(key);
    return fetchFn().finally(() => {
      this.endFetch(key);
    });
  }
}