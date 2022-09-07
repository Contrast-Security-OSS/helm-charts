#!/usr/bin/pwsh
param(
    [string] $ChartRepositoryUrl = "localhost",
    [string] $Output = "./dist"
)

$root = $PSScriptRoot
$srcPath = [System.IO.Path]::GetFullPath("$root/src")
$distPath = [System.IO.Path]::GetFullPath($Output)

# Cleanup
Write-Host "Cleaning $distPath..."
New-Item -Path $distPath -ItemType Directory -ErrorAction Ignore | Out-Null
Remove-Item -Path $distPath/* -Recurse

# Stage
Get-ChildItem -Path $srcPath -Recurse -Filter *.tgz -File | ForEach-Object {
    Write-Host "Staging $($_.FullName) -> $distPath"
    $_ | Copy-Item -Destination $distPath
}

# Build index.
Write-Host "Generating charts index for $distPath..."
helm repo index $distPath --url $ChartRepositoryUrl

Write-Host "Generating html index for $distPath..."
tree -H $ChartRepositoryUrl -L 3 --noreport --charset utf-8 -o $distPath/index.html --du -h -T "Contrast Security, Inc Helm charts" -- $distPath
