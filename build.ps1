#!/usr/bin/pwsh
param(
    [string] $ChartRepositoryUrl = "localhost",
    [string] $Output = "./dist"
)

$root = $PSScriptRoot
$srcPath = [System.IO.Path]::GetFullPath("$root/src")
$chartsPath = [System.IO.Path]::GetFullPath("$root/charts")
$distPath = [System.IO.Path]::GetFullPath($Output)
$valuesPath = [System.IO.Path]::GetFullPath("$distPath/values")

# Cleanup
Write-Host "Cleaning $distPath..."
New-Item -Path $distPath -ItemType Directory -ErrorAction Ignore | Out-Null
Remove-Item -Path $distPath/* -Recurse
New-Item -Path $valuesPath -ItemType Directory | Out-Null

# Build values
Get-ChildItem -Path $chartsPath -Recurse -Filter *.tgz -File | ForEach-Object {
    Write-Host "Staging $($_.FullName) -> $distPath..."
    $_ | Copy-Item -Destination $distPath

    $name = $_.Name -replace ".tgz$"
    $chartValuesPath = "$valuesPath/$name.yaml"
    Write-Host "Writing values to $chartValuesPath..."
    helm show values $_.FullName > $chartValuesPath
}

# Build index.yaml
Write-Host "Generating charts index for $distPath..."
helm repo index $distPath --url $ChartRepositoryUrl

# Copy static assets
Write-Host "Copying static assets to $distPath..."
Copy-Item -Recurse -Path './static/*' $distPath

Write-Host "Generating html index for $distPath..."
try
{
    Push-Location $srcPath/
    yarn install --frozen-lockfile
    yarn build --public-url $ChartRepositoryUrl
    Copy-Item -Recurse -Path ./dist/* -Destination $distPath
}
finally
{
    Pop-Location
}
