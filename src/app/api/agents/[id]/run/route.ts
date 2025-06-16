import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agent from '@/models/Agent';
import mongoose from 'mongoose';

// POST /api/agents/[id]/run - Run an agent and increment run count
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const params = await context.params;
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { input } = body;

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    const agent = await Agent.findById(params.id);

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    if (agent.deploymentStatus !== 'published') {
      return NextResponse.json(
        { error: 'Agent is not published' },
        { status: 400 }
      );
    }

    // Increment run count
    await Agent.findByIdAndUpdate(params.id, {
      $inc: { 'metrics.runs': 1 }
    });

    // Simulate agent execution based on creation method
    let response: string;
    
    if (agent.creationMethod === 'prompt') {
      // For prompt-based agents, combine the agent's prompt with user input
      response = `Agent Response: Based on the prompt "${agent.prompt}", here's my response to "${input}": This is a simulated response from the ${agent.name} agent. In a real implementation, this would be processed by an actual LLM.`;
    } else {
      // For custom LLM agents, use the custom configuration
      const config = agent.customLLMConfig;
      response = `Custom LLM Response: Using model ${config?.model} with temperature ${config?.temperature}, responding to "${input}": This is a simulated response from the ${agent.name} agent with custom LLM configuration. In a real implementation, this would call the specified LLM endpoint.`;
    }

    return NextResponse.json({
      agentId: agent._id,
      agentName: agent.name,
      input,
      response,
      timestamp: new Date().toISOString(),
      runCount: agent.metrics.runs + 1
    });
  } catch (error) {
    console.error('Error running agent:', error);
    return NextResponse.json(
      { error: 'Failed to run agent' },
      { status: 500 }
    );
  }
}