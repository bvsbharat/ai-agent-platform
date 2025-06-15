import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agent from '@/models/Agent';
import mongoose from 'mongoose';

// GET /api/agents/[id] - Get a specific agent
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    const agent = await Agent.findById(params.id)
      .select('-customLLMConfig.apiEndpoint') // Hide sensitive data
      .lean();

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await Agent.findByIdAndUpdate(params.id, {
      $inc: { 'metrics.views': 1 }
    });

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

// PUT /api/agents/[id] - Update a specific agent
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData = { ...body };

    // If publishing for the first time, set publishedAt
    if (updateData.deploymentStatus === 'published') {
      const currentAgent = await Agent.findById(params.id);
      if (currentAgent && !currentAgent.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const agent = await Agent.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-customLLMConfig.apiEndpoint');

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/[id] - Delete a specific agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    const agent = await Agent.findByIdAndDelete(params.id);

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}