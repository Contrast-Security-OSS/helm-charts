#!/usr/bin/pwsh
param(
    [string] $ChartRepositoryUrl = "localhost",
    [string] $Output = "./dist"
)

$root = $PSScriptRoot
$srcPath = [System.IO.Path]::GetFullPath("$root/src")
$distPath = [System.IO.Path]::GetFullPath($Output)
$valuesPath = [System.IO.Path]::GetFullPath("$distPath/values")

# Cleanup
Write-Host "Cleaning $distPath..."
New-Item -Path $distPath -ItemType Directory -ErrorAction Ignore | Out-Null
Remove-Item -Path $distPath/* -Recurse
New-Item -Path $valuesPath -ItemType Directory

# Stage
Get-ChildItem -Path $srcPath -Recurse -Filter *.tgz -File | ForEach-Object {
    Write-Host "Staging $($_.FullName) -> $distPath..."
    $_ | Copy-Item -Destination $distPath

    $name = $_.Name -replace ".tgz$"
    $valuesPath = "$valuesPath/$name.yaml"
    Write-Host "Writing values to $valuesPath..."
    helm show values $_.FullName > $valuesPath
}

# Build index.
Write-Host "Generating charts index for $distPath..."
helm repo index $distPath --url $ChartRepositoryUrl

Write-Host "Generating html index for $distPath..."
tree -H $ChartRepositoryUrl -L 3 --noreport --charset utf-8 -o $distPath/index.html --du -h -T "Contrast Security, Inc Helm charts" -- $distPath
