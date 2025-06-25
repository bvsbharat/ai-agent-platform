import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// POST /api/agents/[id]/like - Like an agent
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const params = await context.params
    
    // Get agent by ID
    const { data: agent, error } = await supabase
      .from('agents')
      .select('likes')
      .eq('id', params.id)
      .single()

    if (error || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Increment like count
    const { error: updateError } = await supabase
      .from('agents')
      .update({ likes: agent.likes + 1 })
      .eq('id', params.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update likes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating agent likes:', error);
    return NextResponse.json(
      { error: 'Failed to update agent likes' },
      { status: 500 }
    );
  }
}