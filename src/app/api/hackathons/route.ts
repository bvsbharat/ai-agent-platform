import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for write operations (bypasses RLS)
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

// GET /api/hackathons - Fetch hackathons with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    
    const location = searchParams.get('location')
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    // For now, we'll return mock data
    // In a real implementation, this would query the database
    const mockHackathons = [
      {
        id: '1',
        title: 'DeployCon: Live Stream',
        description: 'Join us for DeployCon, a virtual conference focused on deployment strategies and best practices.',
        location: 'Online',
        date: '2023-06-21',
        time: '10:30 AM',
        organizer: 'Michael Ortega & Natasha Berman',
        attendees: 279,
        imageUrl: '/hackathon-images/deploycon.jpg',
        eventUrl: 'https://lu.ma/event/evt-IXvl3ztGU9kgKkN',
        isOnline: true
      },
      {
        id: '2',
        title: 'ACCEL R8 | 1412 Hacker Hotel OPEN HOUSE',
        description: 'Join us for an open house at the 1412 Hacker Hotel, where innovation meets community.',
        location: '1412 Market St, San Francisco',
        date: '2023-06-21',
        time: '1:00 PM',
        organizer: 'Pat Santiago & Colin Lowenburg',
        attendees: 109,
        imageUrl: '/hackathon-images/accelr8.jpg',
        eventUrl: 'https://lu.ma/event/evt-KAB1ztGU9kgKkN',
        isOnline: false
      },
      {
        id: '3',
        title: 'Viva Frontier Tower Pop-up Village',
        description: 'Experience the Viva Frontier Tower Pop-up Village, a hub for creativity and innovation.',
        location: 'Frontier Tower, San Francisco',
        date: '2023-06-23',
        time: '6:00 PM',
        organizer: 'Viva City',
        attendees: 482,
        imageUrl: '/hackathon-images/viva.jpg',
        eventUrl: 'https://lu.ma/event/evt-XYZ1ztGU9kgKkN',
        isOnline: false
      },
    ]

    // Filter hackathons based on location
    let filteredHackathons = mockHackathons
    if (location && location !== 'All') {
      if (location === 'Online') {
        filteredHackathons = mockHackathons.filter(h => h.isOnline)
      } else {
        filteredHackathons = mockHackathons.filter(h => 
          h.location.includes(location)
        )
      }
    }

    // Apply pagination
    const paginatedHackathons = filteredHackathons.slice(offset, offset + limit)
    const totalCount = filteredHackathons.length
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      hackathons: paginatedHackathons,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching hackathons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hackathons' },
      { status: 500 }
    )
  }
}