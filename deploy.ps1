# Script deploy automatically for INHOME Design

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploy Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Commit and Push to GitHub
Write-Host "[1/3] Committing code..." -ForegroundColor Yellow
$commitMessage = "Update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git add .
git commit -m $commitMessage

Write-Host "[2/3] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host "Pushed to GitHub" -ForegroundColor Green
Write-Host ""

# Step 2: SSH to VPS, pull code and restart
Write-Host "[3/3] Pulling & restarting on VPS..." -ForegroundColor Yellow
ssh vps@20.244.83.46 "cd /var/www/du-an-ca-nhan && git pull && pm2 restart du-an-ca-nhan"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploy completed!" -ForegroundColor Green
Write-Host "Website: https://dinhtronghau.top" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
