param(
  [string]$RepoRoot = "C:\Users\Mr Claw\.openclaw\workspace\kalshi-openclaw",
  [string]$ExtensionRoot = "C:\Users\Mr Claw\.openclaw\extensions\kalshi-plugin"
)

$ErrorActionPreference = 'Stop'

Write-Host "Building plugin..."
Set-Location $RepoRoot
npm install --package-lock-only --ignore-scripts --no-audit --no-fund | Out-Host
npx tsc -p .\packages\kalshi-plugin\tsconfig.json | Out-Host

Write-Host "Syncing plugin files to extension root..."
if (Test-Path $ExtensionRoot) {
  Remove-Item -Recurse -Force $ExtensionRoot
}
New-Item -ItemType Directory -Path $ExtensionRoot | Out-Null
Copy-Item -Recurse -Force .\packages\kalshi-plugin\* $ExtensionRoot

Write-Host "Installing extension runtime dependencies..."
Set-Location $ExtensionRoot
npm install --no-audit --no-fund | Out-Host

Write-Host "Inspecting plugin..."
openclaw plugins inspect kalshi-plugin --json | Out-Host

Write-Host "Done."
