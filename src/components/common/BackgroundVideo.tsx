import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const PAGE_PLAYLISTS: Record<string, string[]> = {
  dashboard: [
    '/videos/dashboard1.mp4',
    '/videos/dashboard2.mp4',
    '/videos/dashboard3.mp4'
  ],
  'digital-twin': [
    '/videos/twin1.mp4',
    '/videos/twin2.mp4',
    '/videos/twin3.mp4'
  ],
  'journey-simulator': [
    '/videos/journey1.mp4',
    '/videos/journey2.mp4',
    '/videos/journey3.mp4'
  ],
  diagnostics: [
    '/videos/diagnostics1.mp4',
    '/videos/diagnostics2.mp4'
  ],
  maintenance: [
    '/videos/maintenance1.mp4',
    '/videos/maintenance2.mp4'
  ],
  alerts: [
    '/videos/dashboard1.mp4',
    '/videos/dashboard2.mp4'
  ],
  reports: [
    '/videos/dashboard3.mp4',
    '/videos/twin1.mp4'
  ],
  settings: [
    '/videos/dashboard1.mp4',
    '/videos/twin2.mp4'
  ]
};

const CDN_FALLBACKS: Record<string, string[]> = {
  dashboard: [
    '/videos/dashboard1.mp4',
    '/videos/dashboard2.mp4'
  ],
  'digital-twin': [
    '/videos/twin1.mp4',
    '/videos/twin2.mp4'
  ]
};

export const BackgroundVideo: React.FC = () => {
  const { currentNav } = useApp();
  const playlist = PAGE_PLAYLISTS[currentNav] || PAGE_PLAYLISTS.dashboard;
  const fallbacks = CDN_FALLBACKS[currentNav] || CDN_FALLBACKS.dashboard;

  const [playlistIndex, setPlaylistIndex] = useState<number>(0);
  const [useFallbackUrl, setUseFallbackUrl] = useState<boolean>(false);

  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>('A');
  const [videoSrcA, setVideoSrcA] = useState<string>(playlist[0]);
  const [videoSrcB, setVideoSrcB] = useState<string>(playlist[1 % playlist.length]);

  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);

  // Play immediately on mount & setup video parameters
  useEffect(() => {
    if (videoRefA.current) {
      videoRefA.current.play().catch(err => console.warn("Video A play error:", err));
    }
  }, [videoSrcA]);

  useEffect(() => {
    if (videoRefB.current) {
      videoRefB.current.play().catch(err => console.warn("Video B play error:", err));
    }
  }, [videoSrcB]);

  useEffect(() => {
    setPlaylistIndex(0);
    const newPlaylist = PAGE_PLAYLISTS[currentNav] || PAGE_PLAYLISTS.dashboard;
    const initialSrc = newPlaylist[0];
    const secondSrc = newPlaylist[1 % newPlaylist.length];

    if (activeSlot === 'A') {
      setVideoSrcA(initialSrc);
      setVideoSrcB(secondSrc);
    } else {
      setVideoSrcB(initialSrc);
      setVideoSrcA(secondSrc);
    }
  }, [currentNav]);

  useEffect(() => {
    const ROTATION_TIME_MS = 12000;

    const timer = setInterval(() => {
      const nextIdx = (playlistIndex + 1) % playlist.length;
      const nextLocalPath = playlist[nextIdx];

      const activeNextSrc = useFallbackUrl
        ? fallbacks[nextIdx % fallbacks.length]
        : nextLocalPath;

      if (activeSlot === 'A') {
        setVideoSrcB(activeNextSrc);
        if (videoRefB.current) {
          videoRefB.current.src = activeNextSrc;
          videoRefB.current.load();
          videoRefB.current.play().catch(() => {});
        }
        setActiveSlot('B');
      } else {
        setVideoSrcA(activeNextSrc);
        if (videoRefA.current) {
          videoRefA.current.src = activeNextSrc;
          videoRefA.current.load();
          videoRefA.current.play().catch(() => {});
        }
        setActiveSlot('A');
      }

      setPlaylistIndex(nextIdx);
    }, ROTATION_TIME_MS);

    return () => clearInterval(timer);
  }, [playlistIndex, activeSlot, playlist, fallbacks, useFallbackUrl]);

  const handleError = () => {
    if (!useFallbackUrl) {
      setUseFallbackUrl(true);
      const fallbackSrc = fallbacks[playlistIndex % fallbacks.length];
      if (activeSlot === 'A') setVideoSrcA(fallbackSrc);
      else setVideoSrcB(fallbackSrc);
    }
  };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {/* Fallback Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black z-0" />

      {/* Video Element A */}
      <motion.video
        ref={videoRefA}
        src={videoSrcA}
        autoPlay
        muted
        loop
        playsInline
        onError={handleError}
        animate={{ opacity: activeSlot === 'A' ? 0.75 : 0 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Video Element B */}
      <motion.video
        ref={videoRefB}
        src={videoSrcB}
        autoPlay
        muted
        loop
        playsInline
        onError={handleError}
        animate={{ opacity: activeSlot === 'B' ? 0.75 : 0 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay for Dashboard Readability */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] z-10" />

      {/* Tech Grid Pattern */}
      <div
        className="absolute inset-0 z-10 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(#00F0FF 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};

export default BackgroundVideo;
