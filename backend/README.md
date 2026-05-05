# Blood Donations Backend

Express.js backend server that acts as a proxy for the MDA (Magen David Adom) blood donations API to handle CORS issues.

## Features

- **CORS Support**: Enables cross-origin requests from the frontend
- **API Proxy**: Proxies requests to the MDA API endpoint
- **Error Handling**: Comprehensive error handling and logging
- **TypeScript**: Full TypeScript support with type safety
- **Health Checks**: Built-in health check endpoints

## API Endpoints

### Health Check
- `GET /health` - General server health check
- `GET /api/blood-donations/health` - Blood donations service health check

### Blood Donations
- `POST /api/blood-donations` - Proxy endpoint for MDA blood donations API

## Development

### Prerequisites
- Node.js v22+ (as specified in project requirements)
- npm

### Setup
```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
Create a `.env` file in the backend directory:
```
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## API Usage

The backend automatically forwards requests to the MDA API with the following payload:

```json
{
  "RequestHeader": {
    "Application": 101,
    "Module": "BloodBank",
    "Function": "GetAllDetailsDonations",
    "Token": ""
  },
  "RequestData": ""
}
```

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (default Vite dev server)
- Configurable via `FRONTEND_URL` environment variable
