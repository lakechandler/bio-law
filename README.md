# Biology Laws Hub

A web platform that aggregates scientific research to create a repository of "Biology Laws" - evidence-based biological principles accessible to health-conscious consumers.

## Project Overview

Biology Laws Hub bridges the gap between complex scientific research and practical consumer knowledge by transforming academic publications into clear, actionable biological principles. The platform automatically updates its knowledge base when new scientific findings emerge, ensuring users always have access to the most current biological understanding.

### Key Features

- **Automatic Research Aggregation**: Fetches papers from PubMed, Springer, and Nature
- **NLP Processing**: Extracts key biological principles from scientific papers
- **Biology Laws**: Presents evidence-based principles with confidence scores
- **User Personalization**: Save favorite laws and receive updates on topics of interest
- **Search & Discovery**: Find laws by topic, keyword, or confidence level

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Encore.ts, Node.js, TypeScript
- **Database**: PostgreSQL
- **Services**: 
  - Data Ingestion Service
  - NLP Processing Service
  - Law Extraction Service
  - User Service
  - Notification Service

## Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL database
- Encore CLI (`curl -L https://encore.dev/install.sh | bash`)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/biology-laws-hub.git
   cd biology-laws-hub
   ```

2. Set up the backend:
   ```bash
   cd backend
   chmod +x setup.sh
   ./setup.sh
   ```

3. Update API keys in the generated `.env` file:
   ```
   PUBMED_API_KEY=your_pubmed_api_key
   SPRINGER_API_KEY=your_springer_api_key
   NATURE_API_KEY=your_nature_api_key
   ```

4. Start the backend development server:
   ```bash
   encore run
   ```

### Frontend Setup

1. Set up the frontend:
   ```bash
   cd frontend
   chmod +x setup.sh
   ./setup.sh
   ```

2. Update the `.env.local` file if needed.

3. Generate API client types from Encore:
   ```bash
   cd ../backend
   encore gen client typescript --output-dir=../frontend/src/lib/api
   ```

4. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
.
├── backend/                  # Encore.ts Backend 
│   ├── data-ingestion/       # Paper fetching from scientific sources
│   ├── nlp-processing/       # Natural language processing of papers
│   ├── law-extraction/       # Extracting and managing biology laws
│   ├── user/                 # User management and authentication
│   └── notification/         # User notification system
│
└── frontend/                 # Next.js Frontend
    ├── src/
    │   ├── app/              # Next.js app router pages
    │   ├── components/       # Reusable React components
    │   ├── lib/              # Utility functions and API clients
    │   └── types/            # TypeScript type definitions
    └── public/               # Static assets
```

## Development Workflow

1. **Data Ingestion**: Papers are fetched on a schedule or via manual trigger
2. **NLP Processing**: Papers are processed to extract biological entities and relationships
3. **Law Extraction**: Biology laws are generated with confidence scores
4. **Frontend Display**: Laws are presented to users with search and filtering

## Obtaining API Keys

- **PubMed E-utilities**: Register at [NCBI](https://www.ncbi.nlm.nih.gov/account/)
- **Springer Nature API**: Register at [Springer Developer Portal](https://dev.springernature.com/)
- **Nature API**: Contact Nature directly for academic/non-profit access

## Deployment

### Backend Deployment

```bash
cd backend
encore app link --ownership=personal # Link to a new Encore app
encore deploy --production            # Deploy to production
```

### Frontend Deployment

```bash
cd frontend
npm run build                         # Build production assets
# Deploy to Vercel or your preferred hosting
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 