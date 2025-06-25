import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET /api/categories - Get all available categories with agent counts
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    // Get all categories with their agent counts
    const { data: agents, error } = await supabase
      .from('agents')
      .select('category')
      .eq('is_public', true)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    // Count agents by category
    const categoryCounts = agents?.reduce((acc: Record<string, number>, agent: { category: string }) => {
      const category = agent.category
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Define all available categories
    const allCategories = [
      'Assistant',
      'Automation',
      'Analytics',
      'Content',
      'Customer Service',
      'Development',
      'Education',
      'Finance',
      'Healthcare',
      'Marketing',
      'Other'
    ];

    // Create category objects with counts
    const categories = allCategories.map(category => {
      return {
        name: category,
        count: categoryCounts[category] || 0
      }
    })

    // Calculate total count
    const totalCount = Object.values(categoryCounts).reduce((sum: number, count: number) => sum + count, 0)

    // Add "All" category at the beginning
    const categoriesWithAll = [
      {
        name: 'All',
        count: totalCount
      },
      ...categories
    ];

    return NextResponse.json({
      categories: categoriesWithAll,
      total: totalCount
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}