$ErrorActionPreference = "Stop"

Set-Location (Split-Path $PSScriptRoot -Parent)

$envPath = Join-Path (Get-Location) ".env"
if (!(Test-Path $envPath)) {
  throw ".env 파일이 없습니다: $envPath"
}

$content = Get-Content $envPath -Raw -Encoding UTF8
$content = $content -replace "localhost:5433", "localhost:5432"

Set-Content -Path $envPath -Value $content -Encoding UTF8
Write-Host "OK: DATABASE_URL 포트를 5432(로컬 서비스)로 변경했습니다."
Select-String -Path $envPath -Pattern "^DATABASE_URL=" | ForEach-Object { Write-Host $_.Line }

