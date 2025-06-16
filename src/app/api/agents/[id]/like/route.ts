import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agent from '@/models/Agent';
import mongoose from 'mongoose';

// POST /api/agents/[id]/like - Like an agent
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { userId, action = 'like' } = body; // action can be 'like' or 'unlike'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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

    // Update like count based on action
    const increment = action === 'like' ? 1 : -1;
    
    const updatedAgent = await Agent.findByIdAndUpdate(
      params.id,
      { $inc: { 'metrics.likes': increment } },
      { new: true }
    ).select('metrics.likes');

    return NextResponse.json({
      agentId: agent._id,
      action,
      likes: updatedAgent?.metrics.likes || 0,
      message: `Agent ${action}d successfully`
    });
  } catch (error) {
    console.error('Error updating agent likes:', error);
    return NextResponse.json(
      { error: 'Failed to update agent likes' },
      { status: 500 }
    );
  }
}