import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase'
// import { supabaseAdmin } from '@/lib/supabase-admin'
import puppeteer from 'puppeteer'

// Interface for scraped hackathon data
interface HackathonData {
  title: string
  description: string
  location: string
  date: string
  time: string
  organizer: string
  attendees: number
  image_url: string | null
  event_url: string
  is_online: boolean
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use service role key for write operations (bypasses RLS)
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

// GET /api/hackathons - Fetch hackathons with filtering and pagination
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(_request.url)
    
    const location = searchParams.get('location')
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    // Build the query
    let query = supabase
      .from('hackathons')
      .select('*', { count: 'exact' })

    // Apply filters
    if (location && location !== 'All') {
      if (location === 'Online') {
        query = query.eq('is_online', true)
      } else {
        query = query.ilike('location', `%${location}%`)
      }
    }

    // Apply pagination
    const { data: hackathons, count, error } = await query
      .order('date', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    // Transform data to match the expected format in the frontend
    const transformedHackathons = hackathons.map(h => ({
      id: h.id,
      title: h.title,
      description: h.description,
      location: h.location,
      date: h.date,
      time: h.time,
      organizer: h.organizer,
      attendees: h.attendees,
      imageUrl: h.image_url,
      eventUrl: h.event_url,
      isOnline: h.is_online
    }))

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      hackathons: transformedHackathons,
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

// POST /api/hackathons/scrape - Scrape hackathons from Devpost
export async function POST(request: NextRequest) {
  try {
    // Check for admin authorization
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get user profile to check if admin
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', user.id)
      .single()
    
    // Only allow admins to trigger scraping
    if (!userProfile?.email.includes('@trueagents.ai')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    // Start scraping process
    const hackathons = await scrapeDevpost()
    
    if (hackathons.length === 0) {
      return NextResponse.json(
        { message: 'No hackathons found to save' },
        { status: 200 }
      )
    }
    
    // Save hackathons to database
    await saveHackathonsToDatabase(hackathons)
    
    return NextResponse.json({
      message: `Successfully scraped and saved ${hackathons.length} hackathons`,
      count: hackathons.length
    })
  } catch (error) {
    console.error('Error scraping hackathons:', error)
    return NextResponse.json(
      { error: 'Failed to scrape hackathons' },
      { status: 500 }
    )
  }
}

async function scrapeDevpost() {
  console.log('Starting Devpost hackathon scraping...')
  
  const browser = await puppeteer.launch({
    headless: true,
  })
  
  try {
    const page = await browser.newPage()
    
    // Navigate to Devpost hackathons page
    await page.goto('https://devpost.com/hackathons', {
      waitUntil: 'networkidle2',
    })
    
    console.log('Page loaded, scraping hackathons...')
    
    // Extract hackathon data
    const hackathons = await page.evaluate(() => {
      const hackathonCards = Array.from(document.querySelectorAll('.challenge-listing'))
      
      return hackathonCards.map(card => {
        // Get title and URL
        const titleElement = card.querySelector('.challenge-title a')
        const title = titleElement?.textContent?.trim() || 'Unknown Hackathon'
        const eventUrl = titleElement?.getAttribute('href') || ''
        
        // Get image
        const imageElement = card.querySelector('.challenge-logo img')
        const imageUrl = imageElement?.getAttribute('src') || null
        
        // Get description
        const description = card.querySelector('.challenge-description')?.textContent?.trim() || 'No description available'
        
        // Get location (online or in-person)
        const locationElement = card.querySelector('.challenge-location')
        const locationText = locationElement?.textContent?.trim() || 'Unknown'
        const isOnline = locationText.toLowerCase().includes('online')
        
        // Get date information
        const dateElement = card.querySelector('.challenge-time-left')
        const dateText = dateElement?.textContent?.trim() || ''
        
        // Parse date information
        let date = new Date().toISOString().split('T')[0] // Default to today
        const time = '12:00 PM' // Default time
        
        if (dateText.includes('Ends')) {
          // Extract end date if available
          const endDateMatch = dateText.match(/Ends (\w+ \d+)/i)
          if (endDateMatch && endDateMatch[1]) {
            const endDateStr = `${endDateMatch[1]}, ${new Date().getFullYear()}`
            const endDate = new Date(endDateStr)
            date = endDate.toISOString().split('T')[0]
          }
        }
        
        // Get organizer
        const organizerElement = card.querySelector('.challenge-organizer')
        const organizer = organizerElement?.textContent?.trim() || 'Unknown Organizer'
        
        // Estimate attendees (random number for now since it's not directly available)
        const attendees = Math.floor(Math.random() * 500) + 50
        
        return {
          title,
          description,
          location: isOnline ? 'Online' : locationText,
          date,
          time,
          organizer,
          attendees,
          image_url: imageUrl,
          event_url: eventUrl,
          is_online: isOnline
        }
      })
    })
    
    console.log(`Scraped ${hackathons.length} hackathons`)
    return hackathons
  } catch (error) {
    console.error('Error scraping Devpost:', error)
    return []
  } finally {
    await browser.close()
  }
}

async function saveHackathonsToDatabase(hackathons: HackathonData[]) {
  console.log('Saving hackathons to database...')
  
  try {
    // Insert new hackathons
    const { data, error } = await supabaseAdmin
      .from('hackathons')
      .upsert(
        hackathons.map(hackathon => ({
          ...hackathon,
          // Use event_url as a unique identifier for upsert
          id: undefined // Let Supabase generate IDs for new entries
        })),
        { onConflict: 'event_url' } // Upsert based on event_url
      )
    
    if (error) {
      throw error
    }
    
    console.log(`Successfully saved ${hackathons.length} hackathons to database`)
    return data
  } catch (error) {
    console.error('Error saving hackathons to database:', error)
    return null
  }
}