<#
  start_all_services.ps1
  - Launches required backend services and frontend in separate PowerShell windows.
  - Requires Windows PowerShell and the existing mvnw.cmd wrappers.
#>

function Start-ServiceWindow {
    param(
        [string]$WorkingDirectory,
        [string]$Command,
        [string]$Title
    )

    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$WorkingDirectory'; $Command" -WindowStyle Normal -WorkingDirectory $WorkingDirectory
}

Write-Host "Starting VinylR manual dev stack..."

Start-ServiceWindow -WorkingDirectory "$PSScriptRoot\..\service-registry" -Command ".\mvnw.cmd spring-boot:run" -Title "Service Registry"
Start-ServiceWindow -WorkingDirectory "$PSScriptRoot\..\api-gateway" -Command ".\mvnw.cmd spring-boot:run" -Title "API Gateway"
Start-ServiceWindow -WorkingDirectory "$PSScriptRoot\..\auth-service" -Command ".\mvnw.cmd spring-boot:run" -Title "Auth Service"
Start-ServiceWindow -WorkingDirectory "$PSScriptRoot\..\catalog-service" -Command ".\mvnw.cmd spring-boot:run" -Title "Catalog Service"
Start-ServiceWindow -WorkingDirectory "$PSScriptRoot\..\order-service" -Command ".\mvnw.cmd spring-boot:run" -Title "Order Service"
Start-ServiceWindow -WorkingDirectory "$PSScriptRoot\..\trending-service" -Command ".\mvnw.cmd spring-boot:run" -Title "Trending Service"
Start-ServiceWindow -WorkingDirectory "$PSScriptRoot\..\frontend" -Command "npm install; $env:REACT_APP_API_URL='http://localhost:8086/api'; npm start" -Title "Frontend"

Write-Host "All startup windows launched. Wait for each service to initialize before using the app."
