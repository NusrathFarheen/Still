# Simple PowerShell HTTP Server for Still App
# Run this to serve the app locally

$port = 5173
$path = $PSScriptRoot

Write-Host "Starting Still app server on http://localhost:$port" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://*:$port/")
$listener.Start()

Write-Host "Server running! Open http://localhost:$port in your browser" -ForegroundColor Cyan
Write-Host ""

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested file path
        $requestedPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($requestedPath) -or $requestedPath -eq '/') {
            $requestedPath = 'index.html'
        }
        
        $filePath = Join-Path $path $requestedPath
        
        Write-Host "$($request.HttpMethod) $($request.Url.LocalPath)" -ForegroundColor Gray
        
        if (Test-Path $filePath -PathType Leaf) {
            # Determine content type
            $contentType = switch ([System.IO.Path]::GetExtension($filePath)) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.json' { 'application/json; charset=utf-8' }
                '.png'  { 'image/png' }
                '.jpg'  { 'image/jpeg' }
                '.jpeg' { 'image/jpeg' }
                '.gif'  { 'image/gif' }
                '.svg'  { 'image/svg+xml' }
                '.ico'  { 'image/x-icon' }
                default { 'application/octet-stream' }
            }
            
            # Read and send file
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        else {
            # 404 Not Found
            $response.StatusCode = 404
            $html = "<html><body><h1>404 - File Not Found</h1><p>$requestedPath</p></body></html>"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
            $response.ContentType = 'text/html; charset=utf-8'
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        $response.Close()
    }
}
finally {
    $listener.Stop()
    Write-Host "Server stopped." -ForegroundColor Yellow
}
