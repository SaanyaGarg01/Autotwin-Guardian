$urls = @(
  "https://vjs.zencdn.net/v/oceans.mp4",
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_2MB.mp4"
)

$filenames = @(
  "dashboard1.mp4", "dashboard2.mp4", "dashboard3.mp4",
  "twin1.mp4", "twin2.mp4", "twin3.mp4",
  "journey1.mp4", "journey2.mp4", "journey3.mp4",
  "diagnostics1.mp4", "diagnostics2.mp4",
  "maintenance1.mp4", "maintenance2.mp4"
)

if (!(Test-Path -Path "public/videos")) {
    New-Item -ItemType Directory -Path "public/videos"
}

for ($i = 0; $i -lt $filenames.Length; $i++) {
    $file = $filenames[$i]
    $url = $urls[$i % $urls.Length]
    $outputPath = "public/videos/$file"
    Write-Host "Downloading $file from $url..."
    curl.exe -L $url -o $outputPath
}
Write-Host "All requested MP4 video files downloaded into public/videos/ successfully!"
