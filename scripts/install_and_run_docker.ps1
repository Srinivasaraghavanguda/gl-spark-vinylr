<#
  install_and_run_docker.ps1
  - Installs Docker Desktop via winget if not present (requires Windows 10/11 and winget)
  - Starts Docker Desktop and runs `docker compose up --build`

USAGE (Run as Administrator):
  Open PowerShell as Administrator and run:
    .\scripts\install_and_run_docker.ps1
#>

function Check-Command($name) {
  return Get-Command $name -ErrorAction SilentlyContinue
}

Write-Host "Checking for Docker..."
if (Check-Command docker) {
  Write-Host "Docker CLI found. Proceeding to docker compose up..."
} else {
  Write-Host "Docker CLI not found. Attempting to install Docker Desktop via winget..."
  if (Check-Command winget) {
    Write-Host "Installing Docker Desktop (this requires approval in UI)."
    winget install --id Docker.DockerDesktop -e --source winget
    Write-Host "Installation requested. Please complete Docker Desktop installer UI if prompted."
    Write-Host "Waiting 15 seconds for the installer to register docker CLI..."
    Start-Sleep -Seconds 15
    if (-not (Check-Command docker)) {
      Write-Warning "Docker CLI still not available. You may need to log out/in or start Docker Desktop manually."
      Write-Host "Open Docker Desktop and ensure it is running, then re-run this script."
      exit 1
    }
  } else {
    Write-Warning "winget not found. Please install Docker Desktop manually from https://www.docker.com/products/docker-desktop and then re-run this script."
    exit 1
  }
}

# Ensure docker daemon is running
Write-Host "Checking Docker daemon status..."
try {
  docker version --format '{{.Server.Version}}' > $null 2>&1
  Write-Host "Docker daemon is running."
} catch {
  Write-Host "Docker daemon not running. Attempting to start Docker Desktop..."
  Start-Process -FilePath "C:\Program Files\Docker\Docker\Docker Desktop.exe" -ErrorAction SilentlyContinue
  Write-Host "Waiting up to 60 seconds for Docker to become available..."
  $attempts = 0
  while ($attempts -lt 12) {
    try {
      docker version --format '{{.Server.Version}}' > $null 2>&1
      break
    } catch {
      Start-Sleep -Seconds 5
      $attempts++
    }
  }
  if ($attempts -ge 12) {
    Write-Warning "Docker did not start in time. Please open Docker Desktop and wait until it's ready, then re-run this script."
    exit 1
  }
}

Write-Host "Starting Docker Compose stack (this will build images)..."
Push-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Path)\..\
docker compose up --build
Pop-Location
