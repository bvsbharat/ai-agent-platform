import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// POST /api/agents/[id]/run - Run an agent and increment run count
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const params = await context.params
    
    const body = await request.json()
    const { input, userId } = body

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', params.id)
      .single()
      
    if (error || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    if (!agent.is_public) {
      return NextResponse.json(
        { error: 'Agent is not published' },
        { status: 400 }
      )
    }

    // Increment run count (assuming we have a runs field)
    await supabase
      .from('agents')
      .update({ runs: (agent.runs || 0) + 1 })
      .eq('id', params.id)

    // Simulate agent execution based on creation method
    let response: string
    if (agent.creation_method === 'prompt') {
      // Simple prompt-based agent
      response = `Agent Response: Based on the prompt "${agent.prompt}", here's my response to "${input}": This is a simulated response from the ${agent.name} agent. In a real implementation, this would be processed by an actual LLM.`
    } else {
      // Custom LLM configuration
      const config = agent.custom_llm_config
      response = `Custom LLM Response: Using model ${config?.model} with temperature ${config?.temperature}, responding to "${input}": This is a simulated response from the ${agent.name} agent with custom LLM configuration. In a real implementation, this would call the specified LLM endpoint.`
    }

    return NextResponse.json({
      agentId: agent.id,
      agentName: agent.name,
      input,
      response,
      timestamp: new Date().toISOString(),
      runCount: (agent.runs || 0) + 1
    })
  } catch (error) {
    console.error('Error running agent:', error);
    return NextResponse.json(
      { error: 'Failed to run agent' },
      { status: 500 }
    );
  }
}