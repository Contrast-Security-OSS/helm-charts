#!/usr/bin/pwsh
param(
    [string] $ChartRepositoryUrl = "localhost",
    [string] $Output = "./dist"
)

$root = $PSScriptRoot
$srcPath = [System.IO.Path]::GetFullPath("$root/src")
$distPath = [System.IO.Path]::GetFullPath($Output)
$chartsPath = [System.IO.Path]::GetFullPath("$distPath/charts")

# Cleanup
Write-Host "Cleaning $distPath..."
New-Item -Path $distPath -ItemType Directory -ErrorAction Ignore | Out-Null
Remove-Item -Path $distPath/* -Recurse
New-Item -Path $chartsPath -ItemType Directory | Out-Null

# Stage
Get-ChildItem -Path $srcPath -Recurse -Filter *.tgz -File | ForEach-Object {
    Write-Host "Staging $($_.FullName) -> $chartsPath"
    $_ | Copy-Item -Destination $chartsPath
}

# Build index.
Write-Host "Generating charts index for $chartsPath..."
helm repo index $chartsPath --url $ChartRepositoryUrl

Write-Host "Generating html index for $distPath..."
tree -H $ChartRepositoryUrl -L 3 --noreport --charset utf-8 -o $distPath/index.html --du -h -T "Contrast Security, Inc Helm charts" -- $distPath
