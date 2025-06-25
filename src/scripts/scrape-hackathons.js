#!/usr/bin/env node

/**
 * Script to scrape hackathons from Devpost and save them to Supabase
 * 
 * Usage: 
 * 1. Make sure you have the SUPABASE_SERVICE_ROLE_KEY environment variable set
 * 2. Run: node src/scripts/scrape-hackathons.js
 */

const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

// Create Supabase admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function scrapeDevpost() {
  console.log('Starting Devpost hackathon scraping...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to Devpost hackathons page
    await page.goto('https://devpost.com/hackathons', {
      waitUntil: 'networkidle2',
    });
    
    console.log('Page loaded, scraping hackathons...');
    
    // Extract hackathon data
    const hackathons = await page.evaluate(() => {
      const hackathonCards = Array.from(document.querySelectorAll('.challenge-listing'));
      
      return hackathonCards.map(card => {
        // Get title and URL
        const titleElement = card.querySelector('.challenge-title a');
        const title = titleElement?.textContent?.trim() || 'Unknown Hackathon';
        const eventUrl = titleElement?.getAttribute('href') || '';
        
        // Get image
        const imageElement = card.querySelector('.challenge-logo img');
        const imageUrl = imageElement?.getAttribute('src') || null;
        
        // Get description
        const description = card.querySelector('.challenge-description')?.textContent?.trim() || 'No description available';
        
        // Get location (online or in-person)
        const locationElement = card.querySelector('.challenge-location');
        const locationText = locationElement?.textContent?.trim() || 'Unknown';
        const isOnline = locationText.toLowerCase().includes('online');
        
        // Get date information
        const dateElement = card.querySelector('.challenge-time-left');
        const dateText = dateElement?.textContent?.trim() || '';
        
        // Parse date information
        let date = new Date().toISOString().split('T')[0]; // Default to today
        let time = '12:00 PM'; // Default time
        
        if (dateText.includes('Ends')) {
          // Extract end date if available
          const endDateMatch = dateText.match(/Ends (\w+ \d+)/i);
          if (endDateMatch && endDateMatch[1]) {
            const endDateStr = `${endDateMatch[1]}, ${new Date().getFullYear()}`;
            const endDate = new Date(endDateStr);
            date = endDate.toISOString().split('T')[0];
          }
        }
        
        // Get organizer
        const organizerElement = card.querySelector('.challenge-organizer');
        const organizer = organizerElement?.textContent?.trim() || 'Unknown Organizer';
        
        // Estimate attendees (random number for now since it's not directly available)
        const attendees = Math.floor(Math.random() * 500) + 50;
        
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
        };
      });
    });
    
    console.log(`Scraped ${hackathons.length} hackathons`);
    return hackathons;
  } catch (error) {
    console.error('Error scraping Devpost:', error);
    return [];
  } finally {
    await browser.close();
  }
}

async function saveHackathonsToDatabase(hackathons) {
  console.log('Saving hackathons to database...');
  
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
      );
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully saved ${hackathons.length} hackathons to database`);
    return data;
  } catch (error) {
    console.error('Error saving hackathons to database:', error);
    return null;
  }
}

// Main function
async function main() {
  try {
    const hackathons = await scrapeDevpost();
    
    if (hackathons.length === 0) {
      console.log('No hackathons found to save');
      process.exit(0);
    }
    
    await saveHackathonsToDatabase(hackathons);
    console.log('Script completed successfully');
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

// Run the script
main();