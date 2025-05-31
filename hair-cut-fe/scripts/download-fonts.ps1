$fontsPath = "d:\hair-cut\hair_cut\hair-cut-fe\public\fonts"
$fontUrls = @{
    "Roboto-Regular.ttf" = "https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Regular.ttf"
    "Roboto-Bold.ttf" = "https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Bold.ttf"
    "Roboto-Italic.ttf" = "https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Italic.ttf"
    "Roboto-BoldItalic.ttf" = "https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-BoldItalic.ttf"
}

foreach ($font in $fontUrls.GetEnumerator()) {
    $output = Join-Path $fontsPath $font.Key
    Write-Host "Downloading $($font.Key)..."
    Invoke-WebRequest -Uri $font.Value -OutFile $output
}

Write-Host "Font files downloaded successfully!"
