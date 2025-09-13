# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

This is the HTN2025 repository containing **PhotoMind** - an intelligent photo management application that serves as a replacement for Google Photos. PhotoMind uses AI-powered image analysis and natural language search to organize and retrieve photos.

### Project Structure
```
HTN2025/
├── frontend/              # React + TypeScript frontend application
│   ├── src/              # React components and application logic
│   ├── public/           # Static assets and HTML template
│   └── package.json      # Frontend dependencies and scripts
├── backend/              # Flask Python backend API
│   ├── app.py           # Main Flask application with API endpoints
│   ├── services/        # Business logic services
│   │   ├── image_processor.py  # Omniparser & Claude integration
│   │   └── database.py         # DynamoDB operations
│   ├── config.py        # Environment-based configuration
│   └── requirements.txt # Python dependencies
├── frontend.md          # Frontend documentation
├── backend.md           # Backend documentation
└── WARP.md             # This file
```

## PhotoMind Setup Commands

### Frontend Setup (React + TypeScript)
```bash
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

### Backend Setup (Flask + Python)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env  # Configure your API keys
python app.py  # Runs on http://localhost:5000
```

### Full Development Setup
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```

## Project Setup Commands

Since this is a new repository, the initial setup will depend on the technology stack chosen. Here are common initialization patterns:

### Node.js/JavaScript Project
```bash
npm init -y
npm install # after adding dependencies
npm run dev # typically for development server
npm run build # for production build
npm test # for running tests
```

### Python Project
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Unix/macOS:
source venv/bin/activate
pip install -r requirements.txt
python -m pytest # for running tests
```

### Java/Spring Boot Project
```bash
./mvnw spring-boot:run # for Maven-based projects
./gradlew bootRun # for Gradle-based projects
./mvnw test # for running tests
./gradlew test # for Gradle tests
```

### Go Project
```bash
go mod init github.com/username/HTN2025 # initialize Go module
go run main.go # run the application
go build # build the application
go test ./... # run all tests
```

## Development Workflow

### Git Commands
```bash
git status # check current status
git add . # stage all changes
git commit -m "descriptive message" # commit changes
git push origin main # push to remote
git pull origin main # pull latest changes
```

### Branch Management
```bash
git checkout -b feature/feature-name # create and switch to new branch
git checkout main # switch back to main
git merge feature/feature-name # merge feature branch
git branch -d feature/feature-name # delete merged branch
```

## Architecture Guidelines

### Recommended Project Structure

For web applications:
```
HTN2025/
├── frontend/          # Frontend application code
├── backend/           # Backend API/server code
├── shared/            # Shared utilities or types
├── docs/              # Project documentation
├── scripts/           # Build and deployment scripts
└── tests/             # Test files and test utilities
```

For single-application projects:
```
HTN2025/
├── src/               # Source code
├── tests/             # Test files
├── docs/              # Documentation
├── config/            # Configuration files
└── scripts/           # Utility scripts
```

### Key Principles

- **Modular Architecture**: Organize code into logical modules/components
- **Separation of Concerns**: Keep business logic, data access, and presentation layers separate
- **Environment Configuration**: Use environment variables for configuration that differs between development and production
- **Error Handling**: Implement comprehensive error handling and logging
- **API Design**: Follow RESTful principles for APIs, use consistent response formats
- **Database**: Use migrations for schema changes, implement proper indexing

## Testing Strategy

### Test Types
- **Unit Tests**: Test individual functions/methods
- **Integration Tests**: Test component interactions
- **End-to-End Tests**: Test complete user workflows
- **API Tests**: Test API endpoints and responses

### Running Single Tests
The exact command will depend on the testing framework chosen:
```bash
# Jest (Node.js)
npm test -- --testNamePattern="specific test name"

# pytest (Python)
python -m pytest tests/test_specific.py::test_function_name

# Go
go test -run TestSpecificFunction

# JUnit (Java)
./mvnw test -Dtest=SpecificTestClass#specificTestMethod
```

## Hackathon-Specific Considerations

### Time Management
- Focus on MVP (Minimum Viable Product) first
- Use established libraries and frameworks rather than building from scratch
- Implement core features before polish

### Technology Choices
- Choose familiar technologies to move quickly
- Consider rapid prototyping tools and services
- Use cloud services for quick deployment (Vercel, Netlify, Railway, etc.)

### Documentation
- Keep a running log of major decisions and their rationales
- Document API endpoints as you build them
- Include setup instructions for team members

## Environment Setup

### Required Tools
The specific tools will depend on the chosen stack, but commonly needed:
- Git for version control
- Code editor (VS Code, IntelliJ, etc.)
- Package manager (npm, pip, maven, etc.)
- Docker (if using containers)

### Environment Variables
Create a `.env.example` file with required environment variables:
```bash
# Database
DATABASE_URL=your_database_url_here

# API Keys
API_KEY=your_api_key_here

# Application Settings
NODE_ENV=development
PORT=3000
```

## Deployment

### Quick Deployment Options
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Railway, Heroku, Digital Ocean Apps
- **Full-stack**: Vercel (with serverless functions), Netlify Functions
- **Containerized**: Docker + Railway, Google Cloud Run

### Pre-deployment Checklist
- Ensure all tests pass
- Check that environment variables are properly configured
- Verify that the application works with production data
- Test the deployed application thoroughly

## Project Initialization

When starting development, consider:
1. Choose your tech stack based on team expertise and project requirements
2. Set up the basic project structure
3. Configure development environment and tools
4. Set up CI/CD pipeline early if possible
5. Implement basic error handling and logging
6. Set up monitoring and health checks

## Common Patterns

### Configuration Management
- Use environment-specific config files
- Never commit secrets to version control
- Use a secrets management service for production

### State Management
- Choose appropriate state management solutions
- Keep state as simple as possible
- Consider using established patterns (Redux, MobX, etc.)

### API Integration
- Use HTTP clients with proper error handling
- Implement retry logic for critical operations
- Cache responses where appropriate

This file will be updated as the project evolves and specific architectural decisions are made.