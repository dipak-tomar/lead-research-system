# AI Lead Research & Outreach Agent

An automated lead generation and outreach system built with LangGraph.js and React. This system scrapes leads from the web, enriches them with additional information, and generates personalized outreach emails.

## Architecture

The project is structured into two main components:

- **Frontend**: React-based UI for user interaction
- **Backend**: Node.js server with LangGraph orchestration and AI agents

## Project Structure

```
├── frontend/           # React application
│   ├── public/
│   ├── src/
│   │   ├── App.js      # Main React component
│   │   └── index.js    # React entry point
│   └── package.json
├── backend/            # Node.js server
│   ├── src/
│   │   ├── agents/     # AI agents
│   │   │   ├── leadScraperAgent.js
│   │   │   ├── enrichmentAgent.js
│   │   │   └── emailGeneratorAgent.js
│   │   ├── orchestrator/
│   │   │   └── mainPipeline.js
│   │   └── index.js    # Express server
│   └── package.json
├── package.json      # Root package.json with scripts
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install frontend and backend dependencies:
   ```bash
   npm run install:all
   ```

4. Set up environment variables:
   Create a `.env` file in the backend directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

### Running the Application

1. Start both frontend and backend:
   ```bash
   npm start
   ```

2. Or start them separately:
   ```bash
   npm run start:backend
   npm run start:frontend
   ```

3. Open your browser to `http://localhost:3000`

## Usage

1. Enter a topic or keyword in the search field
2. Click "Start Research" to begin the automated lead generation process
3. View generated leads and their personalized outreach emails in real-time

## Features

- **Lead Scraping**: Automatically finds potential leads based on search topics
- **Lead Enrichment**: Gathers additional information like emails, company details, and LinkedIn profiles
- **Email Generation**: Creates personalized outreach emails for each lead
- **Real-time Updates**: Uses Server-Sent Events (SSE) for live progress updates
- **Modern UI**: Clean, responsive React interface with Material-UI

## Technologies Used

- **Frontend**: React, Material-UI, Server-Sent Events
- **Backend**: Node.js, Express, LangGraph.js, OpenAI API
- **Web Scraping**: Puppeteer, Cheerio
- **AI/ML**: OpenAI GPT-3.5-turbo

## Development

### Adding New Agents

To add a new agent:
1. Create a new file in `backend/src/agents/`
2. Export a function that processes data according to your needs
3. Add the agent to the pipeline in `backend/src/orchestrator/mainPipeline.js`

### Environment Variables

Required environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Backend server port (default: 3001)

## License

MIT License - see LICENSE file for details.