# 🚀 HackNect - AI-Powered Hackathon Team Matchmaker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.11-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**HackNect** is a comprehensive AI-powered platform that revolutionizes hackathon team formation through intelligent matchmaking. Using advanced machine learning algorithms (vector embeddings and cosine similarity), HackNect connects participants, teams, and mentors with compatible skills, interests, and goals.

### The Problem We Solve

- **Team Formation Chaos**: Finding the right teammates at hackathons is time-consuming and inefficient
- **Skill Mismatches**: Teams often lack critical skills needed for their projects
- **Mentor Scarcity**: Struggling teams can't easily find relevant mentors
- **Talent Discovery**: Startups struggle to find hackathon talent for recruitment

### Our Solution

HackNect provides an end-to-end platform that:
- ✅ Matches users with teams in seconds using AI
- ✅ Identifies skill gaps and recommends team members
- ✅ Detects struggling teams and suggests mentors automatically
- ✅ Connects startups with top hackathon talent (Premium)
- ✅ Manages hackathon discovery and registration
- ✅ Enables real-time team collaboration

## ✨ Key Features

### 🤖 AI-Powered Matchmaking
- **Vector Embeddings**: Convert skills and project requirements into 384-dimensional vectors
- **Cosine Similarity**: Measure semantic similarity between users and teams
- **Multi-Factor Scoring**: 40% skills + 25% experience + 20% interests + 15% availability
- **Explainable AI**: Shows why matches were made
- **Real-Time Updates**: Recalculates matches when profiles or teams change

### 🔔 Two-Way Notification System
- **User → Team**: Request to join, get notified of status
- **Team → User**: Post open roles, notify matching candidates
- **Mentor Matching**: Bidirectional mentor-team connections
- **Event Alerts**: Opt-in notifications for new hackathons
- **Multi-Channel**: Email, in-app, push, WebSocket

### 📊 Skill Gaps Heatmap™
- **Visual Analytics**: Color-coded skill coverage (Green → Red)
- **Gap Identification**: Automatically detects missing critical skills
- **Smart Recommendations**: Suggests users who can fill gaps
- **Team Readiness Score**: Overall project preparedness metric
- **Real-Time Updates**: Refreshes as team composition changes

### 🎯 Mentor Radar™
- **Activity Monitoring**: Analyzes team chat patterns
- **Struggle Detection**: Identifies keywords and low activity
- **Auto-Suggestion**: Recommends relevant mentors automatically
- **Floating Mentors**: Pool of mentors for urgent assistance
- **Intervention Triggers**: Score > 0.6 = mentor alert

### 🌐 Event Discovery
- **Comprehensive Database**: Global, national, university hackathons
- **Smart Filtering**: By domain, date, location, level
- **Registration Management**: Deadline tracking, capacity limits
- **Countdown Timers**: Days/hours to event deadlines
- **Event Profiles**: Prizes, sponsors, organizer details

### 💬 Real-Time Collaboration
- **Team Chat**: Socket.io powered messaging
- **File Sharing**: Images, documents, code snippets
- **Typing Indicators**: Live typing status
- **Emoji Reactions**: React to messages
- **Edit/Delete**: Modify messages within 5 minutes

### 🔄 Reverse Hackathon Mode
- **Project-First**: Post compelling ideas, build teams around them
- **Application System**: Interested users apply with cover letters
- **Team Formation**: Auto-converts to team when capacity reached
- **Skill Matching**: AI suggests best-fit candidates

### 💎 Premium Features (Startup Integration)
- **Talent Discovery**: Browse hackathon participants and teams
- **Advanced Filtering**: By skills, school, graduation year, GitHub activity
- **Job/Internship Posting**: Targeted announcements to matched users
- **Application Management**: Track and review candidate applications
- **Analytics Dashboard**: Engagement metrics and conversion tracking

## 🏗️ System Architecture

HackNect follows a **microservices architecture** for scalability and maintainability:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React 18)                      │
│        TypeScript + Tailwind + shadcn/ui + Socket.io        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              API Gateway (Kong / Express Gateway)            │
│         Authentication • Rate Limiting • Routing             │
└──────────────────────┬──────────────────────────────────────┘
                       │
    ┌──────────────────┼──────────────────┬─────────────┐
    ▼                  ▼                  ▼             ▼
┌──────────┐      ┌──────────┐      ┌──────────┐  ┌──────────┐
│  User    │      │  Team    │      │  Event   │  │ Request  │
│ Service  │      │ Service  │      │ Service  │  │ Service  │
│  :3001   │      │  :3002   │      │  :3004   │  │  :3006   │
└──────────┘      └──────────┘      └──────────┘  └──────────┘

┌──────────┐      ┌──────────┐      ┌──────────┐  ┌──────────┐
│  Match   │      │   Chat   │      │Analytics │  │ Reverse  │
│ Service  │      │ Service  │      │ Service  │  │  Hack    │
│  :3003   │      │  :3007   │      │  :3008   │  │  :3009   │
└──────────┘      └──────────┘      └──────────┘  └──────────┘

              ┌──────────────────┐
              │   Notification   │
              │     Service      │
              │      :3005       │
              └──────────────────┘

    ┌─────────────────┴─────────────────┐
    ▼                                   ▼
┌──────────┐                    ┌──────────────┐
│ RabbitMQ │                    │  Socket.io   │
│  Queue   │                    │  WebSocket   │
└──────────┘                    └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                         │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  PostgreSQL  │   MongoDB    │    Redis     │   Pinecone     │
│   (users,    │   (chat,     │  (cache,     │   (vector      │
│    teams,    │    notifs)   │  sessions)   │  embeddings)   │
│   events)    │              │              │                │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

### Microservices Breakdown

| Service | Port | Tech | Database | Purpose |
|---------|------|------|----------|---------|
| User Service | 3001 | Node.js/Express | PostgreSQL | Profile management, authentication |
| Team Service | 3002 | Node.js/Express | PostgreSQL | Team CRUD, member management |
| Matchmaking Service | 3003 | Python/FastAPI | PostgreSQL + Pinecone | AI matching, recommendations |
| Event Service | 3004 | Node.js/Express | PostgreSQL | Hackathon discovery, registration |
| Notification Service | 3005 | Node.js/Express | MongoDB | Multi-channel alerts |
| Request Service | 3006 | Node.js/Express | PostgreSQL | Join requests, invitations |
| Chat Service | 3007 | Node.js/Socket.io | MongoDB | Real-time messaging |
| Analytics Service | 3008 | Python/FastAPI | PostgreSQL | Heatmap, Mentor Radar |
| Reverse Hack Service | 3009 | Node.js/Express | PostgreSQL | Project postings, applications |

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - UI framework
- **TypeScript 5.0** - Type safety
- **Tailwind CSS 3.3** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Query** - Data fetching
- **Socket.io Client** - WebSocket
- **Axios** - HTTP client

### Backend - Node.js Services
- **Node.js 18 LTS** - Runtime
- **Express.js 4.18** - Web framework
- **Prisma** - ORM
- **TypeScript** - Type safety
- **Winston** - Logging
- **JWT** - Authentication

### Backend - Python Services
- **Python 3.11** - Runtime
- **FastAPI 0.104** - Web framework
- **SQLAlchemy** - ORM
- **sentence-transformers** - Embeddings
- **scikit-learn** - ML utilities
- **OpenAI SDK** - GPT integration
- **Pinecone** - Vector database

### Databases
- **PostgreSQL 15** - Relational data
- **MongoDB 6** - Document storage
- **Redis 7** - Caching
- **Pinecone** - Vector embeddings

### Infrastructure
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **RabbitMQ** - Message queue
- **Firebase** - Auth & storage
- **Kong/Express Gateway** - API gateway

### DevOps
- **GitHub Actions** - CI/CD
- **Prometheus** - Monitoring
- **Grafana** - Dashboards
- **ELK Stack** - Logging
- **Sentry** - Error tracking

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **Python** >= 3.11
- **Docker** >= 24.0
- **Docker Compose** >= 2.20
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/hacknect.git
   cd hacknect
   ```

2. **Install dependencies**
   ```bash
   # Install Node.js dependencies
   npm install
   
   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start infrastructure services**
   ```bash
   docker-compose up -d postgres mongodb redis rabbitmq
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Start all microservices**
   ```bash
   # Development mode with hot reload
   npm run dev:all
   ```

7. **Start frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8080
   - RabbitMQ Management: http://localhost:15672
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3000

### Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild services
docker-compose build
```

## 📁 Project Structure

```
hacknect/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom hooks
│   │   ├── contexts/           # React contexts
│   │   ├── utils/              # Utility functions
│   │   ├── types/              # TypeScript types
│   │   └── App.tsx             # Main app component
│   ├── public/                 # Static assets
│   └── package.json
│
├── services/                    # Microservices
│   ├── user-service/           # User management
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── team-service/           # Team management
│   ├── matchmaking-service/    # AI matching (Python)
│   │   ├── app/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   ├── event-service/          # Hackathon events
│   ├── notification-service/   # Notifications
│   ├── request-service/        # Join requests
│   ├── chat-service/           # Real-time chat
│   ├── analytics-service/      # Analytics (Python)
│   └── reverse-service/        # Reverse hackathon
│
├── gateway/                     # API Gateway configuration
│   ├── kong.yml
│   └── routes.js
│
├── k8s/                         # Kubernetes manifests
│   ├── deployments/
│   ├── services/
│   └── ingress/
│
├── migrations/                  # Database migrations
│   └── sql/
│
├── scripts/                     # Utility scripts
│   ├── seed-db.js
│   └── setup-dev.sh
│
├── docs/                        # Documentation
│   ├── api/                    # API documentation
│   ├── architecture/           # Architecture diagrams
│   └── guides/                 # User guides
│
├── docker-compose.yml           # Docker Compose config
├── .env.example                 # Environment template
├── README.md                    # This file
└── package.json                 # Root package.json
```

## 📚 API Documentation

API documentation is available via Swagger UI:
- Development: http://localhost:8080/docs
- Production: https://api.hacknect.com/docs

### Key Endpoints

#### User Service
```
POST   /api/users/register          # Create user profile
GET    /api/users/:id               # Get user profile
PUT    /api/users/:id               # Update profile
POST   /api/users/:id/skills        # Add skills
GET    /api/users/search            # Search users
```

#### Team Service
```
POST   /api/teams                   # Create team
GET    /api/teams/:id               # Get team details
POST   /api/teams/:id/members       # Add member
GET    /api/teams/search            # Search teams
```

#### Matchmaking Service
```
POST   /api/match/user-to-teams     # Find teams for user
POST   /api/match/team-to-users     # Find users for team
GET    /api/match/recommendations/:userId
```

#### Event Service
```
GET    /api/events                  # List all events
GET    /api/events/:id              # Get event details
POST   /api/events/:id/register     # Register for event
```

For complete API documentation, see [API Reference](docs/api/README.md).

## 💻 Development Guide

### Running Individual Services

```bash
# User Service
cd services/user-service
npm run dev

# Matchmaking Service (Python)
cd services/matchmaking-service
uvicorn app.main:app --reload --port 3003
```

### Database Migrations

```bash
# Create new migration
npm run migrate:create <migration-name>

# Run migrations
npm run migrate:up

# Rollback migration
npm run migrate:down
```

### Adding a New Microservice

1. Create service directory in `services/`
2. Set up Dockerfile and package.json
3. Implement service logic
4. Add to docker-compose.yml
5. Configure routes in API Gateway
6. Add database schema if needed
7. Write tests
8. Update documentation

### Code Style

- **Frontend**: ESLint + Prettier (Airbnb config)
- **Backend (Node.js)**: ESLint + Prettier
- **Backend (Python)**: Black + Flake8

```bash
# Lint and format
npm run lint
npm run format

# Python
black .
flake8 .
```

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
npm test

# Run with coverage
npm run test:coverage

# Python tests
pytest --cov=app tests/
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration
```

### E2E Tests

```bash
# Run E2E tests (Cypress)
npm run test:e2e

# Open Cypress UI
npm run cypress:open
```

### Test Coverage Goals
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical flows
- **E2E Tests**: User journeys

## 🚢 Deployment

### Development
```bash
docker-compose up -d
```

### Production (Kubernetes)

1. **Build and push images**
   ```bash
   ./scripts/build-and-push.sh
   ```

2. **Deploy to Kubernetes**
   ```bash
   kubectl apply -f k8s/
   ```

3. **Check deployment status**
   ```bash
   kubectl get pods -n hacknect
   kubectl get services -n hacknect
   ```

### Environment Variables

Required environment variables for production:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/hacknect
MONGODB_URI=mongodb://host:27017/hacknect
REDIS_URL=redis://host:6379

# Firebase
FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=...

# AI Services
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...

# Email
SENDGRID_API_KEY=SG...

# Payment (Premium)
STRIPE_SECRET_KEY=sk_live_...
```

See [.env.example](.env.example) for complete list.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new matching algorithm
fix: resolve chat message duplication
docs: update API documentation
test: add unit tests for user service
refactor: improve database query performance
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Technical Lead**: [Name]
- **Frontend Lead**: [Name]
- **Backend Lead**: [Name]
- **AI/ML Lead**: [Name]
- **DevOps Lead**: [Name]

## 📞 Support

- **Documentation**: https://docs.hacknect.com
- **Issues**: https://github.com/your-org/hacknect/issues
- **Email**: support@hacknect.com
- **Discord**: https://discord.gg/hacknect

## 🗺️ Roadmap

### Phase 1 (Current - MVP)
- ✅ Core matchmaking algorithm
- ✅ Basic team formation
- ✅ Event discovery
- ✅ Real-time chat

### Phase 2 (Q2 2026)
- 🔲 Mobile app (React Native)
- 🔲 Advanced analytics dashboard
- 🔲 Mentor marketplace
- 🔲 Premium tier launch

### Phase 3 (Q3 2026)
- 🔲 GitHub integration
- 🔲 Video conferencing
- 🔲 Project showcase
- 🔲 Team templates

### Phase 4 (Q4 2026)
- 🔲 AI code assistance
- 🔲 Automated judging support
- 🔲 Hackathon organizer tools
- 🔲 Corporate partnerships

## 🙏 Acknowledgments

- OpenAI for GPT and embedding APIs
- Firebase for authentication infrastructure
- Pinecone for vector database
- The open-source community

---

**Built with ❤️ for the hackathon community**

*HackNect - Where Great Teams Form*
