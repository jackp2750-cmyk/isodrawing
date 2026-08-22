[CmdletBinding()]
param(
    [string]$DestinationRoot
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$workspaceRoot = Split-Path -Parent $repoRoot

if ([string]::IsNullOrWhiteSpace($DestinationRoot)) {
    $DestinationRoot = Join-Path $workspaceRoot "UPLOAD-TO-GITHUB"
}
elseif (-not [System.IO.Path]::IsPathRooted($DestinationRoot)) {
    $DestinationRoot = Join-Path $workspaceRoot $DestinationRoot
}

$DestinationRoot = [System.IO.Path]::GetFullPath($DestinationRoot)
New-Item -ItemType Directory -Path $DestinationRoot -Force | Out-Null

$version = "current"
$versionMatch = Select-String -LiteralPath (Join-Path $repoRoot "app.js") -Pattern 'const APP_VERSION\s*=\s*"([^"]+)"' | Select-Object -First 1
if ($versionMatch -and $versionMatch.Matches.Count -gt 0) {
    $version = $versionMatch.Matches[0].Groups[1].Value
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$target = Join-Path $DestinationRoot "SpoolMate-$version-GitHub-upload-$stamp"
New-Item -ItemType Directory -Path $target | Out-Null

# This is an explicit allow-list. New local folders cannot enter the upload by accident.
$allowedFiles = @(
    ".gitignore",
    "CHANGELOG.md",
    "GITHUB-UPLOAD-GUIDE.md",
    "README.md",
    "RUN-THIS-ONCE-IN-SUPABASE.sql",
    "app.js",
    "index.html",
    "manifest.webmanifest",
    "prepare-github-upload.ps1",
    "styles.css",
    "supabase-migration-v279.sql",
    "supabase-migration-v295-trial-access.sql",
    "supabase-migration-v296-ai-helper.sql",
    "supabase-migration-v318-business-workspaces.sql",
    "supabase-migration-v338-support-admin.sql",
    "supabase-migration-v339-jobs-dashboard-preferences.sql",
    "supabase-setup.sql",
    "sw.js",
    "verify-app.cjs"
)

$allowedDirectories = @(
    "icons",
    "supabase"
)

foreach ($relativePath in $allowedFiles) {
    $source = Join-Path $repoRoot $relativePath
    if (Test-Path -LiteralPath $source -PathType Leaf) {
        Copy-Item -LiteralPath $source -Destination (Join-Path $target $relativePath)
    }
}

foreach ($relativePath in $allowedDirectories) {
    $source = Join-Path $repoRoot $relativePath
    if (Test-Path -LiteralPath $source -PathType Container) {
        Copy-Item -LiteralPath $source -Destination (Join-Path $target $relativePath) -Recurse
    }
}

$blockedExtensions = @(".mp4", ".mov", ".mkv", ".webm", ".wav", ".mp3", ".aac", ".m4a", ".zip", ".7z")
$blockedFiles = Get-ChildItem -LiteralPath $target -Recurse -File | Where-Object {
    $blockedExtensions -contains $_.Extension.ToLowerInvariant() -or
    $_.Name -eq ".env" -or
    $_.Name.StartsWith(".env.")
}

if ($blockedFiles) {
    $blockedList = ($blockedFiles.FullName -join [Environment]::NewLine)
    throw "Safety check failed. The upload folder contains blocked files:`n$blockedList"
}

$fileCount = (Get-ChildItem -LiteralPath $target -Recurse -File).Count
$totalBytes = (Get-ChildItem -LiteralPath $target -Recurse -File | Measure-Object -Property Length -Sum).Sum
$totalMegabytes = [Math]::Round($totalBytes / 1MB, 2)

Write-Host ""
Write-Host "Safe GitHub upload prepared:" -ForegroundColor Green
Write-Host $target -ForegroundColor Cyan
Write-Host "$fileCount files, $totalMegabytes MB; no videos, audio, archives, or .env files."
Write-Host "Open that folder and upload its CONTENTS to the root of the GitHub main branch."
Write-Host "Do not upload the UPLOAD-TO-GITHUB parent folder itself."
