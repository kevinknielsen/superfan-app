import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '@/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.from('projects').select('*')
  res.status(200).json({ data, error })
} 