$carVideo = "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/car-detection.mp4"
$driverVideo = "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/driver-gaze-detection.mp4"
$trafficVideo = "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/vehicle-license-plate-detection.mp4"

if (!(Test-Path -Path "public/videos")) {
    New-Item -ItemType Directory -Path "public/videos"
}

Write-Host "Downloading authentic Intel Automotive Driving MP4..."
curl.exe -k -L $carVideo -o "public/videos/car_driving_master.mp4"

Write-Host "Downloading authentic Intel Dashboard Driver POV MP4..."
curl.exe -k -L $driverVideo -o "public/videos/dashboard_master.mp4"

Write-Host "Downloading authentic Intel Vehicle Traffic Stream MP4..."
curl.exe -k -L $trafficVideo -o "public/videos/traffic_master.mp4"

# Populate all page playlist slots with genuine automotive videos
Copy-Item "public/videos/car_driving_master.mp4" "public/videos/dashboard1.mp4" -Force
Copy-Item "public/videos/dashboard_master.mp4" "public/videos/dashboard2.mp4" -Force
Copy-Item "public/videos/traffic_master.mp4" "public/videos/dashboard3.mp4" -Force

Copy-Item "public/videos/dashboard_master.mp4" "public/videos/twin1.mp4" -Force
Copy-Item "public/videos/car_driving_master.mp4" "public/videos/twin2.mp4" -Force
Copy-Item "public/videos/traffic_master.mp4" "public/videos/twin3.mp4" -Force

Copy-Item "public/videos/car_driving_master.mp4" "public/videos/journey1.mp4" -Force
Copy-Item "public/videos/traffic_master.mp4" "public/videos/journey2.mp4" -Force
Copy-Item "public/videos/dashboard_master.mp4" "public/videos/journey3.mp4" -Force

Copy-Item "public/videos/dashboard_master.mp4" "public/videos/diagnostics1.mp4" -Force
Copy-Item "public/videos/traffic_master.mp4" "public/videos/diagnostics2.mp4" -Force

Copy-Item "public/videos/car_driving_master.mp4" "public/videos/maintenance1.mp4" -Force
Copy-Item "public/videos/dashboard_master.mp4" "public/videos/maintenance2.mp4" -Force

Write-Host "ALL 13 PLAYLIST SLOTS POPULATED WITH REAL AUTOMOTIVE CAR DRIVING VIDEOS!"
