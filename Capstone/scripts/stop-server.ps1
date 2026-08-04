$connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($connections) {
    $connections | ForEach-Object {
        $procId = $_.OwningProcess
        if ($procId) {
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            Write-Output "Stopped process $procId"
        }
    }
} else {
    Write-Output "No process found on port 3000"
}
