# VinylR - Local Dev Runbook

Quick setup to run the full stack locally using Docker Compose.

Prerequisites
- Docker Desktop (or Docker Engine) installed
- Optional: Java + Maven if you prefer running services locally without Docker

Run the full stack (builds images and starts containers):

```powershell
# From repository root
docker compose up --build
```

Notes
- Frontend uses the env var `REACT_APP_API_URL` if you need to point to a different API base URL before building.
- Service ports:
  - Service Registry (Eureka): 8761
  - API Gateway: 8086
  - Trending Service: 8084
  - Frontend (served by nginx): 3000
  - Postgres: 5432

Quick health check (after services are up):

```powershell
curl http://localhost:8086/api/trending/itunes-global
```

If you prefer not to use Docker, start services individually using their bundled wrappers on Windows:

```powershell
# In each service folder
.\mvnw.cmd spring-boot:run
```

Contact me if you want a one-command script to start everything or Kubernetes manifests.