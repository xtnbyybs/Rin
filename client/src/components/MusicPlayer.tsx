'use client';

import React, { useEffect, useRef, useState } from 'react';
import { myPlaylist } from './playlist';

interface SongDetails {
  songName: string;
  singer: string;
  avatar: string;
  musicUrl: string;
}

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 动态获取的歌曲详情状态
  const [songDetails, setSongDetails] = useState<SongDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 位置状态（改用 top/left 体系，完美杜绝拖拽抖动）
  const [position, setPosition] = useState({ x: 20, y: 400 }); 
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // 1. 初始化位置（放在左下角）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPosition({ x: 20, y: window.innerHeight - 150 });
    }
  }, []);

  // 2. 核心：切换歌曲时，动态通过 API 请求最新的不失效直链
  useEffect(() => {
    const currentTrack = myPlaylist[currentIndex];
    if (!currentTrack) return;

    setIsLoading(true);
    const apiUrl = `https://api.xtby.xyz/API/yy/kugou.php?type=mhash&hash=${currentTrack.hash}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const singer = data.authors?.[0]?.author_name || data.singer || '未知歌手';
        const songName = data.songname || currentTrack.songName;
        let rawAvatar = data.authors?.[0]?.avatar || data.mvicon || '';
        const avatar = rawAvatar.replace('{size}', '400').replace('http://', 'https://');
        let rawMusicUrl = data.downurl || data.mp3data?.downurl || data.mvdata?.le?.downurl || '';
        const musicUrl = rawMusicUrl.replace('http://', 'https://');

        setSongDetails({ songName, singer, avatar, musicUrl });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('动态解析歌曲失败:', err);
        setIsLoading(false);
      });
  }, [currentIndex]);

  // 3. 当解析完新歌且处于播放状态时，触发播放
  useEffect(() => {
    if (isPlaying && songDetails?.musicUrl && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [songDetails, isPlaying]);

  // 控制音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 4. 5秒无操作自动收起
  useEffect(() => {
    if (isExpanded && isPlaying) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, isPlaying, currentIndex]);

  // 5. 丝滑拖拽逻辑
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return;

    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStart.current = {
      x: clientX,
      y: clientY,
      posX: position.x,
      posY: position.y
    };
  };

  useEffect(() => {
    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      // 关键：阻止移动端的默认滚动行为，彻底解决背景跟着乱动、卡顿的现象
      if (e.cancelable) e.preventDefault();

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - dragStart.current.x;
      const deltaY = clientY - dragStart.current.y;

      let newX = dragStart.current.posX + deltaX;
      let newY = dragStart.current.posY + deltaY;

      // 边缘碰撞限制
      newX = Math.max(10, Math.min(window.innerWidth - (isExpanded ? 280 : 60), newX));
      newY = Math.max(10, Math.min(window.innerHeight - 70, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

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
  }, [isDragging, isExpanded]);

  // 播放暂停切换
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

  const playNext = () => {
    setCurrentIndex((prev) => (prev === myPlaylist.length - 1 ? 0 : prev + 1));
  };

  const playPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? myPlaylist.length - 1 : prev - 1));
  };

  // 即使没解析出来，也保留基础占位，防止拖拽组件直接消失
  const displayTitle = songDetails?.songName || myPlaylist[currentIndex]?.songName || '加载中...';
  const displaySinger = songDetails?.singer || '提示';
  const displayAvatar = songDetails?.avatar || 'https://via.placeholder.com/150';

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
        touchAction: 'none', // 🔥 核心：彻底禁止移动端手势干扰网页，防止网页卡顿、跟着动
      }}
    >
      {songDetails?.musicUrl && (
        <audio ref={audioRef} src={songDetails.musicUrl} onEnded={playNext} />
      )}

{/* ==================== 收起状态（黑胶光盘） ==================== */}
      {!isExpanded && (
        <div 
          onClick={() => setIsExpanded(true)}
          style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
        >
          <img
            src={displayAvatar}
            alt="cd"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              animation: isPlaying && !isLoading ? 'spin 6s linear infinite' : 'none',
              opacity: isLoading ? 0.5 : 1
            }}
          />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '8px', backgroundColor: '#111', borderRadius: '50%', border: '2px solid #fff' }} />
        </div>
      )}

      {/* ==================== 展开状态 ==================== */}
      {isExpanded && (
        <>
          <div 
            onClick={() => setIsExpanded(false)}
            style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}
          >
            <img 
              src={displayAvatar} 
              alt="cover" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', animation: isPlaying && !isLoading ? 'spin 6s linear infinite' : 'none' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                {isLoading ? '解析中...' : displayTitle}
              </span>
              <span style={{ fontSize: '10px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60px' }}>
                {isLoading ? '⏱' : displaySinger}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* 控制按钮 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={(e) => { e.stopPropagation(); playPrev(); }} style={btnStyle}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                <button onClick={togglePlay} style={{ ...btnStyle, transform: 'scale(1.1)', opacity: isLoading ? 0.5 : 1 }} disabled={isLoading}>
                  {isPlaying ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
                <button onClick={(e) => { e.stopPropagation(); playNext(); }} style={btnStyle}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
              </div>

              {/* 音量滑块 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px' }}>🔊</span>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{ width: '50px', height: '3px', accentColor: '#444', cursor: 'pointer' }}
                />
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
