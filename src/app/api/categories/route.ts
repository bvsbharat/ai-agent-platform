import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agent from '@/models/Agent';

// GET /api/categories - Get all available categories with agent counts
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all categories with their agent counts
    const categoryCounts = await Agent.aggregate([
      {
        $match: {
          deploymentStatus: 'published'
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

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
      const categoryData = categoryCounts.find(c => c._id === category);
      return {
        name: category,
        count: categoryData ? categoryData.count : 0
      };
    });

    // Calculate total count
    const totalCount = categoryCounts.reduce((sum, cat) => sum + cat.count, 0);

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