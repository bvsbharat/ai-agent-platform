# AI Agent Platform

A comprehensive Next.js platform for creating, managing, and deploying AI agents with support for both prompt-based and custom LLM configurations.

## Features

- **Agent Creation**: Create AI agents using either simple prompts or custom LLM configurations
- **Agent Management**: Browse, search, and filter agents by category and tags
- **User Authentication**: Secure login system with JWT tokens
- **Agent Analytics**: Track views, runs, and likes for each agent
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Database Integration**: MongoDB with Mongoose for data persistence

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Icons**: Lucide React
- **UI Components**: Headless UI

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bvsbharat/ai-agent-platform-v2.git
cd ai-agent-platform-v2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   │   ├── agents/     # Agent CRUD operations
│   │   ├── auth/       # Authentication endpoints
│   │   ├── categories/ # Category management
│   │   └── search/     # Search functionality
│   ├── login/          # Login page
│   └── page.tsx        # Home page
├── components/         # Reusable React components
│   ├── AgentCard.tsx
│   ├── CategoryFilter.tsx
│   ├── CreateAgentModal.tsx
│   └── Header.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── lib/                # Utility libraries
│   └── mongodb.ts
├── models/             # Mongoose models
│   ├── Agent.ts
│   └── User.ts
└── types/              # TypeScript type definitions
    ├── agent.ts
    └── search.ts
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Agents
- `GET /api/agents` - Get all agents with filtering and sorting
- `POST /api/agents` - Create a new agent
- `GET /api/agents/[id]` - Get agent by ID
- `PUT /api/agents/[id]` - Update agent
- `DELETE /api/agents/[id]` - Delete agent
- `POST /api/agents/[id]/run` - Execute agent

### Categories
- `GET /api/categories` - Get all available categories

### Search
- `GET /api/search` - Search agents by query

## Agent Types

### Prompt-based Agents
Simple agents created with a text prompt that defines their behavior.

### Custom LLM Agents
Advanced agents with custom configurations including:
- Model selection
- Temperature settings
- Max tokens
- System prompts
- Custom API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Test Results

*Test results will be documented here after testing phase*

## Deployment

This application can be deployed on various platforms including Vercel, Netlify, or any Node.js hosting service.

### Environment Variables for Production

Ensure the following environment variables are set:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `NODE_ENV`: Set to 'production'
