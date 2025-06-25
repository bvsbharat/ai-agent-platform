import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const createClientSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client
export const createServerSupabaseClient = async () => {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          name: string
          description: string
          creation_method: 'prompt' | 'custom-llm'
          category: string
          creator_id: string
          creator_name: string
          creator_email: string
          prompt: string | null
          custom_llm_config: Record<string, unknown> | null
          tags: string[]
          views: number
          runs: number
          likes: number
          deployment_status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          creation_method: 'prompt' | 'custom-llm'
          category: string
          creator_id: string
          creator_name: string
          creator_email: string
          prompt?: string | null
          custom_llm_config?: Record<string, unknown> | null
          tags?: string[]
          views?: number
          runs?: number
          likes?: number
          deployment_status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          creation_method?: 'prompt' | 'custom-llm'
          category?: string
          creator_id?: string
          creator_name?: string
          creator_email?: string
          prompt?: string | null
          custom_llm_config?: Record<string, unknown> | null
          tags?: string[]
          views?: number
          runs?: number
          likes?: number
          deployment_status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      mcps: {
        Row: {
          id: string
          name: string
          description: string
          link: string
          logo: string | null
          company_id: string
          slug: string
          active: boolean
          plan: string
          config: Record<string, unknown> | null
          created_at: string
          synced_at: string | null
          downloads: number | null
        }
        Insert: {
          id: string
          name: string
          description: string
          link: string
          logo?: string | null
          company_id: string
          slug: string
          active?: boolean
          plan: string
          config?: Record<string, unknown> | null
          created_at?: string
          synced_at?: string | null
          downloads?: number | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          link?: string
          logo?: string | null
          company_id?: string
          slug?: string
          active?: boolean
          plan?: string
          config?: Record<string, unknown> | null
          created_at?: string
          synced_at?: string | null
          downloads?: number | null
        }
      }
      rules: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          author_id: string
          author_name: string
          votes: number
          views: number
          tags: string[]
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          author_id: string
          author_name: string
          votes?: number
          views?: number
          tags?: string[]
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          author_id?: string
          author_name?: string
          votes?: number
          views?: number
          tags?: string[]
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          bio: string | null
          website: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}