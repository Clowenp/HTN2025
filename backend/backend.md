# PhotoMind Backend Documentation

## Overview
The PhotoMind backend is a Flask-based REST API that handles image upload, processing, labeling, and search functionality. It integrates with Microsoft Omniparser, Anthropic Claude, and AWS DynamoDB to provide intelligent photo management capabilities.

## Architecture

### Core Components
- **Flask Application** (`app.py`) - Main API server with CORS enabled for React frontend
- **Image Processing Service** (`services/image_processor.py`) - Handles Omniparser and Claude integration
- **Database Service** (`services/database.py`) - Manages DynamoDB operations for label storage
- **Configuration** (`config.py`) - Environment-based configuration management

### Technology Stack
- **Framework**: Flask 2.3.3
- **Database**: AWS DynamoDB
- **AI Services**: 
  - Microsoft Omniparser (for image parsing)
  - Anthropic Claude (for label generation and descriptions)
- **Image Processing**: Pillow (PIL)
- **Cloud Services**: AWS SDK (boto3)

## API Endpoints

### Health Check
- **GET** `/` - Returns service health status

### Image Management
- **POST** `/api/upload` - Upload and process new images
- **GET** `/api/gallery` - Retrieve all images in gallery
- **GET** `/api/image/<image_id>` - Get detailed information about specific image
- **GET** `/api/thumbnail/<image_id>` - Get thumbnail for specific image

### Search
- **POST** `/api/search` - Search images using natural language queries

## Data Flow

### Image Upload Process
1. Client uploads image via `/api/upload`
2. Image saved with unique UUID filename
3. Image processed through Microsoft Omniparser
4. Omniparser results sent to Claude for label generation
5. Labels stored in DynamoDB with image_id mapping
6. Response returned with image_id and generated labels

### Search Process
1. Client sends natural language query via `/api/search`
2. Query processed by Claude to extract relevant tags
3. Tags used to query DynamoDB labels table
4. Matching image_ids retrieved and metadata returned
5. Results formatted and sent back to client

## Database Schema (DynamoDB)

### Table: `photo_labels`
- **Primary Key**: `label_id` (String) - Unique identifier for each label
- **Global Secondary Index**: `ImageIdIndex` on `image_id`

### Item Structure
```json
{
  "label_id": "uuid-string",
  "image_id": "uuid-string", 
  "label": "normalized-label-text",
  "filename": "original-filename.jpg",
  "created_at": "ISO-timestamp",
  "metadata": {
    "confidence": 0.85,
    "processing_time": "2.3s"
  }
}
```

## Configuration

### Environment Variables
Create a `.env` file based on `.env.example`:

```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=photo_labels

# Anthropic Configuration  
ANTHROPIC_API_KEY=your_anthropic_api_key

# Microsoft Omniparser Configuration
OMNIPARSER_API_KEY=your_omniparser_api_key
OMNIPARSER_ENDPOINT=your_omniparser_endpoint

# Flask Configuration
SECRET_KEY=your_secret_key
FLASK_ENV=development
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- AWS Account with DynamoDB access
- Anthropic API key
- Microsoft Omniparser access (when available)

### Installation Steps
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment:
   ```bash
   copy .env.example .env
   # Edit .env with your API keys and configuration
   ```

5. Run the application:
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## Development Status

### Implemented Features ✅
- Flask application structure with CORS
- RESTful API endpoints for all core functionality
- Image upload handling with file validation
- DynamoDB service layer with table management
- Image processing service structure
- Configuration management system
- Error handling and logging

### TODO Features 🚧
- Microsoft Omniparser integration
- Anthropic Claude API integration for label generation
- Actual image processing pipeline
- Thumbnail generation and serving
- Image file serving endpoints
- Authentication and authorization
- Rate limiting and security measures
- Comprehensive error handling
- Unit and integration tests
- Docker containerization
- Production deployment configuration

### Mock Responses
Currently, the API returns mock data for development and testing purposes. All endpoints are functional but return placeholder data until external service integrations are completed.

## File Structure
```
backend/
├── app.py                 # Main Flask application
├── config.py             # Configuration management
├── requirements.txt      # Python dependencies
├── .env.example         # Environment variables template
├── services/
│   ├── __init__.py
│   ├── image_processor.py  # Image processing logic
│   └── database.py        # DynamoDB operations
└── uploads/              # Image storage directory (created automatically)
```

## Error Handling
- All endpoints return JSON responses with consistent error format
- HTTP status codes follow REST conventions
- Detailed error messages for development (should be sanitized in production)
- Graceful degradation when external services are unavailable

## Security Considerations
- CORS configured for React frontend
- File upload size limits (16MB max)
- File type validation for image uploads
- Environment-based configuration for sensitive data
- TODO: Add authentication, input validation, and rate limiting

## Performance Considerations
- Asynchronous processing for image analysis (TODO)
- Thumbnail generation for faster gallery loading
- DynamoDB pagination for large datasets (TODO)
- Image compression and optimization (TODO)

## Monitoring & Logging
- Basic Flask logging enabled
- TODO: Add structured logging, metrics, and health checks
