param(
  [string]$OpenClawConfig = "C:\Users\Mr Claw\.openclaw\openclaw.json"
)

Write-Host "Edit your OpenClaw config and add plugin config for kalshi-plugin under the plugin config section."
Write-Host "Recommended demo config fields:"
Write-Host @'
{
  "environment": "sandbox",
  "productionEnabled": false,
  "apiKey": "<demo key>",
  "apiSecret": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----",
  "baseUrl": "https://demo-api.kalshi.co/trade-api/v2"
}
'@
Write-Host "Then run: openclaw plugins inspect kalshi-plugin --json"
