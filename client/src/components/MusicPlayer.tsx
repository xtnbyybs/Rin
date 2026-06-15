'use client';

import React, { useEffect, useRef, useState } from 'react';
import { myPlaylist, SongItem } from './playlist';

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenuList, setShowMenuList] = useState(false); // 控制点击换歌菜单显示

  // 进度条相关状态
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // 拖拽控制状态
  const [position, setPosition] = useState({ x: 20, y: 300 }); 
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const hasDraggedRef = useRef(false);

  // 1. 初始化：挂载锁以及【网页打开自动随机挑一首歌】
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setPosition({ x: 20, y: window.innerHeight - 180 });
      // 🎲 随机机制：在歌单长度内随机取一个索引
      const randomIndex = Math.floor(Math.random() * myPlaylist.length);
      setCurrentIndex(randomIndex);
    }
  }, []);

  const currentSong: SongItem = myPlaylist[currentIndex];

  // 2. 核心控制监听
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // 3. 5秒无触碰自动收起（如果打开了切歌菜单，不自动收起）
  useEffect(() => {
    if (isExpanded && isPlaying && !showMenuList) {
      const timer = setTimeout(() => setIsExpanded(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, isPlaying, currentIndex, showMenuList]);

  // 更新进度条时间
  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  // 4. 手动拉动调节歌曲进度（拖动进度条）
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  // 5. 丝滑拖拽判定
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, input, ul, li')) return;
    setIsDragging(true);
    hasDraggedRef.current = false;
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

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) hasDraggedRef.current = true;

      let newX = Math.max(10, Math.min(window.innerWidth - (isExpanded ? 300 : 60), dragStart.current.posX + deltaX));
      let newY = Math.max(10, Math.min(window.innerHeight - (showMenuList ? 260 : 80), dragStart.current.posY + deltaY));
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
  }, [isDragging, isExpanded, showMenuList, position]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } 
      else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        const initPlay = () => { audioRef.current?.play(); setIsPlaying(true); document.removeEventListener('click', initPlay); };
        document.addEventListener('click', initPlay);
      }); }
    }
  };

  const playNext = () => {
    setCurrentIndex((prev) => (prev === myPlaylist.length - 1 ? 0 : prev + 1));
  };

  if (!mounted || !currentSong) return null;

  const safeAvatar = currentSong.avatar.startsWith('http') ? currentSong.avatar.replace('http://', 'https://') : currentSong.avatar;
  const safeMusicUrl = currentSong.musicUrl.startsWith('http') ? currentSong.musicUrl.replace('http://', 'https://') : currentSong.musicUrl;

  // 格式化时间辅助函数 (00:00)
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      style={{
        position: 'fixed', top: `${position.y}px`, left: `${position.x}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(16px)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.18)', borderRadius: isExpanded ? '18px' : '50%',
        padding: isExpanded ? '14px' : '4px', display: 'flex', flexDirection: 'column',
        zIndex: 9999, width: isExpanded ? '300px' : '52px',
        height: isExpanded ? 'auto' : '52px',
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
        cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', touchAction: 'none',
      }}
    >
      <audio 
        ref={audioRef} src={safeMusicUrl} onEnded={playNext} 
        onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} 
      />

        {/* 主面板内容区 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isExpanded ? '12px' : '0px', width: '100%' }}>
        {/* ==================== 状态一：收起（光盘） ==================== */}
        {!isExpanded && (
          <div onClick={(e) => { e.stopPropagation(); if (!hasDraggedRef.current) setIsExpanded(true); }} style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
            <img src={safeAvatar} alt="cd" style={{ width: '100%', height: '100%', objectFit: 'cover', animation: isPlaying ? 'spin 6s linear infinite' : 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '8px', backgroundColor: '#111', borderRadius: '50%', border: '2px solid #fff' }} />
          </div>
        )}

        {/* ==================== 状态二：展开 ==================== */}
        {isExpanded && (
          <>
            {/* 头像点击缩回小球 */}
            <div onClick={(e) => { e.stopPropagation(); setIsExpanded(false); setShowMenuList(false); }} style={{ width: '46px', height: '46px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}>
              <img src={safeAvatar} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', animation: isPlaying ? 'spin 6s linear infinite' : 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
              {/* 📜 点击该歌曲信息区域可以弹出/收起内置点歌菜单 */}
              <div 
                onClick={(e) => { e.stopPropagation(); setShowMenuList(!showMenuList); }}
                style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', marginBottom: '4px' }}
                title="点击展开/收起歌曲选择列表"
              >
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentSong.songName} <span style={{ fontSize: '10px', color: '#0070f3', marginLeft: '4px' }}>{showMenuList ? '▲' : '▼ 换歌'}</span>
                </span>
                <span style={{ fontSize: '11px', color: '#555' }}>{currentSong.singer}</span>
              </div>

              {/* ⏱ 进度条控制调节 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '9px', color: '#666', fontFamily: 'monospace' }}>{formatTime(currentTime)}</span>
                <input 
                  type="range" min="0" max={duration || 0} step="0.5"
                  value={currentTime} onChange={handleProgressChange}
                  style={{ flexGrow: 1, height: '3px', accentColor: '#222', cursor: 'pointer', margin: 0 }}
                />
                <span style={{ fontSize: '9px', color: '#666', fontFamily: 'monospace' }}>{formatTime(duration)}</span>
              </div>

              {/* 控制按钮底栏 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? myPlaylist.length - 1 : prev - 1)); }} style={btnStyle}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
                  <button onClick={togglePlay} style={{ ...btnStyle, transform: 'scale(1.2)' }}>{isPlaying ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}</button>
                  <button onClick={(e) => { e.stopPropagation(); playNext(); }} style={btnStyle}><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px' }}>🔊</span>
                  <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ width: '45px', height: '3px', accentColor: '#222', cursor: 'pointer' }} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ==================== 📜 换歌列表弹出菜单组件 ==================== */}
      {isExpanded && showMenuList && (
        <div 
          style={{
            marginTop: '10px', borderTop: '1px solid #eaeaea', paddingTop: '8px',
            maxHeight: '140px', overflowY: 'auto', width: '100%',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {myPlaylist.map((song, index) => (
              <li
                key={song.id}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                style={{
                  fontSize: '11px', padding: '6px 8px', borderRadius: '6px',
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                  backgroundColor: index === currentIndex ? 'rgba(0,112,243,0.08)' : 'transparent',
                  color: index === currentIndex ? '#0070f3' : '#333',
                  fontWeight: index === currentIndex ? 'bold' : 'normal',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = index === currentIndex ? 'rgba(0,112,243,0.08)' : '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index === currentIndex ? 'rgba(0,112,243,0.08)' : 'transparent'}
              >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                  {song.songName}
                </span>
                <span style={{ opacity: 0.6 }}>{song.singer}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const btnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333' };
