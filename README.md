# TrueAgents AI Platform

A Next.js application for discovering, creating, and managing AI agents with MCP (Model Context Protocol) server integration.

## Features

- **Agent Discovery**: Browse and search through AI agents
- **MCP Integration**: Sync and manage Model Context Protocol servers
- **Rules Management**: Create and share coding rules and best practices
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Supabase Integration**: Data persistence for agents, MCPs, and rules

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase project
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bvsbharat/TrueAgents_V2.git
cd TrueAgents_V2/ai-agent-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scraping Hackathons

To populate the hackathon data from Devpost:

1. Make sure you have the `SUPABASE_SERVICE_ROLE_KEY` environment variable set in your `.env.local` file:

```
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

2. Run the scraper script:

```bash
npm run scrape-hackathons
```

Alternatively, you can trigger the scraping process via the API endpoint (requires admin authentication):

```bash
curl -X POST http://localhost:3000/api/hackathons
```

## Testing Results

### ✅ Working Features

1. **Home Page**
   - ✅ Main navigation works correctly
   - ✅ Search functionality displays relevant AI agents
   - ✅ Agent cards display properly with descriptions and tags
   - ✅ Responsive design works on different screen sizes

2. **MCP Servers Page (/mcps)**
   - ✅ Successfully syncs MCPs from directory
   - ✅ Displays comprehensive list of MCP servers (31 pages)
   - ✅ Search functionality works (tested with "github")
   - ✅ Pagination controls work correctly
   - ✅ Filter buttons (Latest, Popular, all_categories) are present
   - ✅ Each MCP shows description, tags, and GitHub links

3. **Rules Page (/rules)**
   - ✅ Displays coding rules and best practices
   - ✅ Category filtering works (TypeScript, Python, Next.js, etc.)
   - ✅ Search functionality for rules
   - ✅ Proper categorization and tagging
   - ✅ Shows engagement metrics (likes, views)

4. **Database Integration**
   - ✅ Supabase connection working
   - ✅ MCP data persistence
   - ✅ Bulk upsert operations for avoiding duplicates

5. **API Endpoints**
   - ✅ `/api/mcps` - Successfully fetches and stores MCP data
   - ✅ `/api/hackathons` - Fetches hackathon data from Supabase
   - ✅ `/api/hackathons` (POST) - Triggers scraping of hackathons from Devpost
   - ✅ Proper error handling and validation

6. **Hackathon Feature**
   - ✅ Displays hackathons from Devpost
   - ✅ Filters for online and in-person events
   - ✅ Automatic scraping of hackathon data
   - ✅ Pagination for browsing multiple hackathons
   - ✅ Categorization by upcoming and past events

### ❌ Issues Found

1. **Trending Page (404 Error)**
   - **Issue**: Navigation link exists but page returns 404
   - **URL**: `/trending`
   - **Status**: Not implemented
   - **Priority**: Medium

2. **Non-functional Buttons**
   - **Issue**: Several buttons don't have click handlers implemented:
     - "Create Your First Agent" button
     - "Create Agent" button
     - Agent action buttons ("try", "install")
   - **Impact**: Users cannot create or interact with agents
   - **Priority**: High

3. **Missing Agent Creation Flow**
   - **Issue**: No agent creation interface or workflow
   - **Expected**: Form or wizard for creating new agents
   - **Status**: Not implemented
   - **Priority**: High

### 🔧 Technical Improvements Made

1. **Fixed MCP Validation Error**
   - Made `company_id` field optional in MCP schema
   - Resolved validation failures during sync

2. **Fixed Duplicate Key Error**
   - Implemented `bulkWrite` with `upsert: true`
   - Removed unique index constraint on `id` field
   - Prevents errors when syncing existing MCPs

3. **Server Restart Handling**
   - Ensured model changes are applied after server restart
   - Proper cache invalidation

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── mcps/
│   │       └── route.ts          # MCP API endpoints
│   ├── mcps/
│   │   └── page.tsx              # MCP servers page
│   ├── rules/
│   │   └── page.tsx              # Rules page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── CreateRuleModal.tsx       # Rule creation modal
│   └── ui/                       # Reusable UI components
├── contexts/
│   └── SearchContext.tsx         # Search state management
├── lib/
│   └── supabase.ts               # Database connection
├── models/
│   └── MCP.ts                    # MCP data model
└── types/
    ├── agent.ts                  # Agent type definitions
    └── search.ts                 # Search type definitions
```

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please create an issue in the GitHub repository.
