'use client';

import React, { useEffect, useRef, useState } from 'react';
import { myPlaylist, SongItem } from './playlist'; // 🔒 1. 显式引入类型约束

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 坐标初始值改为静态数字，防止打包时服务器环境由于找不到 window 导致构建崩溃
  const [position, setPosition] = useState({ x: 20, y: 300 }); 
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // 🔒 2. 水合锁（Hydration Guard）：彻底杜绝 Cloudflare Pages 打包时 SSR/预渲染期间的报错
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setPosition({ x: 20, y: window.innerHeight - 150 });
    }
  }, []);

  // 🔒 3. 精确指定对象类型为 SongItem
  const currentSong: SongItem = myPlaylist[currentIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isExpanded && isPlaying) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, isPlaying, currentIndex]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX, y: clientY, posX: position.x, posY: position.y };
  };

  useEffect(() => {
    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragStart.current.x;
      const deltaY = clientY - dragStart.current.y;

      let newX = dragStart.current.posX + deltaX;
      let newY = dragStart.current.posY + deltaY;

      newX = Math.max(10, Math.min(window.innerWidth - (isExpanded ? 280 : 60), newX));
      newY = Math.max(10, Math.min(window.innerHeight - 70, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => { setIsDragging(false); };

    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove, { passive: false });
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, isExpanded, position]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            const initPlay = () => {
              audioRef.current?.play();
              setIsPlaying(true);
              document.removeEventListener('click', initPlay);
            };
            document.addEventListener('click', initPlay);
          });
      }
    }
  };

  // 🔒 4. 如果组件未在客户端完全挂载，返回 null（这是避免打包报错的关键点）
  if (!mounted || !currentSong) return null;

  const safeAvatar = currentSong.avatar?.replace('http://', 'https://');
  const safeMusicUrl = currentSong.musicUrl?.replace('http://', 'https://');

  return (
    <div
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: `${position.x}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        borderRadius: isExpanded ? '16px' : '50%',
        padding: isExpanded ? '12px' : '4px',
        display: 'flex',
        alignItems: 'center',
        gap: isExpanded ? '12px' : '0px',
        zIndex: 9999,
        width: isExpanded ? '280px' : '52px',
        height: '52px',
        transition: isDragging ? 'none' : 'width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1), border-radius 0.3s',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      <audio ref={audioRef} src={safeMusicUrl} onEnded={() => setCurrentIndex((prev) => (prev === myPlaylist.length - 1 ? 0 : prev + 1))} />

      {!isExpanded && (
        <div onClick={() => setIsExpanded(true)} style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
          <img src={safeAvatar} alt="cd" style={{ width: '100%', height: '100%', objectFit: 'cover', animation: isPlaying ? 'spin 6s linear infinite' : 'none' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '8px', backgroundColor: '#111', borderRadius: '50%', border: '2px solid #fff' }} />
        </div>
      )}

      {isExpanded && (
        <>
          <div onClick={() => setIsExpanded(false)} style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}>
            <img src={safeAvatar} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', animation: isPlaying ? 'spin 6s linear infinite' : 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                {currentSong.songName}
              </span>
              <span style={{ fontSize: '10px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60px' }}>
                {currentSong.singer}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? myPlaylist.length - 1 : prev - 1)); }} style={btnStyle}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                <button onClick={togglePlay} style={{ ...btnStyle, transform: 'scale(1.1)' }}>
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === myPlaylist.length - 1 ? 0 : prev + 1)); }} style={btnStyle}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px' }}>🔊</span>
                <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ width: '50px', height: '3px', accentColor: '#444', cursor: 'pointer' }} />
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#444',
};
