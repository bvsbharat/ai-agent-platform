# Migration Guide: MongoDB to Supabase

This guide outlines the migration from MongoDB to Supabase for the AI Agent Platform.

## What Changed

### 🗄️ Database Migration
- **From**: MongoDB with Mongoose ODM
- **To**: Supabase (PostgreSQL) with direct SQL queries
- **Benefits**: 
  - Built-in authentication
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Auto-generated APIs
  - Better TypeScript support

### 🔐 Authentication Migration
- **From**: Custom JWT implementation with bcrypt
- **To**: Supabase Auth with built-in security
- **Benefits**:
  - Email verification
  - Password reset
  - Social login support
  - Session management

### 📁 Files Removed
- `src/lib/mongodb.ts` - MongoDB connection
- `src/models/Agent.ts` - Mongoose Agent model
- `src/models/User.ts` - Mongoose User model
- `src/models/MCP.ts` - Mongoose MCP model

### 📁 Files Added/Updated
- `src/lib/supabase.ts` - Supabase client configuration
- `src/contexts/AuthContext.tsx` - Updated to use Supabase Auth
- `src/app/api/auth/route.ts` - Updated to use Supabase Auth
- `src/app/api/agents/route.ts` - Updated to use Supabase
- `src/app/api/rules/route.ts` - New API route for rules
- `src/app/api/mcps/route.ts` - Updated to use Supabase
- `supabase-schema.sql` - Database schema for Supabase
- `.env.local` - Updated environment variables

## Setup Instructions

### 1. Environment Variables
Update your `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create all tables, indexes, and policies

### 3. Install Dependencies
The migration has already updated the dependencies:

```bash
# Dependencies added
npm install @supabase/supabase-js @supabase/ssr

# Dependencies removed
# mongoose bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken @types/mongoose
```

### 4. Database Schema Overview

#### Tables Created:
- **user_profiles**: Extended user information (linked to auth.users)
- **agents**: AI agents with configuration and metadata
- **rules**: Rules and guidelines with voting system
- **mcps**: MCP (Model Context Protocol) data
- **agent_likes**: User likes for agents
- **rule_votes**: User votes for rules

#### Key Features:
- **Row Level Security (RLS)**: Automatic data access control
- **Automatic Triggers**: Auto-update timestamps and user profiles
- **Indexes**: Optimized for common queries
- **Foreign Keys**: Data integrity and relationships

### 5. Authentication Flow

#### Before (MongoDB + JWT):
1. User registers → Hash password → Store in MongoDB
2. User logs in → Verify password → Generate JWT
3. Protected routes → Verify JWT → Allow access

#### After (Supabase Auth):
1. User registers → Supabase handles hashing and storage
2. User logs in → Supabase verifies and creates session
3. Protected routes → Supabase verifies session → Allow access

### 6. API Changes

#### Authentication (`/api/auth`)
- **Before**: Custom email/password with JWT
- **After**: Supabase Auth with session management
- **New Features**: Email verification, password reset

#### Agents (`/api/agents`)
- **Before**: MongoDB queries with Mongoose
- **After**: Supabase queries with TypeScript types
- **Improvements**: Better filtering, sorting, and pagination

#### Rules (`/api/rules`)
- **New**: Complete API for rules management
- **Features**: CRUD operations, voting system, categorization

#### MCPs (`/api/mcps`)
- **Before**: Direct MongoDB operations
- **After**: Supabase operations with better error handling
- **Improvements**: Batch processing, conflict resolution

## Migration Benefits

### 🚀 Performance
- PostgreSQL is faster for complex queries
- Built-in connection pooling
- Optimized indexes

### 🔒 Security
- Row Level Security (RLS) policies
- Built-in authentication security
- SQL injection protection

### 🛠️ Developer Experience
- Auto-generated TypeScript types
- Real-time subscriptions
- Built-in API documentation
- Better error handling

### 📈 Scalability
- Horizontal scaling support
- Built-in CDN for static assets
- Edge functions support

## Testing the Migration

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test Authentication
- Register a new user
- Verify email (check Supabase Auth logs)
- Log in with credentials
- Test logout functionality

### 3. Test Data Operations
- Create new agents
- Create new rules
- Test filtering and sorting
- Test pagination

### 4. Test MCP Sync
- Use the MCP sync API with external Supabase credentials
- Verify data is properly imported

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Ensure all Supabase environment variables are correctly set
   - Restart the development server after changes

2. **Database Schema Not Applied**
   - Run the SQL schema in Supabase SQL Editor
   - Check for any SQL errors in the logs

3. **Authentication Issues**
   - Verify Supabase project URL and keys
   - Check RLS policies are properly set

4. **API Errors**
   - Check Supabase logs for detailed error messages
   - Verify table names and column names match the schema

### Getting Help

- Check Supabase documentation: https://supabase.com/docs
- Review Supabase logs in the dashboard
- Test API endpoints using the Supabase API documentation

## Next Steps

1. **Data Migration**: If you have existing MongoDB data, create migration scripts
2. **Real-time Features**: Implement real-time updates using Supabase subscriptions
3. **Advanced Auth**: Add social login providers
4. **Edge Functions**: Move complex logic to Supabase Edge Functions
5. **Storage**: Use Supabase Storage for file uploads

The migration is now complete! Your AI Agent Platform is running on Supabase with improved performance, security, and developer experience.