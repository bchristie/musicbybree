# Moving Project to WSL2

## Windows Cleanup Commands (run in PowerShell)

```powershell
# Stop and remove Docker container
docker stop vocal-portfolio-db
docker rm vocal-portfolio-db

# Optional: Remove Docker volumes if you want fresh database
docker volume prune -f

# Navigate to project root
cd C:\Users\bradc\GitHub\mu51cbybr33

# Clean node_modules and build artifacts
Remove-Item -Path node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path prisma/data -Recurse -Force -ErrorAction SilentlyContinue

# Optional: Clean Prisma generated client
Remove-Item -Path app/generated -Recurse -Force -ErrorAction SilentlyContinue
```

## Move to WSL2

```powershell
# From Windows PowerShell, move the entire project to WSL2
wsl --exec bash -c "cp -r /mnt/c/Users/bradc/GitHub/mu51cbybr33 $HOME/"
```

## WSL2 Setup Commands (run in WSL2 terminal)

```bash
# Enter WSL2
wsl

# Navigate to project
cd ~/mu51cbybr33

# Fix line endings (CRLF → LF)
find . -type f -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/prisma/data/*" \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name ".env*" \) -exec dos2unix {} \;

# If dos2unix is not installed:
sudo apt update && sudo apt install -y dos2unix

# Install dependencies
npm install

# Start PostgreSQL with Docker Compose
docker compose up -d

# Wait for database to be ready
sleep 5

# Push database schema
npm run db:push

# Create admin user
npm run db:seed

# Start development server
npm run dev
```

## Verify Everything Works

```bash
# Check Docker container is running
docker ps

# Should see vocal-portfolio-db with ports 0.0.0.0:5432->5432/tcp

# Test database connection
docker exec vocal-portfolio-db pg_isready -U postgres

# Access the site
# Open browser to: http://localhost:3000
# Admin login: http://localhost:3000/admin/login
#   Email: admin@example.com
#   Password: admin123
```

## Optional: Configure Git for WSL2

```bash
# Set Git to handle line endings properly
git config --global core.autocrlf input
git config --global core.eol lf

# If you want to reset the repository
cd ~/mu51cbybr33
git config core.autocrlf input
git rm --cached -r .
git reset --hard
```

## Notes
- WSL2 has native Docker support, so port binding should work correctly
- Database data will be stored in `~/mu51cbybr33/prisma/data`
- Access the site from Windows browser at `http://localhost:3000`
- WSL2 networking is better for Docker than Windows in many cases
