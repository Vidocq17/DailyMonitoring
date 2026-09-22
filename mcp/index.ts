import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY ?? process.env.VITE_SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('SUPABASE_URL / SUPABASE_KEY manquants (env)')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const server = new McpServer({
  name: 'daily-monitoring-mcp',
  version: '0.0.0',
})

function asJson(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] }
}

function asError(message: string) {
  return { content: [{ type: 'text' as const, text: message }], isError: true }
}

server.registerTool(
  'get_recap',
  {
    description: "Récap du jour : dernière entrée daily_monitoring, derniers runs, derniers poids par exercice.",
    inputSchema: {},
  },
  async () => {
    const [daily, runs, weights] = await Promise.all([
      supabase.from('daily_monitoring').select('*').order('date_du_jour', { ascending: false }).limit(1),
      supabase.from('runs').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('workout_weights').select('*').order('created_at', { ascending: false }).limit(10),
    ])

    if (daily.error) return asError(daily.error.message)
    if (runs.error) return asError(runs.error.message)
    if (weights.error) return asError(weights.error.message)

    return asJson({
      last_daily_entry: daily.data?.[0] ?? null,
      recent_runs: runs.data ?? [],
      recent_workout_weights: weights.data ?? [],
    })
  },
)

server.registerTool(
  'list_daily_entries',
  {
    description: 'Liste les entrées daily_monitoring (poids, kcal, macros, sport...), triées par date décroissante.',
    inputSchema: {
      limit: z.number().int().positive().max(200).default(30),
      from: z.string().optional().describe('date_du_jour >= (YYYY-MM-DD)'),
      to: z.string().optional().describe('date_du_jour <= (YYYY-MM-DD)'),
    },
  },
  async ({ limit, from, to }) => {
    let query = supabase.from('daily_monitoring').select('*').order('date_du_jour', { ascending: false }).limit(limit)
    if (from) query = query.gte('date_du_jour', from)
    if (to) query = query.lte('date_du_jour', to)

    const { data, error } = await query
    if (error) return asError(error.message)
    return asJson(data)
  },
)

server.registerTool(
  'list_workout_weights',
  {
    description: 'Liste les poids soulevés par exercice, triés par date décroissante.',
    inputSchema: {
      exercise_name: z.string().optional(),
      limit: z.number().int().positive().max(500).default(50),
    },
  },
  async ({ exercise_name, limit }) => {
    let query = supabase.from('workout_weights').select('*').order('created_at', { ascending: false }).limit(limit)
    if (exercise_name) query = query.eq('exercise_name', exercise_name)

    const { data, error } = await query
    if (error) return asError(error.message)
    return asJson(data)
  },
)

server.registerTool(
  'list_runs',
  {
    description: 'Liste les sessions de course (durée, distance, commentaire), triées par date décroissante.',
    inputSchema: {
      limit: z.number().int().positive().max(200).default(30),
    },
  },
  async ({ limit }) => {
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) return asError(error.message)
    return asJson(data)
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
