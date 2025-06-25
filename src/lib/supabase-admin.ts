import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined')
}

// Admin Supabase client with service role key for elevated permissions
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey
)