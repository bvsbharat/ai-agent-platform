import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agent from '@/models/Agent';
import type { AgentQuery, AgentSortQuery, AgentData } from '@/types/agent';

// GET /api/agents - Fetch agents with filtering and sorting
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query: AgentQuery = { deploymentStatus: 'published' };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    let sortQuery: AgentSortQuery = {};
    switch (sort) {
      case 'trending':
        sortQuery = { 'metrics.views': -1, 'metrics.runs': -1 };
        break;
      case 'popular':
        sortQuery = { 'metrics.likes': -1 };
        break;
      case 'newest':
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    const agents = await Agent.find(query)
      .sort(sortQuery)
      .limit(limit)
      .skip(skip)
      .select('-customLLMConfig.apiEndpoint') // Hide sensitive data
      .lean();

    const total = await Agent.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      agents,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

// POST /api/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      name,
      description,
      creationMethod,
      category,
      creator,
      prompt,
      customLLMConfig,
      tags,
      deploymentStatus = 'draft'
    } = body;

    // Validation
    if (!name || !description || !creationMethod || !category || !creator) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (creationMethod === 'prompt' && !prompt) {
      return NextResponse.json(
        { error: 'Prompt is required for prompt-based agents' },
        { status: 400 }
      );
    }

    if (creationMethod === 'custom-llm' && !customLLMConfig) {
      return NextResponse.json(
        { error: 'Custom LLM configuration is required for custom LLM agents' },
        { status: 400 }
      );
    }

    const agentData: AgentData = {
      name,
      description,
      creationMethod,
      category,
      creator,
      tags: tags || [],
      deploymentStatus,
      metrics: {
        views: 0,
        runs: 0,
        likes: 0
      }
    };

    if (creationMethod === 'prompt') {
      agentData.prompt = prompt;
    } else {
      agentData.customLLMConfig = customLLMConfig;
    }

    if (deploymentStatus === 'published') {
      agentData.publishedAt = new Date();
    }

    const agent = new Agent(agentData);
    await agent.save();

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}