'use client';

import React, { useEffect, useRef, useState } from 'react';
import { myPlaylist } from './playlist'; // 确保你的歌单文件还在

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // 音量 0 ~ 1
  
  // 新增状态：是否处于展开状态（默认不展开，呈现光盘小球）
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 位置状态（默认左下角靠边一点）
  const [position, setPosition] = useState({ x: 20, y: 150 }); 
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const currentSong = myPlaylist[currentIndex];

  // 1. 自动切歌与初始互动播放
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 2. 核心：5秒无操作自动收起功能
  useEffect(() => {
    // 只有当用户主动展开、且正在播放时，才启动5秒倒计时自动收起
    if (isExpanded && isPlaying) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      return () => clearTimeout(timer); // 期间如果状态改变，清除定时器
    }
  }, [isExpanded, isPlaying, currentIndex]); // 切歌或暂停都会重置5秒

  // 3. 拖拽逻辑（支持电脑鼠标与手机触摸）
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // 如果点的是按钮、进度条或音量条，不触发拖拽
    if ((e.target as HTMLElement).closest('button, input')) return;

    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // 记录刚点击时鼠标的位置和播放器当时的位置
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
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      // 计算鼠标位移量
      const deltaX = clientX - dragStart.current.x;
      const deltaY = clientY - dragStart.current.y;

      // 计算新的位置（注意：这里我们是以浏览器的【左下角】为基准定位，所以Y轴移动方向要反过来）
      let newX = dragStart.current.posX + deltaX;
      let newY = dragStart.current.posY - deltaY;

      // 边缘碰撞边界处理，防止拖出屏幕外
      newX = Math.max(10, Math.min(window.innerWidth - (isExpanded ? 280 : 60), newX));
      newY = Math.max(10, Math.min(window.innerHeight - 80, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
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

  // 4. 控制播放函数
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡，防止触发外层的展开/收起
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

  if (!currentSong) return null;

  return (
    <div
      ref={playerRef}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      style={{
        position: 'fixed',
        bottom: `${position.y}px`,
        left: `${position.x}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        borderRadius: isExpanded ? '16px' : '50%', // 展开是方框，收起是完美的圆形光盘
        padding: isExpanded ? '12px' : '4px',
        display: 'flex',
        alignItems: 'center',
        gap: isExpanded ? '12px' : '0px',
        zIndex: 9999,
        width: isExpanded ? '280px' : '52px', // 宽度动态变化
        height: '52px',
        transition: isDragging ? 'none' : 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-radius 0.4s', // 收展时的弹性动画
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      <audio ref={audioRef} src={currentSong.musicUrl} onEnded={() => setCurrentIndex((prev) => (prev === myPlaylist.length - 1 ? 0 : prev + 1))} />

      {/* ==================== 状态一：收起时的旋转光盘小球 ==================== */}
      {!isExpanded && (
        <div 
          onClick={() => setIsExpanded(true)}
          style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
        >
          <img
            src={currentSong.avatar}
            alt="music-cd"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              animation: isPlaying ? 'spin 6s linear infinite' : 'none',
            }}
          />
          {/* 光盘中心的黑胶小圆点 */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '8px', backgroundColor: '#111', borderRadius: '50%', border: '2px solid #fff' }} />
        </div>
      )}

      {/* ==================== 状态二：展开时的完整播放器 ==================== */}
      {isExpanded && (
        <>
          {/* 左侧头像：点击可以收起播放器 */}
          <div 
            onClick={() => setIsExpanded(false)}
            style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
          >
            <img src={currentSong.avatar} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', animation: isPlaying ? 'spin 6s linear infinite' : 'none' }} />
          </div>

          {/* 右侧信息与控制区 */}
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
            {/* 歌曲与歌手名字 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                {currentSong.songName}
              </span>
              <span style={{ fontSize: '10px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60px' }}>
                {currentSong.singer}
              </span>
            </div>

            {/* 控制器与音量调节 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* 切歌/暂停按钮组 */}
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

              {/* 三、音量调节滑动条 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: '#666' }}>🔊</span>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{
                    width: '50px',
                    height: '3px',
                    accentColor: '#444',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* 全局动画样式 */}
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
