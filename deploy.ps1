Write-Host "====== DEPLOY SCRIPT ======" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Committing code..." -ForegroundColor Yellow
$commitMessage = "Update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git add .
git commit -m $commitMessage

Write-Host "[2/3] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
Write-Host "Pushed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "[3/3] Pulling & restarting on VPS..." -ForegroundColor Yellow
ssh vps@20.244.83.46 "cd /var/www/du-an-ca-nhan && git pull && pm2 restart du-an-ca-nhan"

Write-Host ""
Write-Host "====== DEPLOY COMPLETED ======"  -ForegroundColor Green
Write-Host "Website: https://dinhtronghau.top" -ForegroundColor Cyan
