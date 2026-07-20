import React, { useState, useEffect, useRef } from 'react';

export interface AutomotiveVideo {
  id: string;
  title: string;
  category: string;
  url: string;
}

// Curated high-reliability royalty-free automotive technology MP4 videos
export const AUTOMOTIVE_VIDEOS: AutomotiveVideo[] = [
  {
    id: 'video-1',
    title: 'EV Night Highway Telemetry POV',
    category: 'Highway Driving',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-highway-at-night-41553-large.mp4'
  },
  {
    id: 'video-2',
    title: 'Digital Twin HUD AI Telemetry',
    category: 'Digital Twin Visualization',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hud-display-interface-animation-43229-large.mp4'
  },
  {
    id: 'video-3',
    title: 'Connected Vehicle Dashboard POV',
    category: 'Dashboard POV driving',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-dashboard-of-a-car-driving-at-night-41554-large.mp4'
  },
  {
    id: 'video-4',
    title: 'Smart Factory Automotive Assembly',
    category: 'Robotics & Manufacturing',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-robotic-arm-working-in-a-factory-43187-large.mp4'
  },
  {
    id: 'video-5',
    title: 'AI Telemetry Diagnostic Stream',
    category: 'AI Visualization',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-interface-hud-screen-43213-large.mp4'
  },
  {
    id: 'video-6',
    title: 'EV Urban Fleet Mobility',
    category: 'Electric vehicle driving',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-driving-a-car-through-a-city-at-night-41556-large.mp4'
  }
];

export const VideoBackground: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [nextIndex, setNextIndex] = useState<number>(1);
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A');
  const [hasError, setHasError] = useState<boolean>(false);

  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);

  // Rotation timer every 10 seconds with preloading & seamless crossfade
  useEffect(() => {
    const ROTATION_INTERVAL_MS = 11000;

    const timer = setInterval(() => {
      // Calculate upcoming next index
      const upcomingIndex = (currentIndex + 1) % AUTOMOTIVE_VIDEOS.length;
      const futureIndex = (upcomingIndex + 1) % AUTOMOTIVE_VIDEOS.length;

      if (activePlayer === 'A') {
        // Prepare Video B with next source
        if (videoRefB.current) {
          videoRefB.current.src = AUTOMOTIVE_VIDEOS[upcomingIndex].url;
          videoRefB.current.load();
          videoRefB.current.play().catch(e => console.warn('Video B play error:', e));
        }
        setActivePlayer('B');
      } else {
        // Prepare Video A with next source
        if (videoRefA.current) {
          videoRefA.current.src = AUTOMOTIVE_VIDEOS[upcomingIndex].url;
          videoRefA.current.load();
          videoRefA.current.play().catch(e => console.warn('Video A play error:', e));
        }
        setActivePlayer('A');
      }

      setCurrentIndex(upcomingIndex);
      setNextIndex(futureIndex);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [currentIndex, activePlayer]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Fallback Static High-Tech Automotive Gradient / Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 z-0" />

      {!hasError && (
        <>
          {/* Video Player A */}
          <video
            ref={videoRefA}
            src={AUTOMOTIVE_VIDEOS[0].url}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setHasError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              activePlayer === 'A' ? 'opacity-40' : 'opacity-0'
            }`}
          />

          {/* Video Player B */}
          <video
            ref={videoRefB}
            src={AUTOMOTIVE_VIDEOS[1].url}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setHasError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              activePlayer === 'B' ? 'opacity-40' : 'opacity-0'
            }`}
          />
        </>
      )}

      {/* Cinematic Dark Overlay for Contrast & Blur readability */}
      <div className="absolute inset-0 bg-navy-950/75 backdrop-blur-[2px] z-10" />

      {/* Subtle Cyan Grid lines overlay for high-tech aesthetic */}
      <div
        className="absolute inset-0 z-10 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#00F0FF 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
