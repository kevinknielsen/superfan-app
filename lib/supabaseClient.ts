import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false // Since we're using Privy for auth
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    }
  }
)

export default supabase 