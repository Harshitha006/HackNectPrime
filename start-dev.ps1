Write-Host "Starting HackNect Development Environment..." -ForegroundColor Cyan

# Check dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing root dependencies..."
    npm install concurrently
}

if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
}

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
}

# Python setup
if (-not (Test-Path "ai-service/venv")) {
    Write-Host "Setting up Python virtual environment..."
    python -m venv ai-service/venv
    .\ai-service\venv\Scripts\pip install -r ai-service/requirements.txt
}

# Start services
Write-Host "Starting all services..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend: http://localhost:4000"
Write-Host "AI Service: http://localhost:8000"

# Using concurrently via npx to run everything
npx concurrently --kill-others-on-fail -n "FRONTEND,BACKEND,AI" -c "cyan,green,magenta" `
    "cd frontend && npm run dev" `
    "cd backend && npm run dev" `
    ".\ai-service\venv\Scripts\python ai-service/main.py"
